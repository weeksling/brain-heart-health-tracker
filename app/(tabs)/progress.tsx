import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for demonstration
const MOCK_WEEKLY_DATA = [
  { day: "Mon", zone2PlusMinutes: 25 },
  { day: "Tue", zone2PlusMinutes: 30 },
  { day: "Wed", zone2PlusMinutes: 0 },
  { day: "Thu", zone2PlusMinutes: 45 },
  { day: "Fri", zone2PlusMinutes: 20 },
  { day: "Sat", zone2PlusMinutes: 35 },
  { day: "Sun", zone2PlusMinutes: 15 },
];

const DEFAULT_GOALS = {
  weekly: {
    zone2Plus: 150, // Zone 2 + Zone 3
  },
};

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [showingMockData, setShowingMockData] = useState(true);
  const screenWidth = Dimensions.get("window").width;

  const handleConnectHealthData = () => {
    Alert.alert(
      "Health Connect Required",
      "This feature requires Health Connect integration. In the test version, we're showing mock data for demonstration.",
      [
        { text: "OK" }
      ]
    );
  };

  const getChartData = () => {
    const labels = MOCK_WEEKLY_DATA.map(d => d.day);
    const data = MOCK_WEEKLY_DATA.map(d => d.zone2PlusMinutes);
    
    // Calculate daily goal (weekly goal / 7)
    const dailyGoal = DEFAULT_GOALS.weekly.zone2Plus / 7;
    const goalLine = new Array(MOCK_WEEKLY_DATA.length).fill(dailyGoal);

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
    return MOCK_WEEKLY_DATA.reduce((sum, day) => sum + day.zone2PlusMinutes, 0);
  };

  const renderChart = () => {
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
            Zone 2+ minutes per day {showingMockData && "(Mock Data)"}
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
        {MOCK_WEEKLY_DATA.map((day, index) => {
          const dailyGoal = DEFAULT_GOALS.weekly.zone2Plus / 7;
          const percentage = Math.min((day.zone2PlusMinutes / dailyGoal) * 100, 100);
          const isToday = index === 6; // Mock "today" as Sunday
          
          return (
            <View key={day.day} style={styles.dayRow}>
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

        {showingMockData && (
          <ThemedView style={styles.mockDataBanner}>
            <ThemedText style={styles.mockDataText}>
              📊 Showing mock data for demonstration
            </ThemedText>
            <TouchableOpacity
              style={[styles.connectButton, { backgroundColor: colors.tint }]}
              onPress={handleConnectHealthData}
            >
              <ThemedText style={styles.connectButtonText}>
                Connect Health Data
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}

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
  mockDataBanner: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 193, 7, 0.3)",
  },
  mockDataText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    color: "#F57C00",
  },
  connectButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "center",
  },
  connectButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
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
});