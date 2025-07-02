import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DailyHeartRateSummary,
  healthDataService,
  HeartRateZone,
  WeeklyHeartRateSummary,
} from "@/services/HealthDataService";
import { useEffect, useState } from "react";
import {
  Alert,
  AppState,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Data models for heart rate zone tracking
interface ProgressData {
  zones: HeartRateZone[];
  totalZone2PlusMinutes: number;
  zone2PlusGoal: number; // Primary goal: 150 min of zone 2+
}

// Default goals based on "Spark" research
const DEFAULT_GOALS = {
  weekly: {
    zone1: 150,
    zone2: 150,
    zone3: 30,
    zone2Plus: 150, // Zone 2 + Zone 3
  },
  daily: {
    zone1: 20,
    zone2: 25,
    zone3: 5,
    zone2Plus: 30, // Zone 2 + Zone 3
  },
};

type TabType = "daily" | "weekly";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [activeTab, setActiveTab] = useState<TabType>("daily");
  const [weeklyData, setWeeklyData] = useState<WeeklyHeartRateSummary | null>(
    null
  );
  const [dailyData, setDailyData] = useState<DailyHeartRateSummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Animation values for tab switching
  const translateX = useSharedValue(0);

  // Initialize health data service and fetch data
  useEffect(() => {
    // Handle app state changes for permissions
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: string) => {
        if (nextAppState === "active" && !permissionsGranted && !loading) {
          // Re-check permissions when app comes to foreground
          initializeHealthData();
        }
      }
    );

    initializeHealthData();

    return () => {
      subscription.remove();
    };
  }, []);

  const initializeHealthData = async () => {
    try {
      setLoading(true);
      setError(null);

      // In Expo Go, Health Connect initialization will fail gracefully
      // No need to check explicitly

      // Check if we're on Android
      if (Platform.OS !== "android") {
        setError("This app is currently only available for Android devices");
        return;
      }

      // Initialize the health data service
      const initialized = await healthDataService.initialize();

      // If running in Expo Go, the service will automatically use dummy data
      // and return true, so we can proceed normally
      if (initialized) {
        setPermissionsGranted(true);
      } else {
        // Only show error if we're not in Expo Go
        Alert.alert(
          "Health Connect Setup",
          "This app requires Health Connect to track your fitness data. The app will use simulated data for now.",
          [
            {
              text: "OK",
              onPress: () => {
                setPermissionsGranted(true);
              },
            },
          ]
        );
      }

      // Fetch initial data
      await Promise.all([fetchWeeklyData(), fetchDailyData()]);
    } catch (err) {
      console.error("Failed to initialize health data:", err);

      // More user-friendly error handling
      if (err instanceof Error && err.message.includes("Health Connect")) {
        setError(
          "Health Connect is not available on this device. Please ensure you have Health Connect installed."
        );
      } else {
        setError(
          "Failed to load health data. The app will use simulated data."
        );
      }

      // Still try to load dummy data
      await Promise.all([fetchWeeklyData(), fetchDailyData()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const data = await healthDataService.getWeeklyHeartRateData();
      setWeeklyData(data);
    } catch (err) {
      console.error("Failed to fetch weekly data:", err);
      // Keep existing data if available
    }
  };

  const fetchDailyData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const data = await healthDataService.getDailyHeartRateData(today);
      setDailyData(data);
    } catch (err) {
      console.error("Failed to fetch daily data:", err);
      // Keep existing data if available
    }
  };

  // Convert health data to UI format
  const convertToProgressData = (
    summary: WeeklyHeartRateSummary | DailyHeartRateSummary,
    isDaily: boolean
  ): ProgressData => {
    const zones = healthDataService.getHeartRateZones();
    const goals = isDaily ? DEFAULT_GOALS.daily : DEFAULT_GOALS.weekly;

    const progressZones = zones.map((zone) => ({
      ...zone,
      minutes: summary.zoneBreakdown[zone.id] || 0,
      weeklyGoal: goals[zone.id as keyof typeof goals] || 0,
      dailyGoal:
        DEFAULT_GOALS.daily[zone.id as keyof typeof DEFAULT_GOALS.daily] || 0,
    }));

    const totalZone2PlusMinutes =
      (summary.zoneBreakdown.zone2 || 0) + (summary.zoneBreakdown.zone3 || 0);

    return {
      zones: progressZones,
      totalZone2PlusMinutes,
      zone2PlusGoal: goals.zone2Plus,
    };
  };

  // Get current data based on active tab
  const getCurrentData = (): ProgressData => {
    if (activeTab === "daily") {
      if (dailyData) {
        return convertToProgressData(dailyData, true);
      }
    } else {
      if (weeklyData) {
        return convertToProgressData(weeklyData, false);
      }
    }

    // Fallback to empty data if no real data available
    const zones = healthDataService.getHeartRateZones();
    const goals =
      activeTab === "daily" ? DEFAULT_GOALS.daily : DEFAULT_GOALS.weekly;

    return {
      zones: zones.map((zone) => ({
        ...zone,
        minutes: 0,
        weeklyGoal: goals[zone.id as keyof typeof goals] || 0,
        dailyGoal:
          DEFAULT_GOALS.daily[zone.id as keyof typeof DEFAULT_GOALS.daily] || 0,
      })),
      totalZone2PlusMinutes: 0,
      zone2PlusGoal: goals.zone2Plus,
    };
  };

  const currentData = getCurrentData();
  const goalText =
    activeTab === "daily" ? "Daily Goal: Zone 2+" : "Weekly Goal: Zone 2+";
  const goalDescription =
    activeTab === "daily"
      ? `${currentData.zone2PlusGoal} minutes of moderate+ activity today`
      : `${currentData.zone2PlusGoal} minutes of moderate+ activity this week`;

  const switchToTab = (tab: TabType) => {
    setActiveTab(tab);
    translateX.value = withSpring(0);

    // Refresh data when switching tabs
    if (tab === "daily") {
      fetchDailyData();
    } else {
      fetchWeeklyData();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const renderZoneCard = (
    zone: HeartRateZone & {
      minutes: number;
      weeklyGoal: number;
      dailyGoal: number;
    }
  ) => {
    const goal = activeTab === "daily" ? zone.dailyGoal : zone.weeklyGoal;
    const progressPercentage = Math.min((zone.minutes / goal) * 100, 100);

    return (
      <ThemedView key={zone.id} style={styles.zoneCard}>
        <View style={styles.zoneHeader}>
          <View style={styles.zoneInfo}>
            <ThemedText type="subtitle" style={styles.zoneName}>
              {zone.name}
            </ThemedText>
            <ThemedText style={styles.zoneDescription}>
              {zone.description}
            </ThemedText>
          </View>
          <View style={styles.zoneMinutes}>
            <ThemedText
              type="title"
              style={[styles.minutesText, { color: zone.color }]}
            >
              {zone.minutes}
            </ThemedText>
            <ThemedText style={styles.minutesLabel}>min</ThemedText>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: colors.icon + "15" },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: zone.color,
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
          <ThemedText style={styles.goalText}>Goal: {goal} min</ThemedText>
        </View>
      </ThemedView>
    );
  };

  const renderGoalCard = () => {
    const progressPercentage = Math.min(
      (currentData.totalZone2PlusMinutes / currentData.zone2PlusGoal) * 100,
      100
    );

    return (
      <ThemedView style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <ThemedText type="title" style={styles.goalTitle}>
            {goalText}
          </ThemedText>
          <ThemedText style={styles.goalDescription}>
            {goalDescription}
          </ThemedText>
        </View>

        <View style={styles.goalProgress}>
          <View style={styles.goalMinutes}>
            <ThemedText
              type="title"
              style={[styles.goalMinutesText, { color: colors.tint }]}
            >
              {currentData.totalZone2PlusMinutes}
            </ThemedText>
            <ThemedText style={styles.goalMinutesLabel}>
              / {currentData.zone2PlusGoal} min
            </ThemedText>
          </View>

          <View style={styles.goalProgressBar}>
            <View
              style={[
                styles.goalProgressFill,
                {
                  backgroundColor: colors.tint,
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
        </View>

        {progressPercentage >= 100 && (
          <View style={styles.achievementBadge}>
            <ThemedText style={styles.achievementText}>
              🎉 Goal Achieved!
            </ThemedText>
          </View>
        )}
      </ThemedView>
    );
  };

  const renderTabBar = () => {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "daily" && styles.activeTabButton,
          ]}
          onPress={() => switchToTab("daily")}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "daily" && styles.activeTabText,
            ]}
          >
            Daily
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "weekly" && styles.activeTabButton,
          ]}
          onPress={() => switchToTab("weekly")}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "weekly" && styles.activeTabText,
            ]}
          >
            Weekly
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderErrorState = () => {
    if (!error) return null;

    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={initializeHealthData}
        >
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  const renderLoadingState = () => {
    if (!loading) return null;

    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText style={styles.loadingText}>
          Loading health data...
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Brain Heart Fitness
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Track your heart rate zones for optimal brain health
        </ThemedText>
      </View>

      {renderTabBar()}

      {renderLoadingState()}
      {renderErrorState()}

      {!loading && !error && (
        <Animated.View style={styles.content}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderGoalCard()}

            <View style={styles.zonesContainer}>
              <ThemedText type="subtitle" style={styles.zonesTitle}>
                Heart Rate Zones
              </ThemedText>
              {currentData.zones.map((zone, index) =>
                renderZoneCard(zone as any)
              )}
            </View>

            <View style={styles.encouragementContainer}>
              <ThemedText style={styles.encouragementText}>
                💪 Keep moving! Every minute in Zone 2+ supports your brain
                health.
              </ThemedText>
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.7,
  },
  activeTabText: {
    opacity: 1,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40, // Extra padding at bottom for better scrolling
  },
  zonesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  zonesTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  zoneCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  zoneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  zoneDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  zoneMinutes: {
    alignItems: "center",
  },
  minutesText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  minutesLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  goalText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "right",
  },
  goalCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  goalHeader: {
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  goalProgress: {
    gap: 12,
    marginBottom: 16,
  },
  goalMinutes: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  goalMinutesText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#64B5F6",
  },
  goalMinutesLabel: {
    fontSize: 16,
    opacity: 0.7,
    marginLeft: 4,
  },
  goalProgressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  goalProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  achievementBadge: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#64B5F6",
    alignItems: "center",
    justifyContent: "center",
  },
  achievementText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  encouragementContainer: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  encouragementText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  errorContainer: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 20,
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#64B5F6",
    alignItems: "center",
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  content: {
    flex: 1,
  },
});
