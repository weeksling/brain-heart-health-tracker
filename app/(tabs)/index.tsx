import { debugLogger } from '@/services/DebugLogger';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DebugLog {
  timestamp: string;
  level: string;
  category: string;
  message: string;
  data?: string;
}

export default function MinimalTestScreen() {
  const [showDebugLogs, setShowDebugLogs] = useState(false);
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);

  useEffect(() => {
    loadDebugLogs();
    debugLogger.step('HOME_SCREEN', 'Home screen mounted');
  }, []);

  const loadDebugLogs = async () => {
    try {
      const logs = await debugLogger.getRecentLogs(100);
      setDebugLogs(logs);
      
      // Check for crashes
      const crashLogs = logs.filter(log => 
        log.message.includes('CRASH') || 
        log.message.includes('Critical Error') ||
        log.level === 'ERROR'
      );
      
      if (crashLogs.length > 0) {
        debugLogger.step('HOME_SCREEN', 'Found crash logs from previous sessions', { 
          crashCount: crashLogs.length 
        });
      }
    } catch (error) {
      console.error('Failed to load debug logs:', error);
    }
  };

  const handleTestButton = () => {
    debugLogger.step('HOME_TEST', 'Test button pressed');
    Alert.alert(
      'Test Success!',
      'The app is working correctly. This means any crashes are likely caused by specific functionality.',
      [{ text: 'OK' }]
    );
  };

  const handleCrashTest = () => {
    debugLogger.step('HOME_TEST', 'Crash test initiated');
    setTimeout(() => {
      debugLogger.error('HOME_TEST', 'Intentional test crash');
      throw new Error('🧪 Delayed test error - should be caught by error handlers');
    }, 100);
  };

  const handleAsyncCrashTest = async () => {
    debugLogger.step('HOME_TEST', 'Async crash test initiated');
    return Promise.reject(new Error('🧪 Promise rejection test - should be caught by error handlers'));
  };

  const handleShowDebugLogs = async () => {
    try {
      await loadDebugLogs();
      setShowDebugLogs(!showDebugLogs);
    } catch (error) {
      Alert.alert("Error", "Failed to load debug logs");
    }
  };

  const handleClearLogs = async () => {
    try {
      await debugLogger.clearLogs();
      setDebugLogs([]);
      Alert.alert("Success", "Debug logs cleared");
    } catch (error) {
      Alert.alert("Error", "Failed to clear debug logs");
    }
  };

  const handleExportLogs = async () => {
    try {
      const exportedLogs = await debugLogger.exportLogs();
      Alert.alert(
        "Debug Logs Exported",
        `Found ${debugLogs.length} log entries. Logs are ready for sharing.`,
        [
          { text: "OK" },
          {
            text: "Show Sample",
            onPress: () => {
              const sample = exportedLogs.split('\n').slice(-10).join('\n');
              Alert.alert("Recent Logs Sample", sample);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to export debug logs");
    }
  };

  const renderDebugLogs = () => {
    if (!showDebugLogs) return null;

    const crashLogs = debugLogs.filter(log => 
      log.message.includes('CRASH') || 
      log.message.includes('Critical Error') ||
      log.level === 'ERROR'
    );

    return (
      <View style={styles.debugContainer}>
        <View style={styles.debugHeader}>
          <Text style={styles.debugTitle}>
            Debug Logs ({debugLogs.length}) {crashLogs.length > 0 && `- ${crashLogs.length} CRASHES`}
          </Text>
          <View style={styles.debugButtons}>
            <TouchableOpacity
              style={[styles.debugButton, { backgroundColor: '#FF5722' }]}
              onPress={handleClearLogs}
            >
              <Text style={styles.debugButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.debugButton, { backgroundColor: '#2196F3' }]}
              onPress={handleExportLogs}
            >
              <Text style={styles.debugButtonText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.debugButton, { backgroundColor: '#666' }]}
              onPress={() => setShowDebugLogs(false)}
            >
              <Text style={styles.debugButtonText}>Hide</Text>
            </TouchableOpacity>
          </View>
        </View>

        {crashLogs.length > 0 && (
          <View style={styles.crashSummary}>
            <Text style={styles.crashTitle}>🚨 CRASH SUMMARY ({crashLogs.length} crashes found)</Text>
            {crashLogs.slice(-5).map((log, index) => (
              <Text key={index} style={styles.crashText}>
                [{log.timestamp.split('T')[1]?.split('.')[0]}] {log.category}: {log.message}
              </Text>
            ))}
          </View>
        )}

        <ScrollView style={styles.debugLogsList} nestedScrollEnabled>
          {debugLogs.slice(-50).map((log, index) => (
            <View key={index} style={styles.debugLogItem}>
              <Text style={[
                styles.debugLogText,
                { 
                  color: log.level === 'ERROR' ? '#F44336' : 
                         log.level === 'WARN' ? '#FF9800' :
                         log.level === 'STEP' ? '#4CAF50' : '#333'
                }
              ]}>
                [{log.timestamp.split('T')[1]?.split('.')[0]}] {log.level} {log.category}: {log.message}
              </Text>
              {log.data && (
                <Text style={styles.debugLogData}>
                  {log.data}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🧠❤️ Brain Heart Health Tracker</Text>
          <Text style={styles.subtitle}>Debug & Test Version</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>� Debug Information</Text>
          <Text style={styles.debugInfo}>
            Total Logs: {debugLogs.length}
          </Text>
          <Text style={styles.debugInfo}>
            Crashes Found: {debugLogs.filter(log => 
              log.message.includes('CRASH') || log.level === 'ERROR'
            ).length}
          </Text>
          <Text style={styles.debugInfo}>
            Last Activity: {debugLogs.length > 0 ? 
              debugLogs[debugLogs.length - 1]?.timestamp.split('T')[1]?.split('.')[0] || 'None' : 'None'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Debug Controls</Text>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleShowDebugLogs}
          >
            <Text style={styles.buttonText}>
              {showDebugLogs ? '📋 Hide Debug Logs' : '📋 Show Debug Logs'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.warningButton]}
            onPress={() => loadDebugLogs()}
          >
            <Text style={styles.buttonText}>🔄 Refresh Logs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Basic App Tests</Text>
          
          <TouchableOpacity
            style={[styles.button, styles.successButton]}
            onPress={handleTestButton}
          >
            <Text style={styles.buttonText}>✅ Test Alert</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleCrashTest}
          >
            <Text style={styles.buttonText}>💥 Test Crash Handler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleAsyncCrashTest}
          >
            <Text style={styles.buttonText}>⚡ Test Async Error</Text>
          </TouchableOpacity>
        </View>

        {renderDebugLogs()}

        <View style={styles.section}>
          <Text style={styles.instructions}>
            💡 <Text style={styles.bold}>Instructions:</Text>
            {'\n'}• Use "Show Debug Logs" to see all app activity
            {'\n'}• Check for crashes before testing Progress screen  
            {'\n'}• Logs persist across app crashes and restarts
            {'\n'}• Use test buttons to verify error handling works
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  debugInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  warningButton: {
    backgroundColor: '#FF9800',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  debugContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 400,
  },
  debugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  debugButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  debugButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  crashSummary: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  crashTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
  },
  crashText: {
    fontSize: 12,
    color: '#d32f2f',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  debugLogsList: {
    maxHeight: 250,
  },
  debugLogItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  debugLogText: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  debugLogData: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#666',
    marginTop: 2,
    paddingLeft: 10,
  },
  instructions: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
});
