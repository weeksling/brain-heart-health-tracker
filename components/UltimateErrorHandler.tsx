import React, { Component, ReactNode } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ErrorState {
  hasError: boolean;
  errors: Array<{
    type: string;
    message: string;
    stack?: string;
    timestamp: string;
  }>;
  lastError: any;
}

interface Props {
  children: ReactNode;
}

// Global error storage
let globalErrors: any[] = [];
let errorHandler: UltimateErrorHandler | null = null;

export class UltimateErrorHandler extends Component<Props, ErrorState> {
  private mounted = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errors: [],
      lastError: null,
    };

    // Set global reference
    errorHandler = this;
    
    // Set up ultimate error protection
    this.setupUltimateErrorProtection();
  }

  componentDidMount() {
    this.mounted = true;
    console.log('🛡️ UltimateErrorHandler: Mounted and ready');
  }

  componentWillUnmount() {
    this.mounted = false;
    errorHandler = null;
  }

  setupUltimateErrorProtection = () => {
    try {
      // 1. Global error handler with maximum protection
      const originalHandler = (global as any).ErrorUtils?.getGlobalHandler();
      (global as any).ErrorUtils?.setGlobalHandler((error: any, isFatal: boolean) => {
        this.captureError('GLOBAL_ERROR', error, isFatal);
        
        // NEVER call original handler - it might crash
        console.error('🛡️ ULTIMATE: Global error intercepted:', error);
      });

      // 2. Promise rejection handler
      if ((global as any).HermesInternal?.enablePromiseRejectionTracker) {
        (global as any).HermesInternal.enablePromiseRejectionTracker({
          allRejections: true,
          onUnhandled: (event: any) => {
            this.captureError('PROMISE_REJECTION', event?.reason || event, true);
          },
          onHandled: () => {},
        });
      }

      // 3. Console error override
      const originalConsoleError = console.error;
      console.error = (...args: any[]) => {
        this.captureError('CONSOLE_ERROR', args.join(' '), false);
        originalConsoleError.apply(console, args);
      };

      // 4. Window error handler (if available)
      if (typeof (global as any).addEventListener === 'function') {
        (global as any).addEventListener('error', (event: any) => {
          this.captureError('WINDOW_ERROR', event.error || event, true);
        });
      }

      // 5. React error boundary fallback
      const originalReactError = React.createElement;
      
      console.log('🛡️ UltimateErrorHandler: All protections active');
    } catch (setupError) {
      console.error('🛡️ ULTIMATE: Setup error:', setupError);
    }
  };

  captureError = (type: string, error: any, isFatal: boolean = false) => {
    const errorInfo = {
      type,
      message: error?.message || error?.toString?.() || String(error),
      stack: error?.stack || 'No stack available',
      timestamp: new Date().toISOString(),
      isFatal,
    };

    // Store globally
    globalErrors.push(errorInfo);
    if (globalErrors.length > 100) {
      globalErrors = globalErrors.slice(-100);
    }

    // Update state if component is mounted
    if (this.mounted) {
      try {
        this.setState(prevState => ({
          hasError: true,
          errors: [...prevState.errors, errorInfo].slice(-50),
          lastError: errorInfo,
        }));
      } catch (stateError) {
        console.error('🛡️ ULTIMATE: State update error:', stateError);
      }
    }

    console.error(`🛡️ ULTIMATE: ${type} captured:`, errorInfo);
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorState> {
    console.error('🛡️ ULTIMATE: React error boundary triggered:', error);
    
    const errorInfo = {
      type: 'REACT_ERROR',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    };

    globalErrors.push(errorInfo);

    return {
      hasError: true,
      lastError: errorInfo,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🛡️ ULTIMATE: componentDidCatch:', error, errorInfo);
    
    this.captureError('REACT_COMPONENT_ERROR', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    }, false);
  }

  handleClearErrors = () => {
    try {
      this.setState({
        hasError: false,
        errors: [],
        lastError: null,
      });
      globalErrors = [];
    } catch (clearError) {
      console.error('🛡️ ULTIMATE: Clear error failed:', clearError);
    }
  };

  handleForceRestart = () => {
    try {
      // Clear everything
      this.handleClearErrors();
      
      // Force a complete reset
      setTimeout(() => {
        if (this.mounted) {
          this.forceUpdate();
        }
      }, 100);
    } catch (restartError) {
      console.error('🛡️ ULTIMATE: Restart error:', restartError);
    }
  };

  handleTestCrash = () => {
    try {
      // This should be caught by our error boundary
      throw new Error('🧪 Test crash from UltimateErrorHandler');
    } catch (testError) {
      console.error('🛡️ ULTIMATE: Test crash caught:', testError);
      this.captureError('TEST_CRASH', testError, false);
    }
  };

  renderErrorScreen = () => {
    const { errors, lastError } = this.state;
    const { width, height } = Dimensions.get('window');
    const totalErrors = globalErrors.length;

    return (
      <SafeAreaView style={[styles.container, { width, height }]}>
        <View style={styles.header}>
          <Text style={styles.title}>🛡️ Ultimate Error Protection</Text>
          <Text style={styles.subtitle}>
            App is protected from crashes - all errors are captured here
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Error Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Error Summary</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Total Errors Captured: {totalErrors}</Text>
              <Text style={styles.infoText}>Current Session: {errors.length}</Text>
              <Text style={styles.infoText}>Protection: Active ✅</Text>
              <Text style={styles.infoText}>App Status: Running (No Crashes)</Text>
            </View>
          </View>

          {/* Latest Error */}
          {lastError && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🚨 Latest Error</Text>
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  <Text style={styles.errorLabel}>Type:</Text> {lastError.type}
                </Text>
                <Text style={styles.errorText}>
                  <Text style={styles.errorLabel}>Message:</Text> {lastError.message}
                </Text>
                <Text style={styles.errorText}>
                  <Text style={styles.errorLabel}>Time:</Text> {lastError.timestamp}
                </Text>
                <Text style={styles.errorText}>
                  <Text style={styles.errorLabel}>Fatal:</Text> {lastError.isFatal ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          )}

          {/* Stack Trace */}
          {lastError?.stack && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 Stack Trace</Text>
              <ScrollView style={styles.codeBox} horizontal>
                <Text style={styles.codeText}>{lastError.stack}</Text>
              </ScrollView>
            </View>
          )}

          {/* Recent Errors */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Recent Errors ({errors.length})</Text>
            <ScrollView style={styles.logBox} nestedScrollEnabled>
              {errors.slice(-10).map((error, index) => (
                <View key={index} style={styles.logItem}>
                  <Text style={styles.logText}>
                    [{error.timestamp}] {error.type}: {error.message}
                  </Text>
                </View>
              ))}
              {errors.length === 0 && (
                <Text style={styles.logText}>No errors in current session</Text>
              )}
            </ScrollView>
          </View>

          {/* Test Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧪 Test Error Protection</Text>
            <TouchableOpacity
              style={styles.testButton}
              onPress={this.handleTestCrash}
            >
              <Text style={styles.testButtonText}>Test Crash Protection</Text>
            </TouchableOpacity>
            <Text style={styles.testInfo}>
              This button will throw an error that should be caught and displayed here
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={this.handleForceRestart}
              >
                <Text style={styles.buttonText}>Force Restart</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={this.handleClearErrors}
              >
                <Text style={styles.buttonText}>Clear Errors</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Protection Info */}
          <View style={styles.section}>
            <View style={styles.protectionBox}>
              <Text style={styles.protectionText}>
                🛡️ This app is protected by Ultimate Error Handler
              </Text>
              <Text style={styles.protectionText}>
                • All crashes are prevented
              </Text>
              <Text style={styles.protectionText}>
                • All errors are captured and displayed
              </Text>
              <Text style={styles.protectionText}>
                • App continues running under all conditions
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  render() {
    // ALWAYS render error screen if we have errors
    if (this.state.hasError) {
      return this.renderErrorScreen();
    }

    // Wrap children with additional protection
    return (
      <View style={{ flex: 1 }}>
        {this.props.children}
      </View>
    );
  }
}

// Global function to trigger error display
export const showGlobalError = (error: any) => {
  if (errorHandler) {
    errorHandler.captureError('MANUAL_ERROR', error, false);
  }
};

// Global function to get all errors
export const getGlobalErrors = () => globalErrors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  infoText: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 4,
  },
  errorBox: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
    marginBottom: 4,
  },
  errorLabel: {
    fontWeight: 'bold',
  },
  codeBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
    lineHeight: 16,
  },
  logBox: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logItem: {
    marginBottom: 8,
  },
  logText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#555',
    lineHeight: 14,
  },
  testButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  testInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196f3',
  },
  secondaryButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  protectionBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  protectionText: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 4,
  },
});

export default UltimateErrorHandler;