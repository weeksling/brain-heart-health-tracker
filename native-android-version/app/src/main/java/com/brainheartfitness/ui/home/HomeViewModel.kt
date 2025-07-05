package com.brainheartfitness.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.brainheartfitness.data.health.HealthConnectManager
import com.brainheartfitness.data.model.*
import com.brainheartfitness.data.repository.HealthDataRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

data class HomeUiState(
    val activeTab: TimeRange = TimeRange.DAILY,
    val healthConnectState: HealthConnectState = HealthConnectState.NOT_SUPPORTED,
    val hasPermissions: Boolean = false,
    val isLoading: Boolean = true,
    val currentData: ProgressData? = null,
    val error: String? = null
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val healthDataRepository: HealthDataRepository,
    private val healthConnectManager: HealthConnectManager
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()
    
    init {
        checkHealthConnectAvailability()
    }
    
    fun setActiveTab(timeRange: TimeRange) {
        _uiState.value = _uiState.value.copy(activeTab = timeRange)
        when (timeRange) {
            TimeRange.DAILY -> loadDailyData()
            TimeRange.WEEKLY -> loadWeeklyData()
        }
    }
    
    fun onPermissionsGranted() {
        _uiState.value = _uiState.value.copy(hasPermissions = true)
        loadWeeklyData() // Load initial data
    }
    
    fun onPermissionsDenied() {
        _uiState.value = _uiState.value.copy(hasPermissions = false)
    }
    
    fun retry() {
        checkHealthConnectAvailability()
    }
    
    private fun checkHealthConnectAvailability() {
        viewModelScope.launch {
            try {
                val availability = healthConnectManager.checkAvailability()
                _uiState.value = _uiState.value.copy(
                    healthConnectState = availability,
                    isLoading = false
                )
                
                if (availability == HealthConnectState.AVAILABLE) {
                    checkPermissions()
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message,
                    isLoading = false
                )
            }
        }
    }
    
    private suspend fun checkPermissions() {
        try {
            val hasPermissions = healthConnectManager.hasAllPermissions()
            _uiState.value = _uiState.value.copy(hasPermissions = hasPermissions)
            
            if (hasPermissions) {
                loadWeeklyData() // Load initial data
            }
        } catch (e: Exception) {
            _uiState.value = _uiState.value.copy(
                error = e.message,
                isLoading = false
            )
        }
    }
    
    private fun loadWeeklyData() {
        viewModelScope.launch {
            try {
                _uiState.value = _uiState.value.copy(isLoading = true, error = null)
                
                val weeklyData = healthDataRepository.getWeeklyHealthSummary()
                val progressData = healthDataRepository.convertToProgressData(weeklyData, TimeRange.WEEKLY)
                
                _uiState.value = _uiState.value.copy(
                    currentData = progressData,
                    isLoading = false,
                    error = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message ?: "Failed to load weekly data",
                    isLoading = false
                )
            }
        }
    }
    
    private fun loadDailyData() {
        viewModelScope.launch {
            try {
                _uiState.value = _uiState.value.copy(isLoading = true, error = null)
                
                val today = LocalDate.now()
                val dailyData = healthDataRepository.getDailyHealthSummary(today)
                val progressData = healthDataRepository.convertToProgressData(dailyData, TimeRange.DAILY)
                
                _uiState.value = _uiState.value.copy(
                    currentData = progressData,
                    isLoading = false,
                    error = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message ?: "Failed to load daily data",
                    isLoading = false
                )
            }
        }
    }
}