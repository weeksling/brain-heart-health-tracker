package com.brainheartfitness.data

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

enum class DataSourceType {
    REAL, MOCK
}

data class DataSourceState(
    val currentSource: DataSourceType = DataSourceType.REAL,
    val lastError: String? = null,
    val isRealDataAvailable: Boolean = false
)

class DataSourceManager(
    private val context: Context
) {
    companion object {
        private const val PREF_NAME = "data_source_prefs"
        private const val KEY_DATA_SOURCE = "data_source_type"
        private const val TAG = "DataSourceManager"
    }
    
    private val preferences: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    
    private val _dataSourceState = MutableStateFlow(DataSourceState())
    val dataSourceState: StateFlow<DataSourceState> = _dataSourceState.asStateFlow()
    
    init {
        loadSavedDataSource()
    }
    
    private fun loadSavedDataSource() {
        val savedSource = preferences.getString(KEY_DATA_SOURCE, DataSourceType.REAL.name)
        val dataSource = try {
            DataSourceType.valueOf(savedSource ?: DataSourceType.REAL.name)
        } catch (e: IllegalArgumentException) {
            DataSourceType.REAL
        }
        
        _dataSourceState.value = _dataSourceState.value.copy(currentSource = dataSource)
        Log.d(TAG, "Loaded data source: $dataSource")
    }
    
    fun setDataSource(source: DataSourceType) {
        _dataSourceState.value = _dataSourceState.value.copy(
            currentSource = source,
            lastError = null
        )
        
        preferences.edit()
            .putString(KEY_DATA_SOURCE, source.name)
            .apply()
        
        Log.d(TAG, "Data source changed to: $source")
    }
    
    fun reportRealDataError(error: String) {
        Log.w(TAG, "Real data error: $error")
        _dataSourceState.value = _dataSourceState.value.copy(
            lastError = error,
            isRealDataAvailable = false
        )
        
        // Auto-fallback to mock data if real data fails
        if (_dataSourceState.value.currentSource == DataSourceType.REAL) {
            Log.i(TAG, "Auto-falling back to mock data due to error")
            setDataSource(DataSourceType.MOCK)
        }
    }
    
    fun reportRealDataSuccess() {
        Log.d(TAG, "Real data successfully retrieved")
        _dataSourceState.value = _dataSourceState.value.copy(
            isRealDataAvailable = true,
            lastError = null
        )
    }
    
    fun getCurrentSource(): DataSourceType = _dataSourceState.value.currentSource
    
    fun isUsingRealData(): Boolean = _dataSourceState.value.currentSource == DataSourceType.REAL
    
    fun getLastError(): String? = _dataSourceState.value.lastError
}