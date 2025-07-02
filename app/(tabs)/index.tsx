import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Data models for heart rate zone tracking
interface HeartRateZone {
  id: string;
  name: string;
  description: string;
  color: string;
  minutes: number;
  weeklyGoal: number;
}

interface WeeklyProgress {
  zones: HeartRateZone[];
  totalZone2PlusMinutes: number;
  zone2PlusGoal: number; // Primary goal: 150 min of zone 2+
}

// TODO: Replace with real health data from Health Connect/Google Fit
// This would be aggregated from heart rate data over the current week
const dummyWeeklyData: WeeklyProgress = {
  zones: [
    {
      id: "zone1",
      name: "Zone 1",
      description: "Recovery",
      color: "#81C784", // Soft green
      minutes: 120,
      weeklyGoal: 150,
    },
    {
      id: "zone2",
      name: "Zone 2",
      description: "Aerobic Base",
      color: "#64B5F6", // Soft blue
      minutes: 60,
      weeklyGoal: 150,
    },
    {
      id: "zone3",
      name: "Zone 3",
      description: "Tempo",
      color: "#FFB74D", // Soft orange
      minutes: 10,
      weeklyGoal: 30,
    },
  ],
  totalZone2PlusMinutes: 70, // Zone 2 + Zone 3
  zone2PlusGoal: 150, // Science-based goal from "Spark"
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const renderZoneCard = (zone: HeartRateZone) => {
    const progressPercentage = Math.min(
      (zone.minutes / zone.weeklyGoal) * 100,
      100
    );

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
            {zone.minutes}/{zone.weeklyGoal} min
          </ThemedText>
        </View>
      </ThemedView>
    );
  };

  const renderWeeklyGoal = () => {
    const progressPercentage = Math.min(
      (dummyWeeklyData.totalZone2PlusMinutes / dummyWeeklyData.zone2PlusGoal) *
        100,
      100
    );

    return (
      <ThemedView style={styles.weeklyGoalCard}>
        <ThemedText type="subtitle" style={styles.weeklyGoalTitle}>
          Weekly Goal: Zone 2+
        </ThemedText>
        <ThemedText style={styles.weeklyGoalDescription}>
          {dummyWeeklyData.zone2PlusGoal} minutes of moderate+ activity
        </ThemedText>

        <View style={styles.weeklyProgressContainer}>
          <View style={styles.weeklyProgressHeader}>
            <ThemedText type="title" style={styles.weeklyProgressNumber}>
              {dummyWeeklyData.totalZone2PlusMinutes}
            </ThemedText>
            <ThemedText style={styles.weeklyProgressLabel}>
              / {dummyWeeklyData.zone2PlusGoal} min
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
            ? "Excellent! You've hit your brain health goal this week."
            : "You're building a strong foundation for brain health and recovery."}
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Brain Health Tracker
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            This week's heart rate zones
          </ThemedText>
        </View>

        <View style={styles.zonesContainer}>
          {dummyWeeklyData.zones.map(renderZoneCard)}
        </View>

        {renderWeeklyGoal()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Extra padding at bottom for better scrolling
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
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
  weeklyGoalCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  weeklyGoalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  weeklyGoalDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  weeklyProgressContainer: {
    gap: 12,
    marginBottom: 16,
  },
  weeklyProgressHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  weeklyProgressNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#64B5F6",
  },
  weeklyProgressLabel: {
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
