package com.brainheartfitness.data.model

import java.time.DayOfWeek
import java.time.Instant
import java.time.LocalDate

data class HeartRateSession(
    val startTime: Instant,
    val endTime: Instant,
    val averageBpm: Int,
    val maxBpm: Int,
    val minBpm: Int,
    val zoneMinutes: Map<String, Int>
)

data class DailyHealthSummary(
    val date: LocalDate,
    val totalMinutes: Int,
    val zoneBreakdown: Map<String, Int>,
    val sessions: List<HeartRateSession>,
    val averageHeartRate: Int,
    val maxHeartRate: Int,
    val minHeartRate: Int,
    val steps: Int
)

data class WeeklyHealthSummary(
    val totalMinutes: Int,
    val zoneBreakdown: Map<String, Int>,
    val sessions: List<HeartRateSession>,
    val averageHeartRate: Int,
    val maxHeartRate: Int,
    val minHeartRate: Int,
    val totalSteps: Int
)

data class ProgressData(
    val zones: List<HeartRateZone>,
    val totalZone2PlusMinutes: Int,
    val zone2PlusGoal: Int
)

data class DailyProgress(
    val day: DayOfWeek,
    val date: LocalDate,
    val zone2PlusMinutes: Int
)

enum class TimeRange {
    DAILY,
    WEEKLY
}

enum class HealthConnectState {
    AVAILABLE,
    NOT_INSTALLED,
    UPDATE_REQUIRED,
    NOT_SUPPORTED
}