import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
    healthDataService,
    WeeklyHeartRateSummary,
} from "@/services/HealthDataService";
import { useEffect, useState } from "react";
import {
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

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [weeklyData, setWeeklyData] = useState<WeeklyHeartRateSummary | null>(
    null
  );
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize health service if not already done
      const initialized = await healthDataService.initialize();
      
      if (Platform.OS !== "android") {
        setError("This app is currently only available for Android devices");
        return;
      }

      // Fetch weekly data
      await fetchWeeklyProgress();
    } catch (err) {
      console.error("Failed to initialize progress data:", err);
      setError("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyProgress = async () => {
    try {
      // Get current week data
      const weekData = await healthDataService.getWeeklyHeartRateData();
      setWeeklyData(weekData);

      // Get daily breakdown for the week
      const dailyData = await getDailyBreakdownForWeek();
      setDailyProgress(dailyData);
    } catch (err) {
      console.error("Failed to fetch weekly progress:", err);
    }
  };

  const getDailyBreakdownForWeek = async (): Promise<DailyProgress[]> => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const dailyData: DailyProgress[] = [];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const promises = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      
      if (date <= today) {
        return healthDataService.getDailyHeartRateData(dateString).then(dayData => {
          const zone2PlusMinutes = 
            (dayData.zoneBreakdown.zone2 || 0) + 
            (dayData.zoneBreakdown.zone3 || 0);
          return {
            day: dayNames[i],
            date: dateString,
            zone2PlusMinutes,
          };
        });
      } else {
        // Future days show as 0
        return Promise.resolve({
          day: dayNames[i],
          date: dateString,
          zone2PlusMinutes: 0,
        });
      }
    });
    
    const dailyData = await Promise.all(promises);
    return dailyData;

    return dailyData;
  };

  const getChartData = () => {
    const labels = dailyProgress.map(d => d.day);
    const data = dailyProgress.map(d => d.zone2PlusMinutes);
    
    // Calculate daily goal (weekly goal / 7)
    const dailyGoal = DEFAULT_GOALS.weekly.zone2Plus / 7;
    const goalLine = new Array(7).fill(dailyGoal);

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
          strokeDashArray: [5, 5], // Creates dotted line
        },
      ],
    };
  };

  const calculateWeeklyTotal = () => {
    return dailyProgress.reduce((sum, day) => sum + day.zone2PlusMinutes, 0);
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
            Zone 2+ minutes per day
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
            <View key={index} style={styles.dayRow}>
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
          <ThemedText>Loading progress data...</ThemedText>
        </View>
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
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
            onPress={initializeData}
          >
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
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
        </View>

        {renderChart()}
        {renderDailyBreakdown()}

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
    fontWeight: "500",
  },
  todayText: {
    fontWeight: "700",
  },
  dayMinutes: {
    fontSize: 14,
    opacity: 0.7,
  },
  dayProgressContainer: {
    flex: 0.7,
    flexDirection: "row",
    alignItems: "center",
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
    marginLeft: 8,
    fontSize: 16,
    color: "#4CAF50",
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(100, 181, 246, 0.1)",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
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