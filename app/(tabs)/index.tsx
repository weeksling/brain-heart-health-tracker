import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MinimalTestScreen() {
  const handleTestButton = () => {
    Alert.alert(
      'Test Success!',
      'The app is working correctly. This means the crash is likely caused by the Health Connect module.',
      [{ text: 'OK' }]
    );
  };

  const handleCrashTest = () => {
    // Intentionally throw an error to test error handling
    throw new Error('Test error to verify error handling is working');
  };

  const handleAsyncCrashTest = async () => {
    // Test async error handling
    throw new Error('Test async error to verify error handling is working');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>🧪 Minimal Test App</Text>
          <Text style={styles.subtitle}>Testing basic functionality</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ App Status</Text>
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>✅ React Native: Working</Text>
            <Text style={styles.statusText}>✅ JavaScript: Working</Text>
            <Text style={styles.statusText}>✅ UI Components: Working</Text>
            <Text style={styles.statusText}>✅ Error Handlers: Loaded</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Test Functions</Text>
          
          <TouchableOpacity
            style={[styles.button, styles.successButton]}
            onPress={handleTestButton}
          >
            <Text style={styles.buttonText}>Test Alert</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.warningButton]}
            onPress={handleCrashTest}
          >
            <Text style={styles.buttonText}>Test Crash Handler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.errorButton]}
            onPress={handleAsyncCrashTest}
          >
            <Text style={styles.buttonText}>Test Async Crash Handler</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Device Info</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Platform: Android</Text>
            <Text style={styles.infoText}>minSdkVersion: 26</Text>
            <Text style={styles.infoText}>Expo SDK: 52</Text>
            <Text style={styles.infoText}>React Native: 0.76.9</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Next Steps</Text>
          <View style={styles.stepsBox}>
            <Text style={styles.stepText}>1. If you see this screen, the basic app works</Text>
            <Text style={styles.stepText}>2. Test the buttons to verify error handling</Text>
            <Text style={styles.stepText}>3. The crash is likely from Health Connect module</Text>
            <Text style={styles.stepText}>4. We can gradually add features back</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 12,
  },
  statusBox: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  statusText: {
    fontSize: 14,
    color: '#155724',
    marginBottom: 4,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  successButton: {
    backgroundColor: '#28a745',
  },
  warningButton: {
    backgroundColor: '#ffc107',
  },
  errorButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#d1ecf1',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#17a2b8',
  },
  infoText: {
    fontSize: 14,
    color: '#0c5460',
    marginBottom: 4,
  },
  stepsBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  stepText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 6,
  },
});
