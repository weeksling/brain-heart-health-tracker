import AsyncStorage from '@react-native-async-storage/async-storage';

interface DebugLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'STEP';
  category: string;
  message: string;
  data?: string;
}

interface DebugStats {
  totalLogs: number;
  crashCount: number;
  lastActivity: string;
}

class DebugLogger {
  private logs: DebugLog[] = [];
  private readonly STORAGE_KEY = 'debug_logs';
  private readonly STATS_KEY = 'debug_stats';
  private readonly CRASH_FLAG_KEY = 'app_crash_flag';

  constructor() {
    this.loadLogs();
    this.checkForCrashes();
  }

  private async loadLogs(): Promise<void> {
    try {
      const storedLogs = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch (error) {
      console.error('Failed to load debug logs:', error);
    }
  }

  private async checkForCrashes(): Promise<void> {
    try {
      const crashFlag = await AsyncStorage.getItem(this.CRASH_FLAG_KEY);
      if (crashFlag === 'true') {
        // App crashed in previous session
        await this.step('CRASH_DETECTION', 'App crash detected from previous session');
        await this.incrementCrashCounter();
        await AsyncStorage.removeItem(this.CRASH_FLAG_KEY);
      }
      
      // Set crash flag for this session
      await AsyncStorage.setItem(this.CRASH_FLAG_KEY, 'true');
    } catch (error) {
      console.error('Failed to check for crashes:', error);
    }
  }

  private async incrementCrashCounter(): Promise<void> {
    try {
      const stats = await this.getStats();
      stats.crashCount += 1;
      await AsyncStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to increment crash counter:', error);
    }
  }

  async step(category: string, message: string, data?: any): Promise<void> {
    await this.log('STEP', category, message, data);
    // Force immediate save for step logs
    await this.forceSave();
  }

  async error(category: string, message: string, data?: any): Promise<void> {
    await this.log('ERROR', category, message, data);
    // Force immediate save for error logs
    await this.forceSave();
  }

  async warn(category: string, message: string, data?: any): Promise<void> {
    await this.log('WARN', category, message, data);
    // Force immediate save for warning logs
    await this.forceSave();
  }

  async info(category: string, message: string, data?: any): Promise<void> {
    await this.log('INFO', category, message, data);
  }

  async logCrash(category: string, error: any, context?: any): Promise<void> {
    const crashData = {
      error: error?.message || 'Unknown error',
      name: error?.name || 'Error',
      stack: error?.stack?.substring(0, 500) || 'No stack trace',
      context: context || {}
    };
    
    await this.log('ERROR', category, `CRASH: ${crashData.error}`, crashData);
    await this.forceSave();
    
    // Set crash flag immediately
    try {
      await AsyncStorage.setItem(this.CRASH_FLAG_KEY, 'true');
    } catch (e) {
      console.error('Failed to set crash flag:', e);
    }
  }

  private async log(level: DebugLog['level'], category: string, message: string, data?: any): Promise<void> {
    try {
      const logEntry: DebugLog = {
        timestamp: new Date().toISOString(),
        level,
        category,
        message,
        data: data ? JSON.stringify(data) : undefined,
      };

      this.logs.push(logEntry);

      // Keep only the last 500 logs to prevent memory issues
      if (this.logs.length > 500) {
        this.logs = this.logs.slice(-500);
      }

      // Auto-save every 10 logs or for important levels
      if (this.logs.length % 10 === 0 || level === 'ERROR' || level === 'STEP') {
        await this.persistLogs();
      }
    } catch (error) {
      console.error('Failed to add log entry:', error);
    }
  }

  private async persistLogs(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
      
      // Update stats
      const stats: DebugStats = {
        totalLogs: this.logs.length,
        crashCount: (await this.getStats()).crashCount,
        lastActivity: new Date().toISOString()
      };
      await AsyncStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to persist logs:', error);
    }
  }

  async forceSave(): Promise<void> {
    await this.persistLogs();
  }

  async getRecentLogs(count: number = 50): Promise<DebugLog[]> {
    await this.loadLogs();
    return this.logs.slice(-count);
  }

  async getAllLogs(): Promise<DebugLog[]> {
    await this.loadLogs();
    return [...this.logs];
  }

  async clearLogs(): Promise<void> {
    this.logs = [];
    await AsyncStorage.removeItem(this.STORAGE_KEY);
    await AsyncStorage.removeItem(this.STATS_KEY);
    await AsyncStorage.removeItem(this.CRASH_FLAG_KEY);
  }

  async exportLogs(): Promise<string> {
    await this.loadLogs();
    const stats = await this.getStats();
    
    let exportText = `=== DEBUG LOGS EXPORT ===\n`;
    exportText += `Export Time: ${new Date().toISOString()}\n`;
    exportText += `Total Logs: ${stats.totalLogs}\n`;
    exportText += `Crash Count: ${stats.crashCount}\n`;
    exportText += `Last Activity: ${stats.lastActivity}\n`;
    exportText += `\n=== LOG ENTRIES ===\n`;
    
    for (const log of this.logs) {
      exportText += `[${log.timestamp}] ${log.level} ${log.category}: ${log.message}\n`;
      if (log.data) {
        exportText += `  Data: ${log.data}\n`;
      }
    }
    
    return exportText;
  }

  async getStats(): Promise<DebugStats> {
    try {
      const storedStats = await AsyncStorage.getItem(this.STATS_KEY);
      if (storedStats) {
        return JSON.parse(storedStats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
    
    return {
      totalLogs: this.logs.length,
      crashCount: 0,
      lastActivity: new Date().toISOString()
    };
  }

  // Clear crash flag when app exits gracefully
  async markGracefulExit(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CRASH_FLAG_KEY);
    } catch (error) {
      console.error('Failed to mark graceful exit:', error);
    }
  }
}

export const debugLogger = new DebugLogger();