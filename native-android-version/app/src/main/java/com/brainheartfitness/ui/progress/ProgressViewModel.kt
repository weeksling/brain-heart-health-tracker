package com.brainheartfitness.ui.progress

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.brainheartfitness.data.model.DailyProgress
import com.brainheartfitness.data.repository.HealthDataRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProgressUiState(
    val isLoading: Boolean = true,
    val weeklyProgress: List<DailyProgress> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class ProgressViewModel @Inject constructor(
    private val healthDataRepository: HealthDataRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(ProgressUiState())
    val uiState: StateFlow<ProgressUiState> = _uiState.asStateFlow()
    
    init {
        loadProgress()
    }
    
    fun loadProgress() {
        viewModelScope.launch {
            try {
                _uiState.value = _uiState.value.copy(isLoading = true, error = null)
                
                val weeklyProgress = healthDataRepository.getWeeklyProgress()
                
                _uiState.value = _uiState.value.copy(
                    weeklyProgress = weeklyProgress,
                    isLoading = false,
                    error = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message ?: "Failed to load progress data",
                    isLoading = false
                )
            }
        }
    }
}