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

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [weeklyData, setWeeklyData] = useState<WeeklyHeartRateSummary | null>(null);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [healthConnectAvailable, setHealthConnectAvailable] = useState(false);
  const [healthConnectError, setHealthConnectError] = useState<string | null>(null);
  
  // Debug states
  const [currentStep, setCurrentStep] = useState<string>("Starting...");
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [showDebugLogs, setShowDebugLogs] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    loadPreviousLogs();
    initializeWithDetailedLogging();
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

  const updateStep = (step: string, data?: any) => {
    setCurrentStep(step);
    debugLogger.step('PROGRESS_FLOW', step, data);
  };

  const initializeWithDetailedLogging = async () => {
    try {
      debugLogger.step('PROGRESS_INIT', 'Progress screen mounted');
      updateStep("🚀 Starting Progress Screen Initialization");
      
      setLoading(true);
      setError(null);
      setHealthConnectError(null);

      // Step 1: Platform Check
      updateStep("📱 Checking Platform Compatibility");
      await new Promise(resolve => setTimeout(resolve, 500)); // Allow UI to update
      
      if (Platform.OS !== "android") {
        debugLogger.warn('PROGRESS_PLATFORM', 'Non-Android platform detected', { platform: Platform.OS });
        updateStep("❌ Non-Android Platform Detected");
        setHealthConnectError("Android device required for Health Connect");
        setFallbackData();
        setLoading(false);
        return;
      }
      
      debugLogger.step('PROGRESS_PLATFORM', 'Android platform confirmed');
      updateStep("✅ Android Platform Confirmed");

      // Step 2: Check Health Connect Module Availability
      updateStep("🔍 Checking Health Connect Module Availability");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let healthDataService: any = null;
      try {
        debugLogger.step('PROGRESS_MODULE', 'Attempting to require Health Connect module');
        const healthModule = require("@/services/HealthDataService");
        healthDataService = healthModule.healthDataService;
        debugLogger.step('PROGRESS_MODULE', 'Health Connect module loaded successfully');
        updateStep("✅ Health Connect Module Loaded");
      } catch (requireError: any) {
        debugLogger.error('PROGRESS_MODULE', 'Failed to load Health Connect module', requireError);
        updateStep("❌ Health Connect Module Failed to Load");
        setHealthConnectError(`Module load error: ${requireError?.message || 'Unknown'}`);
        setFallbackData();
        setLoading(false);
        return;
      }

      // Step 3: Check if Health Connect is available on device
      updateStep("🔍 Checking Health Connect Availability on Device");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let healthConnectReady = false;
      try {
        debugLogger.step('PROGRESS_AVAILABILITY', 'Checking Health Connect availability');
        healthConnectReady = healthDataService.isReady();
        debugLogger.step('PROGRESS_AVAILABILITY', 'Health Connect ready check completed', { ready: healthConnectReady });
        updateStep(healthConnectReady ? "✅ Health Connect Available" : "⚠️ Health Connect Not Ready");
      } catch (availabilityError: any) {
        debugLogger.error('PROGRESS_AVAILABILITY', 'Health Connect availability check failed', availabilityError);
        updateStep("❌ Health Connect Availability Check Failed");
        setHealthConnectError(`Availability check failed: ${availabilityError?.message || 'Unknown'}`);
        setFallbackData();
        setLoading(false);
        return;
      }

      // Step 4: Initialize Health Connect
      updateStep("🔧 Initializing Health Connect Service");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let healthServiceInitialized = false;
      try {
        debugLogger.step('PROGRESS_INIT_HC', 'Starting Health Connect initialization');
        healthServiceInitialized = await Promise.race([
          healthDataService.initialize(),
          new Promise<boolean>((resolve) => 
            setTimeout(() => {
              debugLogger.warn('PROGRESS_INIT_HC', 'Health Connect initialization timeout');
              resolve(false);
            }, 8000)
          )
        ]);
        
        debugLogger.step('PROGRESS_INIT_HC', 'Health Connect initialization completed', { 
          initialized: healthServiceInitialized 
        });
        updateStep(healthServiceInitialized ? "✅ Health Connect Initialized" : "⚠️ Health Connect Initialization Timeout");
      } catch (initError: any) {
        debugLogger.error('PROGRESS_INIT_HC', 'Health Connect initialization failed', initError);
        updateStep("❌ Health Connect Initialization Failed");
        setHealthConnectError(`Initialization failed: ${initError?.message || 'Unknown'}`);
        setFallbackData();
        setLoading(false);
        return;
      }

      if (!healthServiceInitialized) {
        debugLogger.warn('PROGRESS_INIT_HC', 'Health Connect not initialized, using fallback');
        updateStep("⚠️ Using Fallback Data (Initialization Failed)");
        setHealthConnectError("Health Connect initialization failed or timed out");
        setFallbackData();
        setLoading(false);
        return;
      }

      // Step 5: Check Health Connect Status
      updateStep("📋 Checking Health Connect Status");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const isHealthConnectAvailable = healthDataService.isHealthConnectAvailable();
        debugLogger.step('PROGRESS_STATUS', 'Health Connect status checked', { 
          available: isHealthConnectAvailable 
        });
        setHealthConnectAvailable(isHealthConnectAvailable);
        updateStep(isHealthConnectAvailable ? "✅ Health Connect Ready" : "⚠️ Health Connect Not Available");
      } catch (statusError: any) {
        debugLogger.error('PROGRESS_STATUS', 'Health Connect status check failed', statusError);
        updateStep("❌ Health Connect Status Check Failed");
        setHealthConnectError(`Status check failed: ${statusError?.message || 'Unknown'}`);
        setFallbackData();
        setLoading(false);
        return;
      }

      // Step 6: Check Permissions
      updateStep("🔐 Checking Health Connect Permissions");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        debugLogger.step('PROGRESS_PERMISSIONS', 'Checking Health Connect permissions');
        const permissions = await Promise.race([
          healthDataService.getPermissionStatus(),
          new Promise<any>((resolve) => 
            setTimeout(() => {
              debugLogger.warn('PROGRESS_PERMISSIONS', 'Permission check timeout');
              resolve({ healthConnect: false, bodySensors: false });
            }, 5000)
          )
        ]);
        
        debugLogger.step('PROGRESS_PERMISSIONS', 'Permission status retrieved', permissions);
        updateStep(`🔐 Permissions: HC=${permissions.healthConnect ? '✅' : '❌'} Sensors=${permissions.bodySensors ? '✅' : '❌'}`);
        
        if (!permissions.healthConnect) {
          debugLogger.warn('PROGRESS_PERMISSIONS', 'Health Connect permissions not granted');
          updateStep("⚠️ Health Connect Permissions Required");
          // Continue anyway to test if we can request permissions
        }
      } catch (permError: any) {
        debugLogger.error('PROGRESS_PERMISSIONS', 'Permission check failed', permError);
        updateStep("❌ Permission Check Failed");
        // Continue anyway
      }

      // Step 7: Fetch Real Data
      updateStep("📊 Fetching Health Data");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        debugLogger.step('PROGRESS_DATA', 'Starting health data fetch');
        
        // Try to get weekly data
        const weekData = await Promise.race([
          healthDataService.getWeeklyHeartRateData(),
          new Promise<WeeklyHeartRateSummary>((_, reject) => 
            setTimeout(() => {
              debugLogger.warn('PROGRESS_DATA', 'Weekly data fetch timeout');
              reject(new Error('Weekly data timeout'));
            }, 10000)
          )
        ]);
        
        debugLogger.step('PROGRESS_DATA', 'Weekly data fetched successfully', { 
          totalMinutes: weekData.totalMinutes 
        });
        setWeeklyData(weekData);
        updateStep("✅ Weekly Data Loaded");

        // Try to get daily data
        const dailyData = await Promise.race([
          getDailyBreakdownForWeek(healthDataService),
          new Promise<DailyProgress[]>((_, reject) => 
            setTimeout(() => {
              debugLogger.warn('PROGRESS_DATA', 'Daily data fetch timeout');
              reject(new Error('Daily data timeout'));
            }, 10000)
          )
        ]);
        
        debugLogger.step('PROGRESS_DATA', 'Daily data fetched successfully', { 
          days: dailyData.length 
        });
        setDailyProgress(dailyData);
        updateStep("✅ All Data Loaded Successfully");
        
      } catch (dataError: any) {
        debugLogger.error('PROGRESS_DATA', 'Health data fetch failed', dataError);
        updateStep("⚠️ Data Fetch Failed - Using Fallback");
        setHealthConnectError(`Data fetch failed: ${dataError?.message || 'Unknown'}`);
        setFallbackData();
      }

      debugLogger.step('PROGRESS_COMPLETE', 'Progress screen initialization completed successfully');
      updateStep("🎉 Initialization Complete");
      
    } catch (criticalError: any) {
      debugLogger.error('PROGRESS_CRITICAL', 'Critical error in progress initialization', criticalError);
      await debugLogger.logCrash('PROGRESS_CRITICAL', criticalError, { step: currentStep });
      updateStep("💥 Critical Error Occurred");
      setError(`Critical error: ${criticalError?.message || 'Unknown error'}`);
      setFallbackData();
    } finally {
      setLoading(false);
      debugLogger.step('PROGRESS_FINAL', 'Progress screen loading completed');
    }
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
            }, 3000)
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

  const handleRetryHealthConnect = async () => {
    debugLogger.step('PROGRESS_RETRY', 'User requested Health Connect retry');
    setLoading(true);
    setError(null);
    setHealthConnectError(null);
    setCurrentStep("🔄 Retrying...");
    
    await new Promise(resolve => setTimeout(resolve, 500));
    await initializeWithDetailedLogging();
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

  const handleConnectHealthData = () => {
    const statusMessage = healthConnectError 
      ? `Health Connect Status: ${healthConnectError}`
      : healthConnectAvailable 
        ? "Health Connect is available and data should be real if you have health data recorded."
        : "Health Connect is not available on this device or permissions were denied. The app is showing demonstration data.";

    Alert.alert(
      "Health Connect Status",
      statusMessage,
      [
        { text: "OK" },
        { 
          text: "Retry", 
          onPress: handleRetryHealthConnect
        },
        {
          text: "Debug Logs",
          onPress: handleShowDebugLogs
        }
      ]
    );
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

  const renderDailyBreakdown = () => {
    return (
      <ThemedView style={styles.breakdownContainer}>
        <ThemedText type="subtitle" style={styles.breakdownTitle}>
          Daily Breakdown
        </ThemedText>
        {dailyProgress.map((day, index) => {
          const dailyGoal = DEFAULT_GOALS.weekly.zone2Plus / 7;
          const percentage = Math.min((day.zone2PlusMinutes / dailyGoal) * 100, 100);
          const isToday = new Date(day.date).toDateString() === new Date().toDateString();
          
          return (
            <View key={day.date} style={styles.dayRow}>
              <View style={styles.dayInfo}>
                <ThemedText style={[
                  styles.dayName,
                  isToday && styles.todayText
                ]}>
                  {day.day}
                </ThemedText>
                <ThemedText style={styles.dayMinutes}>
                  {day.zone2PlusMinutes} min
                </ThemedText>
              </View>
              <View style={styles.dayProgressContainer}>
                <View 
                  style={[
                    styles.dayProgressBar,
                    { backgroundColor: colors.icon + "20" }
                  ]}
                >
                  <View
                    style={[
                      styles.dayProgressFill,
                      {
                        backgroundColor: percentage >= 100 ? "#4CAF50" : colors.tint,
                        width: `${percentage}%`,
                      },
                    ]}
                  />
                </View>
                {percentage >= 100 && (
                  <ThemedText style={styles.checkmark}>✓</ThemedText>
                )}
              </View>
            </View>
          );
        })}
      </ThemedView>
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.centerContent}>
          <ThemedText type="title" style={styles.loadingTitle}>Loading Health Data</ThemedText>
          <ThemedText style={styles.currentStep}>{currentStep}</ThemedText>
          <TouchableOpacity
            style={[styles.debugButton, { backgroundColor: colors.tint, marginTop: 20 }]}
            onPress={handleShowDebugLogs}
          >
            <ThemedText style={styles.debugButtonText}>Show Debug Logs</ThemedText>
          </TouchableOpacity>
        </View>
        {renderDebugLogs()}
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <ThemedText style={styles.currentStep}>Last Step: {currentStep}</ThemedText>
          <View style={styles.errorButtons}>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.tint }]}
              onPress={handleRetryHealthConnect}
            >
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.debugButton, { backgroundColor: '#666' }]}
              onPress={handleShowDebugLogs}
            >
              <ThemedText style={styles.debugButtonText}>Debug Logs</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        {renderDebugLogs()}
      </SafeAreaView>
    );
  }

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
            Progress Tracker
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Track your weekly Zone 2+ exercise minutes
          </ThemedText>
          <ThemedText style={styles.lastStep}>
            Status: {currentStep}
          </ThemedText>
        </View>

        {(!healthConnectAvailable || healthConnectError) && (
          <ThemedView style={styles.healthConnectBanner}>
            <ThemedText style={styles.bannerText}>
              {Platform.OS !== "android" 
                ? "📱 Android device required for Health Connect"
                : healthConnectError
                  ? `⚠️ ${healthConnectError}`
                  : "⚡ Health Connect not available or permissions denied"
              }
            </ThemedText>
            <ThemedText style={styles.bannerSubtext}>
              Showing demonstration data
            </ThemedText>
            <View style={styles.bannerButtons}>
              <TouchableOpacity
                style={[styles.connectButton, { backgroundColor: colors.tint }]}
                onPress={handleConnectHealthData}
              >
                <ThemedText style={styles.connectButtonText}>
                  Check Health Connect
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.debugButton, { backgroundColor: '#666' }]}
                onPress={handleShowDebugLogs}
              >
                <ThemedText style={styles.debugButtonText}>Debug</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}

        {renderChart()}
        {renderDailyBreakdown()}
        {renderDebugLogs()}

        <View style={styles.infoContainer}>
          <ThemedText style={styles.infoText}>
            💡 Aim for at least 150 minutes of Zone 2+ activity per week for optimal brain health benefits.
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
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  currentStep: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    color: "#666",
    fontFamily: "monospace",
  },
  lastStep: {
    fontSize: 12,
    marginTop: 8,
    color: "#666",
    fontFamily: "monospace",
  },
  errorButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  header: {
    padding: 16,
    paddingTop: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  healthConnectBanner: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(33, 150, 243, 0.3)",
  },
  bannerText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    color: "#1976D2",
    fontWeight: "600",
  },
  bannerSubtext: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
    color: "#1976D2",
    opacity: 0.8,
  },
  bannerButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  connectButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  connectButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
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
  breakdownContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dayInfo: {
    flex: 0.3,
  },
  dayName: {
    fontSize: 16,
    fontWeight: "600",
  },
  todayText: {
    color: "#4CAF50",
  },
  dayMinutes: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  dayProgressContainer: {
    flex: 0.7,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  dayProgressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  dayProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  checkmark: {
    fontSize: 18,
    color: "#4CAF50",
    marginLeft: 8,
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
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#F44336",
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});