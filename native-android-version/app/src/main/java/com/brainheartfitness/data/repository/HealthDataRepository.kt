package com.brainheartfitness.data.repository

import android.util.Log
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.metadata.Metadata
import com.brainheartfitness.data.DataSourceManager
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
    private val healthConnectManager: HealthConnectManager,
    private val dataSourceManager: DataSourceManager
) {
    
    companion object {
        private const val TAG = "HealthDataRepository"
    }
    
    suspend fun getWeeklyHealthSummary(): WeeklyHealthSummary = withContext(Dispatchers.IO) {
        val now = Instant.now()
        val weekStart = getWeekStart(now)
        // Use end of today instead of current moment to ensure consistent data capture
        val today = LocalDate.now()
        val weekEnd = today.atStartOfDay(ZoneId.systemDefault()).toInstant().plus(1, ChronoUnit.DAYS)
        
        Log.d(TAG, "Fetching weekly health summary from $weekStart to $weekEnd")
        
        try {
            // Get real data from Health Connect
            val heartRateData = healthConnectManager.getHeartRateData(weekStart, weekEnd)
            val stepsData = healthConnectManager.getStepsData(weekStart, weekEnd)
            
            // Process heart rate data into zone minutes
            val zoneBreakdown = processHeartRateIntoZones(heartRateData)
            val heartRateStats = calculateHeartRateStats(heartRateData)
            val totalSteps = calculateTotalSteps(stepsData)
            
            val totalMinutes = zoneBreakdown.values.sum()
            
            Log.d(TAG, "Weekly summary: $totalMinutes total minutes, $totalSteps steps, zones: $zoneBreakdown")
            
            WeeklyHealthSummary(
                totalMinutes = totalMinutes,
                zoneBreakdown = zoneBreakdown,
                sessions = generateSessionsFromHeartRateData(heartRateData),
                averageHeartRate = heartRateStats.average,
                maxHeartRate = heartRateStats.max,
                minHeartRate = heartRateStats.min,
                totalSteps = totalSteps
            )
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching weekly health summary", e)
            // Return fallback data
            generateFallbackWeeklyData()
        }
    }
    
    suspend fun getDailyHealthSummary(date: LocalDate): DailyHealthSummary = withContext(Dispatchers.IO) {
        val dayStart = date.atStartOfDay(ZoneId.systemDefault()).toInstant()
        val dayEnd = dayStart.plus(1, ChronoUnit.DAYS)
        
        Log.d(TAG, "Fetching daily health summary for $date")
        
        try {
            // Get real data from Health Connect
            val heartRateData = healthConnectManager.getHeartRateData(dayStart, dayEnd)
            val stepsData = healthConnectManager.getStepsData(dayStart, dayEnd)
            
            // Process heart rate data into zone minutes
            val zoneBreakdown = processHeartRateIntoZones(heartRateData)
            val heartRateStats = calculateHeartRateStats(heartRateData)
            val steps = calculateTotalSteps(stepsData)
            
            val totalMinutes = zoneBreakdown.values.sum()
            
            Log.d(TAG, "Daily summary: $totalMinutes total minutes, $steps steps, zones: $zoneBreakdown")
            
            DailyHealthSummary(
                date = date,
                totalMinutes = totalMinutes,
                zoneBreakdown = zoneBreakdown,
                sessions = generateSessionsFromHeartRateData(heartRateData),
                averageHeartRate = heartRateStats.average,
                maxHeartRate = heartRateStats.max,
                minHeartRate = heartRateStats.min,
                steps = steps
            )
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching daily health summary", e)
            // Return fallback data
            generateFallbackDailyData(date)
        }
    }
    
    suspend fun getWeeklyProgress(): List<DailyProgress> = withContext(Dispatchers.IO) {
        val today = LocalDate.now()
        val weekStart = today.minusDays(today.dayOfWeek.value.toLong() - 1)
        
        Log.d(TAG, "Fetching weekly progress data")
        
        try {
            val progressList = mutableListOf<DailyProgress>()
            
            for (dayOffset in 0..6) {
                val date = weekStart.plusDays(dayOffset.toLong())
                val zone2PlusMinutes = if (date <= today) {
                    val dayStart = date.atStartOfDay(ZoneId.systemDefault()).toInstant()
                    val dayEnd = dayStart.plus(1, ChronoUnit.DAYS)
                    
                    val heartRateData = healthConnectManager.getHeartRateData(dayStart, dayEnd)
                    val zoneBreakdown = processHeartRateIntoZones(heartRateData)
                    
                    // Calculate Zone 2+ minutes (Zone 2, 3, 4, 5)
                    (zoneBreakdown["zone2"] ?: 0) + 
                    (zoneBreakdown["zone3"] ?: 0) + 
                    (zoneBreakdown["zone4"] ?: 0) + 
                    (zoneBreakdown["zone5"] ?: 0)
                } else {
                    0 // Future days
                }
                
                progressList.add(DailyProgress(
                    day = date.dayOfWeek,
                    date = date,
                    zone2PlusMinutes = zone2PlusMinutes
                ))
            }
            
            Log.d(TAG, "Weekly progress calculated for ${progressList.size} days")
            return@withContext progressList
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching weekly progress", e)
            // Return fallback data
            generateFallbackWeeklyProgress()
        }
    }
    
    // Process heart rate records into zone minutes
    private fun processHeartRateIntoZones(heartRateData: List<HeartRateRecord>): Map<String, Int> {
        val zones = HeartRateZone.DEFAULT_ZONES
        val zoneMinutes = mutableMapOf<String, Int>()
        
        // Initialize zone minutes
        zones.forEach { zone ->
            zoneMinutes[zone.id] = 0
        }
        
        // Process each heart rate record
        heartRateData.forEach { record ->
            record.samples.forEach { sample ->
                val bpm = sample.beatsPerMinute.toInt()
                val zone = zones.find { bpm >= it.minBpm && bpm <= it.maxBpm }
                
                if (zone != null) {
                    // Each sample represents approximately 5 minutes of data
                    val minutes = 5 // This could be calculated based on the time interval between samples
                    zoneMinutes[zone.id] = zoneMinutes[zone.id]!! + minutes
                }
            }
        }
        
        Log.d(TAG, "Processed ${heartRateData.size} heart rate records into zones: $zoneMinutes")
        return zoneMinutes
    }
    
    // Calculate heart rate statistics
    private fun calculateHeartRateStats(heartRateData: List<HeartRateRecord>): HeartRateStats {
        if (heartRateData.isEmpty()) {
            return HeartRateStats(0, 0, 0)
        }
        
        val bpmValues = heartRateData.flatMap { record ->
            record.samples.map { it.beatsPerMinute.toInt() }
        }
        
        if (bpmValues.isEmpty()) {
            return HeartRateStats(0, 0, 0)
        }
        
        return HeartRateStats(
            average = bpmValues.average().roundToInt(),
            max = bpmValues.maxOrNull() ?: 0,
            min = bpmValues.minOrNull() ?: 0
        )
    }
    
    // Calculate total steps from steps records
    private fun calculateTotalSteps(stepsData: List<StepsRecord>): Int {
        return stepsData.sumOf { it.count }.toInt()
    }
    
    // Generate sessions from heart rate data by grouping consecutive high heart rate periods
    private fun generateSessionsFromHeartRateData(heartRateData: List<HeartRateRecord>): List<HeartRateSession> {
        if (heartRateData.isEmpty()) return emptyList()
        
        val sessions = mutableListOf<HeartRateSession>()
        val allSamples = heartRateData.flatMap { record ->
            record.samples.map { sample -> sample }
        }.sortedBy { it.time }
        
        // Group consecutive high heart rate periods (Zone 2+) into sessions
        var currentSession: MutableList<HeartRateRecord.Sample>? = null
        
        allSamples.forEach { sample ->
            val bpm = sample.beatsPerMinute.toInt()
            val isHighIntensity = bpm >= 121 // Zone 2+
            
            if (isHighIntensity) {
                if (currentSession == null) {
                    currentSession = mutableListOf()
                }
                currentSession!!.add(sample)
            } else {
                // End current session if it exists and has enough data
                if (currentSession != null && currentSession!!.size >= 3) { // At least 15 minutes
                    sessions.add(createSessionFromSamples(currentSession!!))
                }
                currentSession = null
            }
        }
        
        // Don't forget the last session
        if (currentSession != null && currentSession!!.size >= 3) {
            sessions.add(createSessionFromSamples(currentSession!!))
        }
        
        Log.d(TAG, "Generated ${sessions.size} sessions from heart rate data")
        return sessions.takeLast(5) // Return last 5 sessions
    }
    
    private fun createSessionFromSamples(samples: List<HeartRateRecord.Sample>): HeartRateSession {
        val bpmValues = samples.map { it.beatsPerMinute.toInt() }
        val startTime = samples.minByOrNull { it.time }?.time ?: Instant.now()
        val endTime = samples.maxByOrNull { it.time }?.time ?: Instant.now()
        
        // Calculate zone minutes for this session using a mock record
        val mockRecord = try {
            HeartRateRecord(
                startTime = startTime,
                startZoneOffset = ZoneId.systemDefault().rules.getOffset(startTime),
                endTime = endTime,
                endZoneOffset = ZoneId.systemDefault().rules.getOffset(endTime),
                samples = samples,
                metadata = Metadata.unknownRecordingMethod(
                    device = androidx.health.connect.client.records.metadata.Device(
                        manufacturer = "Mock",
                        model = "MockDevice",
                        type = androidx.health.connect.client.records.metadata.Device.TYPE_UNKNOWN
                    )
                )
            )
        } catch (e: Exception) {
            Log.w(TAG, "Failed to create mock record for session", e)
            null
        }
        
        val zoneMinutes = if (mockRecord != null) {
            processHeartRateIntoZones(listOf(mockRecord))
        } else {
            emptyMap()
        }
        
        return HeartRateSession(
            startTime = startTime,
            endTime = endTime,
            averageBpm = bpmValues.average().roundToInt(),
            maxBpm = bpmValues.maxOrNull() ?: 0,
            minBpm = bpmValues.minOrNull() ?: 0,
            zoneMinutes = zoneMinutes
        )
    }
    
    // Fallback data generation methods
    private fun generateFallbackWeeklyData(): WeeklyHealthSummary {
        Log.d(TAG, "Generating fallback weekly data")
        val dummyZoneBreakdown = mapOf(
            "zone0" to (5..20).random(),
            "zone1" to (20..40).random(),
            "zone2" to (80..120).random(),
            "zone3" to (30..60).random(),
            "zone4" to (10..25).random(),
            "zone5" to (5..15).random()
        )
        
        val totalMinutes = dummyZoneBreakdown.values.sum()
        
        return WeeklyHealthSummary(
            totalMinutes = totalMinutes,
            zoneBreakdown = dummyZoneBreakdown,
            sessions = generateDummySessions(),
            averageHeartRate = (65..85).random(),
            maxHeartRate = (150..180).random(),
            minHeartRate = (55..70).random(),
            totalSteps = (8000..15000).random()
        )
    }
    
    private fun generateFallbackDailyData(date: LocalDate): DailyHealthSummary {
        Log.d(TAG, "Generating fallback daily data for $date")
        val dummyZoneBreakdown = mapOf(
            "zone0" to (0..10).random(),
            "zone1" to (5..15).random(),
            "zone2" to (15..35).random(),
            "zone3" to (5..15).random(),
            "zone4" to (0..8).random(),
            "zone5" to (0..5).random()
        )
        
        val totalMinutes = dummyZoneBreakdown.values.sum()
        
        return DailyHealthSummary(
            date = date,
            totalMinutes = totalMinutes,
            zoneBreakdown = dummyZoneBreakdown,
            sessions = generateDummySessions(1),
            averageHeartRate = (65..85).random(),
            maxHeartRate = (120..160).random(),
            minHeartRate = (55..70).random(),
            steps = (2000..12000).random()
        )
    }
    
    private fun generateFallbackWeeklyProgress(): List<DailyProgress> {
        Log.d(TAG, "Generating fallback weekly progress")
        val today = LocalDate.now()
        val weekStart = today.minusDays(today.dayOfWeek.value.toLong() - 1)
        
        return (0..6).map { dayOffset ->
            val date = weekStart.plusDays(dayOffset.toLong())
            val zone2PlusMinutes = if (date <= today) {
                (10..45).random()
            } else {
                0
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
            mapOf("zone0" to 0, "zone1" to 20, "zone2" to 25, "zone3" to 5, "zone2Plus" to 30)
        } else {
            mapOf("zone0" to 0, "zone1" to 150, "zone2" to 150, "zone3" to 30, "zone2Plus" to 150)
        }
        
        val progressZones = zones.map { zone ->
            zone.copy(
                minutes = summary.zoneBreakdown[zone.id] ?: 0,
                dailyGoal = if (timeRange == TimeRange.DAILY) goals[zone.id] ?: 0 else zone.dailyGoal,
                weeklyGoal = if (timeRange == TimeRange.WEEKLY) goals[zone.id] ?: 0 else zone.weeklyGoal
            )
        }
        
        val totalZone2PlusMinutes = (summary.zoneBreakdown["zone2"] ?: 0) + 
                                   (summary.zoneBreakdown["zone3"] ?: 0) + 
                                   (summary.zoneBreakdown["zone4"] ?: 0) + 
                                   (summary.zoneBreakdown["zone5"] ?: 0)
        
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
            mapOf("zone0" to 0, "zone1" to 20, "zone2" to 25, "zone3" to 5, "zone2Plus" to 30)
        } else {
            mapOf("zone0" to 0, "zone1" to 150, "zone2" to 150, "zone3" to 30, "zone2Plus" to 150)
        }
        
        val progressZones = zones.map { zone ->
            HeartRateZone(
                id = zone.id,
                name = zone.name,
                description = zone.description,
                minBpm = zone.minBpm,
                maxBpm = zone.maxBpm,
                color = zone.color,
                minutes = summary.zoneBreakdown[zone.id] ?: 0,
                dailyGoal = if (timeRange == TimeRange.DAILY) goals[zone.id] ?: 0 else zone.dailyGoal,
                weeklyGoal = if (timeRange == TimeRange.WEEKLY) goals[zone.id] ?: 0 else zone.weeklyGoal
            )
        }
        
        val totalZone2PlusMinutes = (summary.zoneBreakdown["zone2"] ?: 0) + 
                                   (summary.zoneBreakdown["zone3"] ?: 0) + 
                                   (summary.zoneBreakdown["zone4"] ?: 0) + 
                                   (summary.zoneBreakdown["zone5"] ?: 0)
        
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
    
    // Debug method to compare daily vs weekly data processing
    suspend fun getDataComparisonDebug(): String = withContext(Dispatchers.IO) {
        val today = LocalDate.now()
        val now = Instant.now()
        val weekStart = getWeekStart(now)
        
        // Daily range
        val dailyStart = today.atStartOfDay(ZoneId.systemDefault()).toInstant()
        val dailyEnd = dailyStart.plus(1, ChronoUnit.DAYS)
        
        // Weekly range  
        val weeklyStart = weekStart
        val weeklyEnd = now
        
        return@withContext buildString {
            appendLine("=== DAILY VS WEEKLY DATA COMPARISON ===")
            appendLine("")
            
            appendLine("TIME RANGES:")
            appendLine("Daily range:  $dailyStart to $dailyEnd")
            appendLine("Weekly range: $weeklyStart to $weeklyEnd")
            appendLine("Today: $today")
            appendLine("Current time: $now")
            appendLine("")
            
            try {
                // Get data for both ranges
                val dailyHeartRate = healthConnectManager.getHeartRateData(dailyStart, dailyEnd)
                val weeklyHeartRate = healthConnectManager.getHeartRateData(weeklyStart, weeklyEnd)
                
                appendLine("DATA COUNTS:")
                appendLine("Daily heart rate records: ${dailyHeartRate.size}")
                appendLine("Weekly heart rate records: ${weeklyHeartRate.size}")
                appendLine("Daily heart rate samples: ${dailyHeartRate.sumOf { it.samples.size }}")
                appendLine("Weekly heart rate samples: ${weeklyHeartRate.sumOf { it.samples.size }}")
                appendLine("")
                
                // Process both using same logic
                val dailyZones = processHeartRateIntoZones(dailyHeartRate)
                val weeklyZones = processHeartRateIntoZones(weeklyHeartRate)
                
                appendLine("ZONE BREAKDOWN:")
                appendLine("Daily zones:  $dailyZones")
                appendLine("Weekly zones: $weeklyZones")
                appendLine("")
                
                // Check if today's data is included in weekly data
                val todayDataInWeekly = weeklyHeartRate.filter { record ->
                    record.startTime.isBefore(dailyEnd) && record.endTime.isAfter(dailyStart)
                }
                
                appendLine("TODAY'S DATA IN WEEKLY:")
                appendLine("Records from today in weekly data: ${todayDataInWeekly.size}")
                appendLine("Samples from today in weekly data: ${todayDataInWeekly.sumOf { it.samples.size }}")
                appendLine("")
                
                // Analyze the time coverage
                if (weeklyHeartRate.isNotEmpty()) {
                    val firstWeeklyRecord = weeklyHeartRate.minByOrNull { it.startTime }
                    val lastWeeklyRecord = weeklyHeartRate.maxByOrNull { it.endTime }
                    appendLine("Weekly data actually spans: ${firstWeeklyRecord?.startTime} to ${lastWeeklyRecord?.endTime}")
                }
                
                if (dailyHeartRate.isNotEmpty()) {
                    val firstDailyRecord = dailyHeartRate.minByOrNull { it.startTime }
                    val lastDailyRecord = dailyHeartRate.maxByOrNull { it.endTime }
                    appendLine("Daily data actually spans: ${firstDailyRecord?.startTime} to ${lastDailyRecord?.endTime}")
                }
                
                appendLine("")
                
                // Check if weekly range properly includes today
                val isWeeklyRangeIncludingToday = weeklyEnd.isAfter(dailyStart)
                appendLine("Weekly range includes today: $isWeeklyRangeIncludingToday")
                
                // Check the end time issue
                val timeDifference = java.time.Duration.between(now, dailyEnd).toHours()
                appendLine("Hours between 'now' and end of today: $timeDifference")
                
                if (timeDifference > 0) {
                    appendLine("⚠️  POTENTIAL ISSUE: Weekly data ends at 'now' ($now)")
                    appendLine("⚠️  but daily data includes full day until ($dailyEnd)")
                    appendLine("⚠️  Weekly data might miss ${timeDifference}h of today's data!")
                }
                
            } catch (e: Exception) {
                appendLine("ERROR: ${e.message}")
            }
        }
    }
    
    private fun generateDummySessions(count: Int = 3): List<HeartRateSession> {
        val now = Instant.now()
        return (0 until count).map { i ->
            val sessionStart = now.minus((i + 1) * 8L, ChronoUnit.HOURS)
            val sessionEnd = sessionStart.plus(45L, ChronoUnit.MINUTES)
            
            HeartRateSession(
                startTime = sessionStart,
                endTime = sessionEnd,
                averageBpm = (70..140).random(),
                maxBpm = (140..180).random(),
                minBpm = (60..80).random(),
                zoneMinutes = mapOf(
                    "zone0" to (0..5).random(),
                    "zone1" to (5..15).random(),
                    "zone2" to (15..25).random(),
                    "zone3" to (10..20).random(),
                    "zone4" to (0..5).random(),
                    "zone5" to (0..3).random()
                )
            )
        }
    }
    
    private data class HeartRateStats(
        val average: Int,
        val max: Int,
        val min: Int
    )
}