package com.brainheartfitness.data.repository

import com.brainheartfitness.data.health.HealthConnectManager
import com.brainheartfitness.data.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.roundToInt

@Singleton
class HealthDataRepository @Inject constructor(
    private val healthConnectManager: HealthConnectManager
) {
    
    suspend fun getWeeklyHealthSummary(): WeeklyHealthSummary = withContext(Dispatchers.IO) {
        val now = Instant.now()
        val weekStart = getWeekStart(now)
        
        // Get heart rate data for the week
        val heartRateData = healthConnectManager.getHeartRateData(weekStart, now)
        val stepsData = healthConnectManager.getStepsData(weekStart, now)
        
        // For demo purposes, generate some realistic dummy data
        val zones = HeartRateZone.DEFAULT_ZONES
        val dummyZoneBreakdown = mapOf(
            "zone1" to (20..40).random(),
            "zone2" to (80..120).random(),
            "zone3" to (30..60).random(),
            "zone4" to (10..25).random(),
            "zone5" to (5..15).random()
        )
        
        val totalMinutes = dummyZoneBreakdown.values.sum()
        val averageHeartRate = (65..85).random()
        val maxHeartRate = (150..180).random()
        val minHeartRate = (55..70).random()
        val totalSteps = (8000..15000).random()
        
        WeeklyHealthSummary(
            totalMinutes = totalMinutes,
            zoneBreakdown = dummyZoneBreakdown,
            sessions = generateDummySessions(),
            averageHeartRate = averageHeartRate,
            maxHeartRate = maxHeartRate,
            minHeartRate = minHeartRate,
            totalSteps = totalSteps
        )
    }
    
    suspend fun getDailyHealthSummary(date: LocalDate): DailyHealthSummary = withContext(Dispatchers.IO) {
        val dayStart = date.atStartOfDay(ZoneId.systemDefault()).toInstant()
        val dayEnd = dayStart.plus(1, ChronoUnit.DAYS)
        
        // Get data for the day
        val heartRateData = healthConnectManager.getHeartRateData(dayStart, dayEnd)
        val stepsData = healthConnectManager.getStepsData(dayStart, dayEnd)
        
        // For demo purposes, generate some realistic dummy data
        val dummyZoneBreakdown = mapOf(
            "zone1" to (5..15).random(),
            "zone2" to (15..35).random(),
            "zone3" to (5..15).random(),
            "zone4" to (0..8).random(),
            "zone5" to (0..5).random()
        )
        
        val totalMinutes = dummyZoneBreakdown.values.sum()
        val averageHeartRate = (65..85).random()
        val maxHeartRate = (120..160).random()
        val minHeartRate = (55..70).random()
        val steps = (2000..12000).random()
        
        DailyHealthSummary(
            date = date,
            totalMinutes = totalMinutes,
            zoneBreakdown = dummyZoneBreakdown,
            sessions = generateDummySessions(1),
            averageHeartRate = averageHeartRate,
            maxHeartRate = maxHeartRate,
            minHeartRate = minHeartRate,
            steps = steps
        )
    }
    
    suspend fun getWeeklyProgress(): List<DailyProgress> = withContext(Dispatchers.IO) {
        val today = LocalDate.now()
        val weekStart = today.minusDays(today.dayOfWeek.value.toLong() - 1)
        
        (0..6).map { dayOffset ->
            val date = weekStart.plusDays(dayOffset.toLong())
            val zone2PlusMinutes = if (date <= today) {
                (10..45).random() // Random data for demo
            } else {
                0 // Future days
            }
            
            DailyProgress(
                day = date.dayOfWeek,
                date = date,
                zone2PlusMinutes = zone2PlusMinutes
            )
        }
    }
    
    fun convertToProgressData(
        summary: WeeklyHealthSummary,
        timeRange: TimeRange
    ): ProgressData {
        val zones = HeartRateZone.DEFAULT_ZONES
        val goals = if (timeRange == TimeRange.DAILY) {
            mapOf("zone1" to 20, "zone2" to 25, "zone3" to 5, "zone2Plus" to 30)
        } else {
            mapOf("zone1" to 150, "zone2" to 150, "zone3" to 30, "zone2Plus" to 150)
        }
        
        val progressZones = zones.map { zone ->
            zone.copy(
                minutes = summary.zoneBreakdown[zone.id] ?: 0,
                dailyGoal = if (timeRange == TimeRange.DAILY) goals[zone.id] ?: 0 else zone.dailyGoal,
                weeklyGoal = if (timeRange == TimeRange.WEEKLY) goals[zone.id] ?: 0 else zone.weeklyGoal
            )
        }
        
        val totalZone2PlusMinutes = (summary.zoneBreakdown["zone2"] ?: 0) + (summary.zoneBreakdown["zone3"] ?: 0)
        
        return ProgressData(
            zones = progressZones,
            totalZone2PlusMinutes = totalZone2PlusMinutes,
            zone2PlusGoal = goals["zone2Plus"] ?: 150
        )
    }
    
    fun convertToProgressData(
        summary: DailyHealthSummary,
        timeRange: TimeRange
    ): ProgressData {
        val zones = HeartRateZone.DEFAULT_ZONES
        val goals = if (timeRange == TimeRange.DAILY) {
            mapOf("zone1" to 20, "zone2" to 25, "zone3" to 5, "zone2Plus" to 30)
        } else {
            mapOf("zone1" to 150, "zone2" to 150, "zone3" to 30, "zone2Plus" to 150)
        }
        
        val progressZones = zones.map { zone ->
            zone.copy(
                minutes = summary.zoneBreakdown[zone.id] ?: 0,
                dailyGoal = if (timeRange == TimeRange.DAILY) goals[zone.id] ?: 0 else zone.dailyGoal,
                weeklyGoal = if (timeRange == TimeRange.WEEKLY) goals[zone.id] ?: 0 else zone.weeklyGoal
            )
        }
        
        val totalZone2PlusMinutes = (summary.zoneBreakdown["zone2"] ?: 0) + (summary.zoneBreakdown["zone3"] ?: 0)
        
        return ProgressData(
            zones = progressZones,
            totalZone2PlusMinutes = totalZone2PlusMinutes,
            zone2PlusGoal = goals["zone2Plus"] ?: 30
        )
    }
    
    private fun getWeekStart(timestamp: Instant): Instant {
        val date = timestamp.atZone(ZoneId.systemDefault()).toLocalDate()
        val weekStart = date.minusDays(date.dayOfWeek.value.toLong() - 1)
        return weekStart.atStartOfDay(ZoneId.systemDefault()).toInstant()
    }
    
    private fun generateDummySessions(count: Int = 3): List<HeartRateSession> {
        val now = Instant.now()
        return (0 until count).map { i ->
            val sessionStart = now.minus((i + 1L) * 8L, ChronoUnit.HOURS)
            val sessionEnd = sessionStart.plus(45, ChronoUnit.MINUTES)
            
            HeartRateSession(
                startTime = sessionStart,
                endTime = sessionEnd,
                averageBpm = (70..140).random(),
                maxBpm = (140..180).random(),
                minBpm = (60..80).random(),
                zoneMinutes = mapOf(
                    "zone1" to (5..15).random(),
                    "zone2" to (15..25).random(),
                    "zone3" to (10..20).random(),
                    "zone4" to (0..5).random(),
                    "zone5" to (0..3).random()
                )
            )
        }
    }
}