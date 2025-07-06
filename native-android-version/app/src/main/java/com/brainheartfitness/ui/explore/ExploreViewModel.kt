package com.brainheartfitness.ui.explore

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.brainheartfitness.data.model.DailyHealthSummary
import com.brainheartfitness.data.model.WeeklyHealthSummary
import com.brainheartfitness.data.repository.HealthDataRepository
import com.brainheartfitness.data.health.HealthConnectManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.Instant
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import javax.inject.Inject

@HiltViewModel
class ExploreViewModel @Inject constructor(
    private val healthDataRepository: HealthDataRepository,
    private val healthConnectManager: HealthConnectManager
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(ExploreUiState())
    val uiState: StateFlow<ExploreUiState> = _uiState.asStateFlow()
    
    init {
        loadRawData()
    }
    
    private fun loadRawData() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            try {
                val weeklyData = healthDataRepository.getWeeklyHealthSummary()
                val dailyData = healthDataRepository.getDailyHealthSummary(LocalDate.now())
                
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    weeklyData = weeklyData,
                    dailyData = dailyData,
                    error = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }
    
    fun refresh() {
        loadRawData()
    }
    
    fun getRawDataDebugInfo(startDate: LocalDate? = null, endDate: LocalDate? = null) {
        viewModelScope.launch {
            loadRawDataDebugInfo(startDate, endDate)
        }
    }
    
    fun getDataComparisonDebug() {
        viewModelScope.launch {
            try {
                val comparisonInfo = healthDataRepository.getDataComparisonDebug()
                _uiState.value = _uiState.value.copy(rawDataDebugInfo = comparisonInfo)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(rawDataDebugInfo = "Error loading comparison debug info: ${e.message}")
            }
        }
    }
    
    private suspend fun loadRawDataDebugInfo(startDate: LocalDate?, endDate: LocalDate?) {
        try {
            // Default to weekly time range if no dates provided
            val now = Instant.now()
            val defaultStartDate = getWeekStart(now)
            val defaultEndDate = now
            
            val actualStartDate = startDate?.atStartOfDay(ZoneId.systemDefault())?.toInstant() ?: defaultStartDate
            val actualEndDate = endDate?.atStartOfDay(ZoneId.systemDefault())?.toInstant()?.plus(1, ChronoUnit.DAYS) ?: defaultEndDate
            
            val heartRateData = healthConnectManager.getHeartRateData(actualStartDate, actualEndDate)
            val stepsData = healthConnectManager.getStepsData(actualStartDate, actualEndDate)
            
            val debugInfo = buildString {
                appendLine("=== RAW HEALTH CONNECT DATA ===")
                appendLine("Query Time Range:")
                appendLine("  Start: $actualStartDate")
                appendLine("  End: $actualEndDate")
                appendLine("  Duration: ${java.time.Duration.between(actualStartDate, actualEndDate).toDays()} days")
                appendLine("")
                
                // Add time range comparison
                appendLine("=== TIME RANGE COMPARISON ===")
                val weeklyStart = getWeekStart(now)
                val dailyStart = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()
                val dailyEnd = dailyStart.plus(1, ChronoUnit.DAYS)
                
                appendLine("Weekly view range: $weeklyStart to $now")
                appendLine("Today's range: $dailyStart to $dailyEnd")
                appendLine("Current time: $now")
                appendLine("")
                
                appendLine("HEART RATE DATA (${heartRateData.size} records):")
                heartRateData.take(10).forEachIndexed { index, record ->
                    appendLine("Record ${index + 1}:")
                    appendLine("  Start: ${record.startTime}")
                    appendLine("  End: ${record.endTime}")
                    appendLine("  Samples: ${record.samples.size}")
                    
                    // Show more detailed sample data
                    record.samples.take(10).forEachIndexed { sampleIndex, sample ->
                        appendLine("    Sample ${sampleIndex + 1}: ${sample.beatsPerMinute} BPM at ${sample.time}")
                    }
                    if (record.samples.size > 10) {
                        appendLine("    ... and ${record.samples.size - 10} more samples")
                    }
                    
                    // Calculate zone distribution for this record
                    val recordZones = mutableMapOf<String, Int>()
                    record.samples.forEach { sample ->
                        val bpm = sample.beatsPerMinute.toInt()
                        val zoneId = when {
                            bpm <= 94 -> "zone0"
                            bpm <= 120 -> "zone1"
                            bpm <= 140 -> "zone2"
                            bpm <= 160 -> "zone3"
                            bpm <= 180 -> "zone4"
                            else -> "zone5"
                        }
                        recordZones[zoneId] = (recordZones[zoneId] ?: 0) + 1
                    }
                    appendLine("  Zone distribution (sample count): $recordZones")
                    appendLine("")
                }
                if (heartRateData.size > 10) {
                    appendLine("... and ${heartRateData.size - 10} more records")
                }
                
                appendLine("")
                appendLine("STEPS DATA (${stepsData.size} records):")
                stepsData.take(5).forEachIndexed { index, record ->
                    appendLine("Record ${index + 1}:")
                    appendLine("  Start: ${record.startTime}")
                    appendLine("  End: ${record.endTime}")
                    appendLine("  Count: ${record.count}")
                    appendLine("")
                }
                if (stepsData.size > 5) {
                    appendLine("... and ${stepsData.size - 5} more records")
                }
                
                appendLine("")
                appendLine("=== AGGREGATED ANALYSIS ===")
                appendLine("Total Heart Rate Records: ${heartRateData.size}")
                appendLine("Total Heart Rate Samples: ${heartRateData.sumOf { it.samples.size }}")
                appendLine("Total Steps Records: ${stepsData.size}")
                appendLine("Total Steps: ${stepsData.sumOf { it.count }}")
                
                val allBpm = heartRateData.flatMap { record ->
                    record.samples.map { it.beatsPerMinute.toInt() }
                }
                if (allBpm.isNotEmpty()) {
                    appendLine("Heart Rate Range: ${allBpm.minOrNull()} - ${allBpm.maxOrNull()} BPM")
                    appendLine("Average Heart Rate: ${allBpm.average().toInt()} BPM")
                    
                    // Zone analysis
                    val zoneCount = mutableMapOf<String, Int>()
                    allBpm.forEach { bpm ->
                        val zoneId = when {
                            bpm <= 94 -> "zone0"
                            bpm <= 120 -> "zone1"
                            bpm <= 140 -> "zone2"
                            bpm <= 160 -> "zone3"
                            bpm <= 180 -> "zone4"
                            else -> "zone5"
                        }
                        zoneCount[zoneId] = (zoneCount[zoneId] ?: 0) + 1
                    }
                    appendLine("")
                    appendLine("BPM Distribution by Zone:")
                    zoneCount.forEach { (zone, count) ->
                        val percentage = (count * 100.0 / allBpm.size).let { "%.1f".format(it) }
                        appendLine("  $zone: $count samples ($percentage%)")
                    }
                }
                
                // Time range data analysis
                appendLine("")
                appendLine("=== TIME RANGE DATA ANALYSIS ===")
                if (heartRateData.isNotEmpty()) {
                    val firstSample = heartRateData.minByOrNull { it.startTime }?.startTime
                    val lastSample = heartRateData.maxByOrNull { it.endTime }?.endTime
                    appendLine("Data actually spans: $firstSample to $lastSample")
                    
                    // Check if today is included
                    val todayStart = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()
                    val todayEnd = todayStart.plus(1, ChronoUnit.DAYS)
                    val todayData = heartRateData.filter { record ->
                        record.startTime.isBefore(todayEnd) && record.endTime.isAfter(todayStart)
                    }
                    appendLine("Records from today: ${todayData.size}")
                    appendLine("Today samples: ${todayData.sumOf { it.samples.size }}")
                }
            }
            
            _uiState.value = _uiState.value.copy(rawDataDebugInfo = debugInfo)
        } catch (e: Exception) {
            _uiState.value = _uiState.value.copy(rawDataDebugInfo = "Error loading debug info: ${e.message}")
        }
    }
    
    private fun getWeekStart(timestamp: Instant): Instant {
        val date = timestamp.atZone(ZoneId.systemDefault()).toLocalDate()
        val weekStart = date.minusDays(date.dayOfWeek.value.toLong() - 1)
        return weekStart.atStartOfDay(ZoneId.systemDefault()).toInstant()
    }
}

data class ExploreUiState(
    val isLoading: Boolean = false,
    val weeklyData: WeeklyHealthSummary? = null,
    val dailyData: DailyHealthSummary? = null,
    val error: String? = null,
    val rawDataDebugInfo: String? = null
)