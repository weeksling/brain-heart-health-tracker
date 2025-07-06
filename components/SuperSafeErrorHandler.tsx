import React, { Component, ReactNode } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Type helpers for global properties
type ErrorUtilsType = {
  getGlobalHandler: () => any;
  setGlobalHandler: (handler: (error: any, isFatal: boolean) => void) => void;
} | undefined;

type HermesInternalType = {
  hasPromiseRejectionTracker: boolean;
  enablePromiseRejectionTracker: (options: any) => void;
} | undefined;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class SuperSafeErrorHandler extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };

    // Absolutely safe global error handler
    try {
      const originalHandler = (global as any).ErrorUtils?.getGlobalHandler();
      (global as any).ErrorUtils?.setGlobalHandler((error: any, isFatal: boolean) => {
        try {
          console.log('🚨 SUPER SAFE: Global error caught:', error?.message || 'Unknown error');
          this.setState({
            hasError: true,
            errorMessage: error?.message || 'Unknown error occurred',
          });
        } catch (handlerError) {
          console.log('🚨 SUPER SAFE: Error in error handler:', handlerError);
        }
        
        // Don't call original handler to prevent crashes
      });
    } catch (setupError) {
      console.log('🚨 SUPER SAFE: Error setting up global handler:', setupError);
    }

    // Safe promise rejection handler
    try {
      if ((global as any).HermesInternal?.hasPromiseRejectionTracker) {
        (global as any).HermesInternal.enablePromiseRejectionTracker({
          allRejections: true,
          onUnhandled: (id: number, error: any) => {
            try {
              console.log('🚨 SUPER SAFE: Promise rejection caught:', error?.message || 'Unknown promise error');
              this.setState({
                hasError: true,
                errorMessage: error?.message || 'Promise rejection occurred',
              });
            } catch (promiseError) {
              console.log('🚨 SUPER SAFE: Error in promise handler:', promiseError);
            }
          },
          onHandled: () => {},
        });
      }
    } catch (promiseSetupError) {
      console.log('🚨 SUPER SAFE: Error setting up promise handler:', promiseSetupError);
    }
  }

  static getDerivedStateFromError(error: any) {
    // This should never fail
    try {
      console.log('🚨 SUPER SAFE: React error caught:', error?.message || 'Unknown React error');
      return {
        hasError: true,
        errorMessage: error?.message || 'React component error occurred',
      };
    } catch (derivedError) {
      console.log('🚨 SUPER SAFE: Error in getDerivedStateFromError:', derivedError);
      return {
        hasError: true,
        errorMessage: 'Critical error occurred',
      };
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
    try {
      console.log('🚨 SUPER SAFE: Component error caught:', error?.message || 'Unknown component error');
      console.log('🚨 SUPER SAFE: Error info:', errorInfo);
    } catch (catchError) {
      console.log('🚨 SUPER SAFE: Error in componentDidCatch:', catchError);
    }
  }

  handleRestart = () => {
    try {
      this.setState({
        hasError: false,
        errorMessage: '',
      });
    } catch (restartError) {
      console.log('🚨 SUPER SAFE: Error in restart:', restartError);
      // Force a basic alert if setState fails
      Alert.alert('Error', 'Please restart the app manually');
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>🚨</Text>
          <Text style={styles.title}>App Error Detected</Text>
          <Text style={styles.message}>
            {this.state.errorMessage || 'An unknown error occurred'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});