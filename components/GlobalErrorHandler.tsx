import React, { Component, ReactNode } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GlobalErrorState {
  hasError: boolean;
  error: any;
  errorInfo: any;
  errorStack: string[];
  nativeError: boolean;
}

interface Props {
  children: ReactNode;
}

export class GlobalErrorHandler extends Component<Props, GlobalErrorState> {
  private errorLogTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorStack: [],
      nativeError: false,
    };

    // Set up global error handlers immediately
    this.setupGlobalErrorHandlers();
  }

  setupGlobalErrorHandlers = () => {
    // Catch unhandled promise rejections
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.logError('Console Error', args);
      originalConsoleError.apply(console, args);
    };

    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      this.logError('Console Warning', args);
      originalConsoleWarn.apply(console, args);
    };

    // Global promise rejection handler
    const handleUnhandledRejection = (event: any) => {
      console.error('Unhandled Promise Rejection:', event);
      this.showError('Unhandled Promise Rejection', event, true);
    };

    // Add promise rejection listener
    if ((global as any).HermesInternal?.hasPromiseRejectionTracker) {
      (global as any).HermesInternal.enablePromiseRejectionTracker({
        allRejections: true,
        onUnhandled: handleUnhandledRejection,
        onHandled: () => {},
      });
    }

    // Global error handler for any uncaught errors
    const originalHandler = (global as any).ErrorUtils?.getGlobalHandler();
    (global as any).ErrorUtils?.setGlobalHandler((error: any, isFatal: boolean) => {
      console.error('Global Error Handler:', error, 'isFatal:', isFatal);
      this.showError('Global Error', error, isFatal);
      
      // Call original handler if it exists
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });

    // Catch Metro/bundler errors
    if (__DEV__) {
      (global as any).__BUNDLE_START_TIME__ = (global as any).__BUNDLE_START_TIME__ || Date.now();
    }
  };

  logError = (type: string, args: any[]) => {
    const timestamp = new Date().toISOString();
    const errorMessage = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');

    this.setState(prevState => ({
      errorStack: [
        ...prevState.errorStack,
        `[${timestamp}] ${type}: ${errorMessage}`
      ].slice(-50) // Keep last 50 errors
    }));
  };

  showError = (type: string, error: any, isFatal: boolean = false) => {
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    const errorStack = error?.stack || 'No stack trace available';
    
    this.setState({
      hasError: true,
      error: {
        type,
        message: errorMessage,
        stack: errorStack,
        isFatal,
        timestamp: new Date().toISOString(),
      },
      nativeError: isFatal,
    });

    // Show alert for immediate feedback
    if (isFatal) {
      Alert.alert(
        'App Error Detected',
        `${type}: ${errorMessage}`,
        [{ text: 'View Details', onPress: () => {} }]
      );
    }
  };

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorState> {
    console.error('React Error Boundary triggered:', error);
    return {
      hasError: true,
      error: {
        type: 'React Error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      }
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React componentDidCatch:', error, errorInfo);
    this.setState({
      errorInfo,
    });

    this.logError('React Component Error', [error.message, errorInfo.componentStack]);
  }

  handleRestart = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      nativeError: false,
    });
  };

  handleShowFullLog = () => {
    const fullLog = this.state.errorStack.join('\n\n');
    Alert.alert(
      'Full Error Log',
      fullLog || 'No errors logged yet',
      [
        { text: 'Copy to Clipboard', onPress: () => {
          // In a real app, you'd use Clipboard API here
          console.log('Error log:', fullLog);
        }},
        { text: 'Close' }
      ],
      { cancelable: true }
    );
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorStack, nativeError } = this.state;
      const { width, height } = Dimensions.get('window');
      const earlyErrors = (global as any).__EARLY_ERROR_DEBUG__?.getErrors?.() || [];

      return (
        <SafeAreaView style={[styles.container, { width, height }]}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <Text style={styles.emoji}>🚨</Text>
              <Text style={styles.title}>
                {nativeError ? 'Critical App Error' : 'App Error Detected'}
              </Text>
              <Text style={styles.subtitle}>
                Don't worry - this information will help fix the issue
              </Text>
            </View>

            <View style={styles.errorSection}>
              <Text style={styles.sectionTitle}>Error Details:</Text>
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  <Text style={styles.errorLabel}>Type:</Text> {error?.type || 'Unknown'}
                </Text>
                <Text style={styles.errorText}>
                  <Text style={styles.errorLabel}>Message:</Text> {error?.message || 'No message'}
                </Text>
                <Text style={styles.errorText}>
                  <Text style={styles.errorLabel}>Time:</Text> {error?.timestamp || 'Unknown'}
                </Text>
                <Text style={styles.errorText}>
                  <Text style={styles.errorLabel}>Fatal:</Text> {error?.isFatal ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>

            {earlyErrors.length > 0 && (
              <View style={styles.logSection}>
                <Text style={styles.sectionTitle}>Early Startup Errors ({earlyErrors.length}):</Text>
                <ScrollView style={styles.logBox}>
                  {earlyErrors.slice(-10).map((earlyError: any, index: number) => (
                    <Text key={index} style={styles.logText}>
                      [{earlyError.timestamp}] {earlyError.type}: {earlyError.message}
                    </Text>
                  ))}
                </ScrollView>
              </View>
            )}

            {error?.stack && (
              <View style={styles.stackSection}>
                <Text style={styles.sectionTitle}>Stack Trace:</Text>
                <ScrollView style={styles.stackBox} horizontal>
                  <Text style={styles.stackText}>{error.stack}</Text>
                </ScrollView>
              </View>
            )}

            {errorInfo?.componentStack && (
              <View style={styles.stackSection}>
                <Text style={styles.sectionTitle}>Component Stack:</Text>
                <ScrollView style={styles.stackBox} horizontal>
                  <Text style={styles.stackText}>{errorInfo.componentStack}</Text>
                </ScrollView>
              </View>
            )}

            <View style={styles.logSection}>
              <Text style={styles.sectionTitle}>Recent Errors ({errorStack.length}):</Text>
              <ScrollView style={styles.logBox}>
                {errorStack.slice(-10).map((log, index) => (
                  <Text key={index} style={styles.logText}>{log}</Text>
                ))}
                {errorStack.length === 0 && (
                  <Text style={styles.logText}>No recent errors logged</Text>
                )}
              </ScrollView>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={this.handleRestart}
              >
                <Text style={styles.buttonTextPrimary}>Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={this.handleShowFullLog}
              >
                <Text style={styles.buttonTextSecondary}>View Full Log</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                This error screen captures all types of app crashes and errors. 
                Please share this information with the developer to help fix the issue.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  errorBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  errorText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  errorLabel: {
    fontWeight: '600',
    color: '#d32f2f',
  },
  stackSection: {
    marginBottom: 16,
  },
  stackBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  stackText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
    lineHeight: 16,
  },
  logSection: {
    marginBottom: 16,
  },
  logBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#444',
    marginBottom: 8,
    lineHeight: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#d32f2f',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  buttonTextPrimary: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
});

export default GlobalErrorHandler;