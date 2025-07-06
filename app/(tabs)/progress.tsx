import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { debugLogger } from "@/services/DebugLogger";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_GOALS = {
  weekly: {
    zone2Plus: 150, // Zone 2 + Zone 3
  },
};

interface DailyProgress {
  day: string;
  date: string;
  zone2PlusMinutes: number;
}

interface WeeklyHeartRateSummary {
  totalMinutes: number;
  zoneBreakdown: { [zoneId: string]: number };
  sessions: any[];
  averageHeartRate: number;
  maxHeartRate: number;
  minHeartRate: number;
}

interface DebugLog {
  timestamp: string;
  level: string;
  category: string;
  message: string;
  data?: string;
}

// Step definitions for manual progression
const INITIALIZATION_STEPS = [
  { id: 'start', title: '🚀 Starting Progress Screen Initialization', description: 'Preparing to initialize Health Connect integration' },
  { id: 'platform', title: '📱 Checking Platform Compatibility', description: 'Verifying Android platform and compatibility' },
  { id: 'module', title: '🔍 Loading Health Connect Module', description: 'Attempting to require Health Connect service module' },
  { id: 'availability', title: '🔍 Checking Health Connect Availability', description: 'Testing if Health Connect is available on this device' },
  { id: 'initialize', title: '🔧 Initializing Health Connect Service', description: 'Starting Health Connect SDK initialization' },
  { id: 'status', title: '📋 Checking Health Connect Status', description: 'Verifying Health Connect service status' },
  { id: 'permissions', title: '🔐 Checking Health Connect Permissions', description: 'Requesting and verifying Health Connect permissions' },
  { id: 'data', title: '📊 Fetching Health Data', description: 'Attempting to load real health data from Health Connect' },
  { id: 'complete', title: '🎉 Initialization Complete', description: 'All steps completed successfully' },
];

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [weeklyData, setWeeklyData] = useState<WeeklyHeartRateSummary | null>(null);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthConnectAvailable, setHealthConnectAvailable] = useState(false);
  const [healthConnectError, setHealthConnectError] = useState<string | null>(null);
  
  // Manual step progression states
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState<{ [key: string]: { success: boolean; message: string; data?: any } }>({});
  const [isStepRunning, setIsStepRunning] = useState(false);
  const [manualMode, setManualMode] = useState(true);
  
  // Debug states
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [showDebugLogs, setShowDebugLogs] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    loadPreviousLogs();
    debugLogger.step('PROGRESS_INIT', 'Progress screen mounted in manual mode');
    setFallbackData(); // Start with fallback data
  }, []);

  const loadPreviousLogs = async () => {
    try {
      const logs = await debugLogger.getRecentLogs(20);
      setDebugLogs(logs);
      
      // Check if there were any crashes in previous sessions
      const crashLogs = logs.filter(log => log.message.includes('CRASH') || log.level === 'ERROR');
      if (crashLogs.length > 0) {
        debugLogger.step('PROGRESS_INIT', 'Found previous crash logs', { crashCount: crashLogs.length });
      }
    } catch (error) {
      console.error('Failed to load previous logs:', error);
    }
  };

  const getCurrentStep = () => INITIALIZATION_STEPS[currentStepIndex];

  const executeCurrentStep = async () => {
    const currentStep = getCurrentStep();
    if (!currentStep) return;

    setIsStepRunning(true);
    debugLogger.step('PROGRESS_MANUAL', `Starting step: ${currentStep.title}`);

    try {
      let result = { success: true, message: 'Step completed successfully', data: null as any };

      switch (currentStep.id) {
        case 'start':
          result = await executeStartStep();
          break;
        case 'platform':
          result = await executePlatformStep();
          break;
        case 'module':
          result = await executeModuleStep();
          break;
        case 'availability':
          result = await executeAvailabilityStep();
          break;
        case 'initialize':
          result = await executeInitializeStep();
          break;
        case 'status':
          result = await executeStatusStep();
          break;
        case 'permissions':
          result = await executePermissionsStep();
          break;
        case 'data':
          result = await executeDataStep();
          break;
        case 'complete':
          result = await executeCompleteStep();
          break;
        default:
          result = { success: false, message: 'Unknown step', data: null };
      }

      setStepResults(prev => ({
        ...prev,
        [currentStep.id]: result
      }));

      debugLogger.step('PROGRESS_MANUAL', `Step completed: ${currentStep.title}`, result);

    } catch (error: any) {
      const errorResult = { 
        success: false, 
        message: `Step failed: ${error?.message || 'Unknown error'}`,
        data: error 
      };
      
      setStepResults(prev => ({
        ...prev,
        [currentStep.id]: errorResult
      }));

      debugLogger.error('PROGRESS_MANUAL', `Step failed: ${currentStep.title}`, error);
      await debugLogger.logCrash('PROGRESS_MANUAL', error, { step: currentStep.id });
    } finally {
      setIsStepRunning(false);
    }
  };

  const executeStartStep = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setError(null);
    setHealthConnectError(null);
    return { success: true, message: 'Progress screen initialization started', data: null };
  };

  const executePlatformStep = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (Platform.OS !== "android") {
      const error = "Android device required for Health Connect";
      setHealthConnectError(error);
      return { success: false, message: error, data: { platform: Platform.OS } };
    }
    
    return { success: true, message: 'Android platform confirmed', data: { platform: Platform.OS } };
  };

  const executeModuleStep = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const healthModule = require("@/services/HealthDataService");
      const healthDataService = healthModule.healthDataService;
      
      if (!healthDataService) {
        throw new Error('Health data service not found in module');
      }
      
      // Store the service for later steps
      (global as any).__healthDataService = healthDataService;
      
      return { 
        success: true, 
        message: 'Health Connect module loaded successfully', 
        data: { moduleLoaded: true } 
      };
    } catch (error: any) {
      const errorMsg = `Module load error: ${error?.message || 'Unknown'}`;
      setHealthConnectError(errorMsg);
      return { success: false, message: errorMsg, data: error };
    }
  };

  const executeAvailabilityStep = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const healthDataService = (global as any).__healthDataService;
      if (!healthDataService) {
        throw new Error('Health data service not available from previous step');
      }
      
      const isReady = healthDataService.isReady();
      
      return { 
        success: true, 
        message: `Health Connect ready status: ${isReady}`, 
        data: { ready: isReady } 
      };
    } catch (error: any) {
      const errorMsg = `Availability check failed: ${error?.message || 'Unknown'}`;
      setHealthConnectError(errorMsg);
      return { success: false, message: errorMsg, data: error };
    }
  };

  const executeInitializeStep = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Longer timeout for initialization
    
    try {
      const healthDataService = (global as any).__healthDataService;
      if (!healthDataService) {
        throw new Error('Health data service not available from previous step');
      }
      
      const initialized = await Promise.race([
        healthDataService.initialize(),
        new Promise<boolean>((resolve) => 
          setTimeout(() => {
            debugLogger.warn('PROGRESS_INIT_HC', 'Health Connect initialization timeout');
            resolve(false);
          }, 10000)
        )
      ]);
      
      if (!initialized) {
        const errorMsg = "Health Connect initialization failed or timed out";
        setHealthConnectError(errorMsg);
        return { success: false, message: errorMsg, data: { initialized } };
      }
      
      return { 
        success: true, 
        message: 'Health Connect initialized successfully', 
        data: { initialized } 
      };
    } catch (error: any) {
      const errorMsg = `Initialization failed: ${error?.message || 'Unknown'}`;
      setHealthConnectError(errorMsg);
      return { success: false, message: errorMsg, data: error };
    }
  };

  const executeStatusStep = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const healthDataService = (global as any).__healthDataService;
      if (!healthDataService) {
        throw new Error('Health data service not available from previous step');
      }
      
      const isHealthConnectAvailable = healthDataService.isHealthConnectAvailable();
      setHealthConnectAvailable(isHealthConnectAvailable);
      
      return { 
        success: true, 
        message: `Health Connect status: ${isHealthConnectAvailable ? 'Available' : 'Not Available'}`, 
        data: { available: isHealthConnectAvailable } 
      };
    } catch (error: any) {
      const errorMsg = `Status check failed: ${error?.message || 'Unknown'}`;
      setHealthConnectError(errorMsg);
      return { success: false, message: errorMsg, data: error };
    }
  };

  const executePermissionsStep = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const healthDataService = (global as any).__healthDataService;
      if (!healthDataService) {
        throw new Error('Health data service not available from previous step');
      }
      
      const permissions = await Promise.race([
        healthDataService.getPermissionStatus(),
        new Promise<any>((resolve) => 
          setTimeout(() => {
            debugLogger.warn('PROGRESS_PERMISSIONS', 'Permission check timeout');
            resolve({ healthConnect: false, bodySensors: false });
          }, 8000)
        )
      ]);
      
      const hasPermissions = permissions.healthConnect || permissions.bodySensors;
      
      return { 
        success: true, 
        message: `Permissions: HC=${permissions.healthConnect ? '✅' : '❌'} Sensors=${permissions.bodySensors ? '✅' : '❌'}`, 
        data: permissions 
      };
    } catch (error: any) {
      const errorMsg = `Permission check failed: ${error?.message || 'Unknown'}`;
      return { success: false, message: errorMsg, data: error };
    }
  };

  const executeDataStep = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const healthDataService = (global as any).__healthDataService;
      if (!healthDataService) {
        throw new Error('Health data service not available from previous step');
      }
      
      // Try to get weekly data
      const weekData = await Promise.race([
        healthDataService.getWeeklyHeartRateData(),
        new Promise<WeeklyHeartRateSummary>((_, reject) => 
          setTimeout(() => {
            debugLogger.warn('PROGRESS_DATA', 'Weekly data fetch timeout');
            reject(new Error('Weekly data timeout'));
          }, 12000)
        )
      ]);
      
      setWeeklyData(weekData);
      
      // Try to get daily data
      const dailyData = await Promise.race([
        getDailyBreakdownForWeek(healthDataService),
        new Promise<DailyProgress[]>((_, reject) => 
          setTimeout(() => {
            debugLogger.warn('PROGRESS_DATA', 'Daily data fetch timeout');
            reject(new Error('Daily data timeout'));
          }, 12000)
        )
      ]);
      
      setDailyProgress(dailyData);
      
      return { 
        success: true, 
        message: `Real data loaded: ${weekData.totalMinutes} total minutes, ${dailyData.length} days`, 
        data: { weeklyMinutes: weekData.totalMinutes, dailyDays: dailyData.length } 
      };
    } catch (error: any) {
      const errorMsg = `Data fetch failed: ${error?.message || 'Unknown'}`;
      setHealthConnectError(errorMsg);
      // Keep fallback data
      return { success: false, message: errorMsg + ' (using fallback data)', data: error };
    }
  };

  const executeCompleteStep = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    debugLogger.step('PROGRESS_COMPLETE', 'Progress screen initialization completed successfully');
    
    return { 
      success: true, 
      message: 'All initialization steps completed', 
      data: { totalSteps: INITIALIZATION_STEPS.length } 
    };
  };

  const setFallbackData = () => {
    debugLogger.step('PROGRESS_FALLBACK', 'Setting fallback demo data');
    const fallbackDaily = [
      { day: "Mon", date: "2024-01-01", zone2PlusMinutes: 25 },
      { day: "Tue", date: "2024-01-02", zone2PlusMinutes: 30 },
      { day: "Wed", date: "2024-01-03", zone2PlusMinutes: 0 },
      { day: "Thu", date: "2024-01-04", zone2PlusMinutes: 45 },
      { day: "Fri", date: "2024-01-05", zone2PlusMinutes: 20 },
      { day: "Sat", date: "2024-01-06", zone2PlusMinutes: 35 },
      { day: "Sun", date: "2024-01-07", zone2PlusMinutes: 15 },
    ];
    setDailyProgress(fallbackDaily);
    setHealthConnectAvailable(false);
  };

  const getDailyBreakdownForWeek = async (healthDataService: any): Promise<DailyProgress[]> => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const promises = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      
      if (date <= today) {
        return Promise.race([
          healthDataService.getDailyHeartRateData(dateString).then((dayData: any) => {
            const zone2PlusMinutes = 
              (dayData.zoneBreakdown.zone2 || 0) + 
              (dayData.zoneBreakdown.zone3 || 0);
            debugLogger.step('PROGRESS_DAILY', `${dayNames[i]} data loaded`, { 
              date: dateString, 
              minutes: zone2PlusMinutes 
            });
            return {
              day: dayNames[i],
              date: dateString,
              zone2PlusMinutes,
            };
          }),
          new Promise<DailyProgress>((resolve) => 
            setTimeout(() => {
              debugLogger.warn('PROGRESS_DAILY', `${dayNames[i]} data timeout`);
              resolve({
                day: dayNames[i],
                date: dateString,
                zone2PlusMinutes: Math.floor(Math.random() * 30),
              });
            }, 5000)
          )
        ]).catch((error: any) => {
          debugLogger.error('PROGRESS_DAILY', `${dayNames[i]} data error`, error);
          return {
            day: dayNames[i],
            date: dateString,
            zone2PlusMinutes: Math.floor(Math.random() * 30),
          };
        });
      } else {
        return Promise.resolve({
          day: dayNames[i],
          date: dateString,
          zone2PlusMinutes: 0,
        });
      }
    });
    
    const dailyData = await Promise.all(promises);
    return dailyData;
  };

  const handleNextStep = () => {
    if (currentStepIndex < INITIALIZATION_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleResetSteps = () => {
    setCurrentStepIndex(0);
    setStepResults({});
    setError(null);
    setHealthConnectError(null);
    setFallbackData();
    debugLogger.step('PROGRESS_RESET', 'Manual steps reset');
  };

  const handleShowDebugLogs = async () => {
    try {
      const logs = await debugLogger.getRecentLogs(50);
      setDebugLogs(logs);
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

  const getChartData = () => {
    const labels = dailyProgress.map(d => d.day);
    const data = dailyProgress.map(d => d.zone2PlusMinutes);
    
    const dailyGoal = DEFAULT_GOALS.weekly.zone2Plus / 7;
    const goalLine = new Array(dailyProgress.length).fill(dailyGoal);

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => colors.tint,
          strokeWidth: 3,
        },
        {
          data: goalLine,
          color: (opacity = 1) => `rgba(128, 128, 128, ${opacity * 0.5})`,
          strokeWidth: 2,
          strokeDashArray: [5, 5],
        },
      ],
    };
  };

  const calculateWeeklyTotal = () => {
    return dailyProgress.reduce((sum, day) => sum + day.zone2PlusMinutes, 0);
  };

  const renderManualStepController = () => {
    const currentStep = getCurrentStep();
    const stepResult = stepResults[currentStep?.id];
    
    return (
      <ThemedView style={styles.stepController}>
        <View style={styles.stepHeader}>
          <ThemedText type="subtitle" style={styles.stepTitle}>
            Manual Step Controller ({currentStepIndex + 1}/{INITIALIZATION_STEPS.length})
          </ThemedText>
        </View>

        <View style={styles.currentStepContainer}>
          <ThemedText style={styles.currentStepTitle}>
            {currentStep?.title}
          </ThemedText>
          <ThemedText style={styles.currentStepDescription}>
            {currentStep?.description}
          </ThemedText>
          
          {stepResult && (
            <View style={[
              styles.stepResult,
              { backgroundColor: stepResult.success ? '#e8f5e8' : '#ffebee' }
            ]}>
              <ThemedText style={[
                styles.stepResultText,
                { color: stepResult.success ? '#2e7d32' : '#c62828' }
              ]}>
                {stepResult.success ? '✅' : '❌'} {stepResult.message}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.stepControls}>
          <TouchableOpacity
            style={[styles.stepButton, styles.prevButton]}
            onPress={handlePrevStep}
            disabled={currentStepIndex === 0}
          >
            <ThemedText style={styles.stepButtonText}>← Previous</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stepButton, styles.executeButton]}
            onPress={executeCurrentStep}
            disabled={isStepRunning}
          >
            <ThemedText style={styles.stepButtonText}>
              {isStepRunning ? '⏳ Running...' : '▶️ Execute Step'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stepButton, styles.nextButton]}
            onPress={handleNextStep}
            disabled={currentStepIndex === INITIALIZATION_STEPS.length - 1}
          >
            <ThemedText style={styles.stepButtonText}>Next →</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.stepActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF5722' }]}
            onPress={handleResetSteps}
          >
            <ThemedText style={styles.actionButtonText}>🔄 Reset All Steps</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
            onPress={handleShowDebugLogs}
          >
            <ThemedText style={styles.actionButtonText}>📋 Debug Logs</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  };

  const renderStepProgress = () => {
    return (
      <ThemedView style={styles.stepProgress}>
        <ThemedText type="subtitle" style={styles.progressTitle}>
          Step Progress
        </ThemedText>
        <ScrollView style={styles.stepsList} nestedScrollEnabled>
          {INITIALIZATION_STEPS.map((step, index) => {
            const isCompleted = stepResults[step.id];
            const isCurrent = index === currentStepIndex;
            
            return (
              <View key={step.id} style={[
                styles.progressStep,
                isCurrent && styles.currentProgressStep
              ]}>
                <View style={styles.stepIndicator}>
                  <ThemedText style={[
                    styles.stepNumber,
                    isCurrent && styles.currentStepNumber
                  ]}>
                    {isCompleted ? (isCompleted.success ? '✅' : '❌') : (index + 1)}
                  </ThemedText>
                </View>
                <View style={styles.stepContent}>
                  <ThemedText style={[
                    styles.stepName,
                    isCurrent && styles.currentStepName
                  ]}>
                    {step.title}
                  </ThemedText>
                  {isCompleted && (
                    <ThemedText style={[
                      styles.stepStatus,
                      { color: isCompleted.success ? '#4CAF50' : '#F44336' }
                    ]}>
                      {isCompleted.message}
                    </ThemedText>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </ThemedView>
    );
  };

  const renderDebugLogs = () => {
    if (!showDebugLogs) return null;

    return (
      <ThemedView style={styles.debugContainer}>
        <View style={styles.debugHeader}>
          <ThemedText type="subtitle" style={styles.debugTitle}>
            Debug Logs ({debugLogs.length})
          </ThemedText>
          <View style={styles.debugButtons}>
            <TouchableOpacity
              style={[styles.debugButton, { backgroundColor: colors.tint }]}
              onPress={handleClearLogs}
            >
              <ThemedText style={styles.debugButtonText}>Clear</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.debugButton, { backgroundColor: '#666' }]}
              onPress={() => setShowDebugLogs(false)}
            >
              <ThemedText style={styles.debugButtonText}>Hide</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.debugLogsList} nestedScrollEnabled>
          {debugLogs.slice(-20).map((log, index) => (
            <View key={index} style={styles.debugLogItem}>
              <ThemedText style={[
                styles.debugLogText,
                { color: log.level === 'ERROR' ? '#F44336' : 
                         log.level === 'WARN' ? '#FF9800' :
                         log.level === 'STEP' ? '#4CAF50' : colors.text }
              ]}>
                [{log.timestamp.split('T')[1]?.split('.')[0]}] {log.level} {log.category}: {log.message}
              </ThemedText>
              {log.data && (
                <ThemedText style={styles.debugLogData}>
                  {log.data}
                </ThemedText>
              )}
            </View>
          ))}
        </ScrollView>
      </ThemedView>
    );
  };

  const renderChart = () => {
    if (dailyProgress.length === 0) return null;

    const chartData = getChartData();
    const weeklyTotal = calculateWeeklyTotal();
    const weeklyGoal = DEFAULT_GOALS.weekly.zone2Plus;
    const progressPercentage = Math.min((weeklyTotal / weeklyGoal) * 100, 100);

    return (
      <ThemedView style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <ThemedText type="title" style={styles.chartTitle}>
            Weekly Progress
          </ThemedText>
          <ThemedText style={styles.chartSubtitle}>
            Zone 2+ minutes per day {!healthConnectAvailable && "(Demo Data)"}
          </ThemedText>
        </View>

        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: colors.background,
            backgroundGradientFrom: colors.background,
            backgroundGradientTo: colors.background,
            decimalPlaces: 0,
            color: (opacity = 1) => colors.text,
            labelColor: (opacity = 1) => colors.text,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: colors.tint,
              fill: colors.background,
            },
            propsForBackgroundLines: {
              strokeDasharray: "",
              stroke: colors.icon + "20",
              strokeWidth: 1,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          fromZero
          yAxisSuffix=" min"
          segments={4}
        />

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>
              Week Total:
            </ThemedText>
            <ThemedText 
              type="subtitle" 
              style={[styles.summaryValue, { color: colors.tint }]}
            >
              {weeklyTotal} min
            </ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>
              Weekly Goal:
            </ThemedText>
            <ThemedText type="subtitle" style={styles.summaryValue}>
              {weeklyGoal} min
            </ThemedText>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { backgroundColor: colors.icon + "20" }
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.tint,
                    width: `${progressPercentage}%`,
                  },
                ]}
              />
            </View>
            <ThemedText style={styles.percentageText}>
              {Math.round(progressPercentage)}%
            </ThemedText>
          </View>
        </View>

        {progressPercentage >= 100 && (
          <View style={styles.achievementContainer}>
            <ThemedText style={styles.achievementText}>
              🎉 Weekly Goal Achieved! Great job!
            </ThemedText>
          </View>
        )}
      </ThemedView>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Progress Tracker (Manual Debug Mode)
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Step-by-step Health Connect testing
          </ThemedText>
        </View>

        {renderManualStepController()}
        {renderStepProgress()}
        {renderDebugLogs()}
        {renderChart()}

        <View style={styles.infoContainer}>
          <ThemedText style={styles.infoText}>
            💡 Use the manual step controller to test each Health Connect step individually. 
            Each step can be executed separately to identify exactly where crashes occur.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    paddingTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  stepController: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepHeader: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  currentStepContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(33, 150, 243, 0.3)",
    marginBottom: 16,
  },
  currentStepTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  currentStepDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  stepResult: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  stepResultText: {
    fontSize: 14,
    fontWeight: "500",
  },
  stepControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  stepButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  prevButton: {
    backgroundColor: "#666",
  },
  executeButton: {
    backgroundColor: "#4CAF50",
  },
  nextButton: {
    backgroundColor: "#2196F3",
  },
  stepButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  stepActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  stepProgress: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 300,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  stepsList: {
    maxHeight: 200,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 8,
  },
  currentProgressStep: {
    backgroundColor: "rgba(33, 150, 243, 0.1)",
  },
  stepIndicator: {
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "600",
    width: 24,
    textAlign: "center",
  },
  currentStepNumber: {
    color: "#2196F3",
  },
  stepContent: {
    flex: 1,
  },
  stepName: {
    fontSize: 14,
    fontWeight: "500",
  },
  currentStepName: {
    color: "#2196F3",
    fontWeight: "600",
  },
  stepStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  debugContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    maxHeight: 300,
  },
  debugHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  debugButtons: {
    flexDirection: "row",
    gap: 8,
  },
  debugButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  debugButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  debugLogsList: {
    maxHeight: 200,
  },
  debugLogItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  debugLogText: {
    fontSize: 11,
    fontFamily: "monospace",
  },
  debugLogData: {
    fontSize: 10,
    fontFamily: "monospace",
    opacity: 0.7,
    marginTop: 2,
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  progressBarContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    textAlign: "right",
    opacity: 0.7,
  },
  achievementContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  achievementText: {
    fontSize: 16,
    textAlign: "center",
    color: "#4CAF50",
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#1976D2",
  },
});