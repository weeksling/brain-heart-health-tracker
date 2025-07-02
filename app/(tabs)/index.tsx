import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Data models for heart rate zone tracking
interface HeartRateZone {
  id: string;
  name: string;
  description: string;
  color: string;
  minutes: number;
  weeklyGoal: number;
  dailyGoal: number;
}

interface ProgressData {
  zones: HeartRateZone[];
  totalZone2PlusMinutes: number;
  zone2PlusGoal: number; // Primary goal: 150 min of zone 2+
}

// TODO: Replace with real health data from Health Connect/Google Fit
// This would be aggregated from heart rate data over the current week/day
const dummyWeeklyData: ProgressData = {
  zones: [
    {
      id: "zone1",
      name: "Zone 1",
      description: "Recovery",
      color: "#81C784", // Soft green
      minutes: 120,
      weeklyGoal: 150,
      dailyGoal: 20,
    },
    {
      id: "zone2",
      name: "Zone 2",
      description: "Aerobic Base",
      color: "#64B5F6", // Soft blue
      minutes: 60,
      weeklyGoal: 150,
      dailyGoal: 25,
    },
    {
      id: "zone3",
      name: "Zone 3",
      description: "Tempo",
      color: "#FFB74D", // Soft orange
      minutes: 10,
      weeklyGoal: 30,
      dailyGoal: 5,
    },
  ],
  totalZone2PlusMinutes: 70, // Zone 2 + Zone 3
  zone2PlusGoal: 150, // Science-based goal from "Spark"
};

const dummyDailyData: ProgressData = {
  zones: [
    {
      id: "zone1",
      name: "Zone 1",
      description: "Recovery",
      color: "#81C784", // Soft green
      minutes: 15,
      weeklyGoal: 150,
      dailyGoal: 20,
    },
    {
      id: "zone2",
      name: "Zone 2",
      description: "Aerobic Base",
      color: "#64B5F6", // Soft blue
      minutes: 8,
      weeklyGoal: 150,
      dailyGoal: 25,
    },
    {
      id: "zone3",
      name: "Zone 3",
      description: "Tempo",
      color: "#FFB74D", // Soft orange
      minutes: 2,
      weeklyGoal: 30,
      dailyGoal: 5,
    },
  ],
  totalZone2PlusMinutes: 10, // Zone 2 + Zone 3
  zone2PlusGoal: 30, // Daily goal: 30 min of zone 2+
};

type TabType = "daily" | "weekly";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [activeTab, setActiveTab] = useState<TabType>("daily");

  const currentData = activeTab === "daily" ? dummyDailyData : dummyWeeklyData;
  const goalText =
    activeTab === "daily" ? "Daily Goal: Zone 2+" : "Weekly Goal: Zone 2+";
  const goalDescription =
    activeTab === "daily"
      ? `${currentData.zone2PlusGoal} minutes of moderate+ activity today`
      : `${currentData.zone2PlusGoal} minutes of moderate+ activity this week`;

  const renderZoneCard = (zone: HeartRateZone) => {
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
          <ThemedText style={styles.progressText}>
            {zone.minutes}/{goal} min
          </ThemedText>
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
        <ThemedText type="subtitle" style={styles.goalTitle}>
          {goalText}
        </ThemedText>
        <ThemedText style={styles.goalDescription}>
          {goalDescription}
        </ThemedText>

        <View style={styles.goalProgressContainer}>
          <View style={styles.goalProgressHeader}>
            <ThemedText type="title" style={styles.goalProgressNumber}>
              {currentData.totalZone2PlusMinutes}
            </ThemedText>
            <ThemedText style={styles.goalProgressLabel}>
              / {currentData.zone2PlusGoal} min
            </ThemedText>
          </View>

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
                  backgroundColor: "#64B5F6", // Zone 2 blue
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
        </View>

        <ThemedText style={styles.encouragement}>
          {progressPercentage >= 100
            ? `Excellent! You've hit your brain health goal this ${
                activeTab === "daily" ? "day" : "week"
              }.`
            : `You're building a strong foundation for brain health and recovery.`}
        </ThemedText>
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
          onPress={() => setActiveTab("daily")}
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
          onPress={() => setActiveTab("weekly")}
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Brain Health Tracker
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {activeTab === "daily"
            ? "Today's heart rate zones"
            : "This week's heart rate zones"}
        </ThemedText>
      </View>

      {renderTabBar()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.zonesContainer}>
          {currentData.zones.map(renderZoneCard)}
        </View>

        {renderGoalCard()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
  progressText: {
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
  goalProgressContainer: {
    gap: 12,
    marginBottom: 16,
  },
  goalProgressHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  goalProgressNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#64B5F6",
  },
  goalProgressLabel: {
    fontSize: 16,
    opacity: 0.7,
    marginLeft: 4,
  },
  encouragement: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.8,
  },
});
