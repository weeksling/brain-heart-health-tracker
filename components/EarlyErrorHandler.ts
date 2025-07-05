/**
 * Early Error Handler - Must be imported at the very top of the app entry point
 * This catches errors that happen before React Native components can render
 */

console.log('🔧 Early Error Handler: Initializing...');

// Store original console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

// Error storage for early errors
let earlyErrors: Array<{
  type: string;
  message: string;
  stack?: string;
  timestamp: string;
}> = [];

// Enhanced error logging
const logError = (type: string, ...args: any[]) => {
  const timestamp = new Date().toISOString();
  const message = args.map(arg => {
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  }).join(' ');

  const errorInfo = {
    type,
    message,
    timestamp,
    stack: new Error().stack,
  };

  earlyErrors.push(errorInfo);
  
  // Keep only last 100 errors to prevent memory issues
  if (earlyErrors.length > 100) {
    earlyErrors = earlyErrors.slice(-100);
  }

  // Always log to original console for debugging
  originalConsoleLog(`[${timestamp}] ${type}:`, ...args);
};

// Override console methods to capture all output
console.error = (...args: any[]) => {
  logError('EARLY_ERROR', ...args);
  originalConsoleError.apply(console, args);
};

console.warn = (...args: any[]) => {
  logError('EARLY_WARNING', ...args);
  originalConsoleWarn.apply(console, args);
};

// Set up global error handlers immediately
try {
  // Handle unhandled promise rejections
  const handleUnhandledRejection = (event: any) => {
    logError('EARLY_UNHANDLED_PROMISE', 'Promise rejection:', event?.reason || event);
    console.error('🚨 EARLY: Unhandled Promise Rejection:', event);
  };

  // Hermes promise rejection tracking
  if ((global as any).HermesInternal?.hasPromiseRejectionTracker) {
    try {
      (global as any).HermesInternal.enablePromiseRejectionTracker({
        allRejections: true,
        onUnhandled: handleUnhandledRejection,
        onHandled: () => {},
      });
      console.log('✅ Early Error Handler: Hermes promise tracking enabled');
    } catch (error) {
      console.error('❌ Early Error Handler: Failed to enable Hermes tracking:', error);
    }
  }

  // Global error handler
  const originalHandler = (global as any).ErrorUtils?.getGlobalHandler();
  if ((global as any).ErrorUtils) {
    (global as any).ErrorUtils.setGlobalHandler((error: any, isFatal: boolean) => {
      logError('EARLY_GLOBAL_ERROR', `Fatal: ${isFatal}`, error?.message || error, error?.stack);
      console.error('🚨 EARLY: Global Error:', {
        fatal: isFatal,
        message: error?.message,
        stack: error?.stack,
        error,
      });

      // Call original handler if it exists
      if (originalHandler) {
        try {
          originalHandler(error, isFatal);
        } catch (handlerError) {
          console.error('🚨 EARLY: Error in original handler:', handlerError);
        }
      }
    });
    console.log('✅ Early Error Handler: Global error handler installed');
  }

  // Native module error tracking (simplified to avoid TypeScript issues)
  const originalRequire = (global as any).require;
  if (originalRequire) {
    (global as any).require = (moduleName: string) => {
      try {
        return originalRequire(moduleName);
      } catch (error) {
        logError('EARLY_MODULE_ERROR', `Failed to require ${moduleName}:`, error);
        console.error('🚨 EARLY: Module require failed:', moduleName, error);
        throw error;
      }
    };
  }

  console.log('✅ Early Error Handler: Initialization complete');
} catch (initError) {
  console.error('🚨 EARLY: Failed to initialize error handlers:', initError);
}

// Function to get all early errors for display in UI
export const getEarlyErrors = () => earlyErrors;

// Function to clear early errors
export const clearEarlyErrors = () => {
  earlyErrors = [];
};

// Function to add early error manually
export const addEarlyError = (type: string, message: string, stack?: string) => {
  earlyErrors.push({
    type,
    message,
    stack,
    timestamp: new Date().toISOString(),
  });
};

// Export for debugging
export const earlyErrorDebug = {
  getErrors: getEarlyErrors,
  clearErrors: clearEarlyErrors,
  addError: addEarlyError,
  logError,
};

// Make available globally for debugging
(global as any).__EARLY_ERROR_DEBUG__ = earlyErrorDebug;

console.log('🔧 Early Error Handler: Ready to catch errors!');

export default earlyErrorDebug;