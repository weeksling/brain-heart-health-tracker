package com.brainheartfitness.ui.explore

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.brainheartfitness.data.model.DailyHealthSummary
import com.brainheartfitness.data.model.WeeklyHealthSummary
import com.brainheartfitness.data.repository.HealthDataRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

@HiltViewModel
class ExploreViewModel @Inject constructor(
    private val healthDataRepository: HealthDataRepository
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
}

data class ExploreUiState(
    val isLoading: Boolean = false,
    val weeklyData: WeeklyHealthSummary? = null,
    val dailyData: DailyHealthSummary? = null,
    val error: String? = null
)