import AsyncStorage from '@react-native-async-storage/async-storage';

interface DebugLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'STEP';
  category: string;
  message: string;
  data?: any;
}

class DebugLogger {
  private static instance: DebugLogger;
  private logs: DebugLog[] = [];
  private readonly MAX_LOGS = 500;
  private readonly STORAGE_KEY = '@health_app_debug_logs';

  private constructor() {
    this.initializeLogger();
  }

  public static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  private async initializeLogger() {
    try {
      // Load existing logs from storage
      const storedLogs = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
        console.log('🔧 DebugLogger: Loaded', this.logs.length, 'existing logs');
      }
    } catch (error) {
      console.error('🚨 DebugLogger: Failed to load existing logs:', error);
    }
  }

  private async persistLogs() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('🚨 DebugLogger: Failed to persist logs:', error);
    }
  }

  private addLog(level: DebugLog['level'], category: string, message: string, data?: any) {
    const log: DebugLog = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: data ? JSON.stringify(data) : undefined,
    };

    this.logs.push(log);
    
    // Keep only the most recent logs
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // Log to console as well
    const logMessage = `[${log.timestamp}] ${level} ${category}: ${message}`;
    switch (level) {
      case 'ERROR':
        console.error(logMessage, data);
        break;
      case 'WARN':
        console.warn(logMessage, data);
        break;
      case 'STEP':
        console.log('📍', logMessage, data);
        break;
      default:
        console.log(logMessage, data);
    }

    // Persist immediately for critical logs
    if (level === 'ERROR' || level === 'STEP') {
      this.persistLogs();
    }
  }

  public step(category: string, message: string, data?: any) {
    this.addLog('STEP', category, message, data);
  }

  public info(category: string, message: string, data?: any) {
    this.addLog('INFO', category, message, data);
  }

  public warn(category: string, message: string, data?: any) {
    this.addLog('WARN', category, message, data);
  }

  public error(category: string, message: string, data?: any) {
    this.addLog('ERROR', category, message, data);
  }

  public async getLogs(): Promise<DebugLog[]> {
    // Ensure we have the latest logs from storage
    try {
      const storedLogs = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch (error) {
      console.error('🚨 DebugLogger: Failed to get latest logs:', error);
    }
    return [...this.logs];
  }

  public async getRecentLogs(count: number = 50): Promise<DebugLog[]> {
    const allLogs = await this.getLogs();
    return allLogs.slice(-count);
  }

  public async getLogsByCategory(category: string): Promise<DebugLog[]> {
    const allLogs = await this.getLogs();
    return allLogs.filter(log => log.category === category);
  }

  public async clearLogs() {
    this.logs = [];
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      console.log('🔧 DebugLogger: Logs cleared');
    } catch (error) {
      console.error('🚨 DebugLogger: Failed to clear logs:', error);
    }
  }

  public async exportLogs(): Promise<string> {
    const allLogs = await this.getLogs();
    return allLogs.map(log => 
      `[${log.timestamp}] ${log.level} ${log.category}: ${log.message}${log.data ? ` | Data: ${log.data}` : ''}`
    ).join('\n');
  }

  // Special method for capturing crashes
  public async logCrash(category: string, error: any, context?: any) {
    const crashData = {
      error: error?.toString(),
      stack: error?.stack,
      context,
      timestamp: new Date().toISOString(),
    };
    
    this.addLog('ERROR', category, 'CRASH DETECTED', crashData);
    
    // Force immediate persistence
    await this.persistLogs();
  }
}

export const debugLogger = DebugLogger.getInstance();