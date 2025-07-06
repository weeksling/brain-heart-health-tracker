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
    
    fun getRawDataDebugInfo() {
        viewModelScope.launch {
            loadRawDataDebugInfo()
        }
    }
    
    private suspend fun loadRawDataDebugInfo() {
        try {
            val now = Instant.now()
            val weekStart = now.minus(7, ChronoUnit.DAYS)
            
            val heartRateData = healthConnectManager.getHeartRateData(weekStart, now)
            val stepsData = healthConnectManager.getStepsData(weekStart, now)
            
            val debugInfo = buildString {
                appendLine("=== RAW HEALTH CONNECT DATA ===")
                appendLine("Time Range: $weekStart to $now")
                appendLine("")
                
                appendLine("HEART RATE DATA (${heartRateData.size} records):")
                heartRateData.take(10).forEachIndexed { index, record ->
                    appendLine("Record ${index + 1}:")
                    appendLine("  Start: ${record.startTime}")
                    appendLine("  End: ${record.endTime}")
                    appendLine("  Samples: ${record.samples.size}")
                    record.samples.take(5).forEachIndexed { sampleIndex, sample ->
                        appendLine("    Sample ${sampleIndex + 1}: ${sample.beatsPerMinute} BPM at ${sample.time}")
                    }
                    if (record.samples.size > 5) {
                        appendLine("    ... and ${record.samples.size - 5} more samples")
                    }
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
                appendLine("SUMMARY:")
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
                }
            }
            
            _uiState.value = _uiState.value.copy(rawDataDebugInfo = debugInfo)
        } catch (e: Exception) {
            _uiState.value = _uiState.value.copy(rawDataDebugInfo = "Error loading debug info: ${e.message}")
        }
    }
}

data class ExploreUiState(
    val isLoading: Boolean = false,
    val weeklyData: WeeklyHealthSummary? = null,
    val dailyData: DailyHealthSummary? = null,
    val error: String? = null,
    val rawDataDebugInfo: String? = null
)