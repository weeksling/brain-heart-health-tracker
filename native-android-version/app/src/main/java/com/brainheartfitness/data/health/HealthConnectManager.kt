package com.brainheartfitness.data.health

import android.content.Context
import android.util.Log
import androidx.activity.result.contract.ActivityResultContract
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.TotalCaloriesBurnedRecord
import androidx.health.connect.client.records.metadata.Metadata
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.brainheartfitness.data.DataSourceManager
import com.brainheartfitness.data.DataSourceType
import com.brainheartfitness.data.model.HealthConnectState
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.time.Instant
import java.time.LocalTime
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import kotlin.random.Random
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class HealthConnectManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dataSourceManager: DataSourceManager
) {
    companion object {
        private const val TAG = "HealthConnectManager"
    }
    
    private val healthConnectClient = HealthConnectClient.getOrCreate(context)
    
    private val permissions = setOf(
        HealthPermission.getReadPermission(HeartRateRecord::class),
        HealthPermission.getReadPermission(StepsRecord::class),
        HealthPermission.getReadPermission(ExerciseSessionRecord::class),
        HealthPermission.getReadPermission(TotalCaloriesBurnedRecord::class)
    )
    
    suspend fun checkAvailability(): HealthConnectState = withContext(Dispatchers.IO) {
        when (HealthConnectClient.getSdkStatus(context)) {
            HealthConnectClient.SDK_AVAILABLE -> HealthConnectState.AVAILABLE
            HealthConnectClient.SDK_UNAVAILABLE -> HealthConnectState.NOT_INSTALLED
            HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> HealthConnectState.UPDATE_REQUIRED
            else -> HealthConnectState.NOT_SUPPORTED
        }
    }
    
    suspend fun hasAllPermissions(): Boolean = withContext(Dispatchers.IO) {
        try {
            val grantedPermissions = healthConnectClient.permissionController.getGrantedPermissions()
            grantedPermissions.containsAll(permissions)
        } catch (e: Exception) {
            Log.e(TAG, "Error checking permissions", e)
            false
        }
    }
    
    fun createPermissionRequestContract() = PermissionController.createRequestPermissionResultContract()
    
    fun getRequiredPermissions() = permissions
    
    suspend fun getHeartRateData(startTime: Instant, endTime: Instant): List<HeartRateRecord> = withContext(Dispatchers.IO) {
        if (dataSourceManager.isUsingRealData()) {
            try {
                Log.d(TAG, "Attempting to fetch real heart rate data from $startTime to $endTime")
                val request = ReadRecordsRequest(
                    recordType = HeartRateRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
                )
                val response = healthConnectClient.readRecords(request)
                
                if (response.records.isNotEmpty()) {
                    dataSourceManager.reportRealDataSuccess()
                    Log.d(TAG, "Successfully retrieved ${response.records.size} heart rate records")
                    return@withContext response.records
                } else {
                    Log.i(TAG, "No real heart rate data found, using mock data")
                    dataSourceManager.reportRealDataError("No heart rate data found in Health Connect")
                    return@withContext generateDummyHeartRateData(startTime, endTime)
                }
            } catch (e: Exception) {
                Log.w(TAG, "Failed to fetch real heart rate data", e)
                dataSourceManager.reportRealDataError("Health Connect error: ${e.message}")
                return@withContext generateDummyHeartRateData(startTime, endTime)
            }
        } else {
            Log.d(TAG, "Using mock heart rate data")
            return@withContext generateDummyHeartRateData(startTime, endTime)
        }
    }
    
    suspend fun getStepsData(startTime: Instant, endTime: Instant): List<StepsRecord> = withContext(Dispatchers.IO) {
        if (dataSourceManager.isUsingRealData()) {
            try {
                Log.d(TAG, "Attempting to fetch real steps data from $startTime to $endTime")
                val request = ReadRecordsRequest(
                    recordType = StepsRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
                )
                val response = healthConnectClient.readRecords(request)
                
                if (response.records.isNotEmpty()) {
                    dataSourceManager.reportRealDataSuccess()
                    Log.d(TAG, "Successfully retrieved ${response.records.size} steps records")
                    return@withContext response.records
                } else {
                    Log.i(TAG, "No real steps data found, using mock data")
                    dataSourceManager.reportRealDataError("No steps data found in Health Connect")
                    return@withContext generateDummyStepsData(startTime, endTime)
                }
            } catch (e: Exception) {
                Log.w(TAG, "Failed to fetch real steps data", e)
                dataSourceManager.reportRealDataError("Health Connect error: ${e.message}")
                return@withContext generateDummyStepsData(startTime, endTime)
            }
        } else {
            Log.d(TAG, "Using mock steps data")
            return@withContext generateDummyStepsData(startTime, endTime)
        }
    }
    
    suspend fun getExerciseData(startTime: Instant, endTime: Instant): List<ExerciseSessionRecord> = withContext(Dispatchers.IO) {
        if (dataSourceManager.isUsingRealData()) {
            try {
                Log.d(TAG, "Attempting to fetch real exercise data from $startTime to $endTime")
                val request = ReadRecordsRequest(
                    recordType = ExerciseSessionRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
                )
                val response = healthConnectClient.readRecords(request)
                
                if (response.records.isNotEmpty()) {
                    dataSourceManager.reportRealDataSuccess()
                    Log.d(TAG, "Successfully retrieved ${response.records.size} exercise records")
                    return@withContext response.records
                } else {
                    Log.i(TAG, "No real exercise data found")
                    return@withContext emptyList()
                }
            } catch (e: Exception) {
                Log.w(TAG, "Failed to fetch real exercise data", e)
                dataSourceManager.reportRealDataError("Health Connect error: ${e.message}")
                return@withContext emptyList()
            }
        } else {
            Log.d(TAG, "Using mock exercise data (empty)")
            return@withContext emptyList()
        }
    }
    
    // Generate realistic dummy heart rate data based on time of day
    private fun generateDummyHeartRateData(startTime: Instant, endTime: Instant): List<HeartRateRecord> {
        val data = mutableListOf<HeartRateRecord>()
        val duration = ChronoUnit.HOURS.between(startTime, endTime)
        
        // Generate data points every 5 minutes for realistic simulation
        val intervalMinutes = 5L
        val totalIntervals = (duration * 60 / intervalMinutes).toInt()
        
        val samples = mutableListOf<HeartRateRecord.Sample>()
        
        for (i in 0 until totalIntervals) {
            val timestamp = startTime.plus(i * intervalMinutes, ChronoUnit.MINUTES)
            val localTime = timestamp.atZone(ZoneId.systemDefault()).toLocalTime()
            
            // Generate realistic heart rate based on time of day
            val baseHeartRate = when (localTime.hour) {
                in 0..5 -> Random.nextInt(60, 75)  // Sleep/rest - Zone 1
                in 6..8 -> Random.nextInt(120, 160) // Morning exercise - Zone 2-3
                in 9..11 -> Random.nextInt(80, 100) // Morning activity - Zone 1-2
                in 12..13 -> Random.nextInt(90, 110) // Lunch activity - Zone 1-2
                in 14..16 -> Random.nextInt(75, 95) // Afternoon rest - Zone 1
                in 17..19 -> Random.nextInt(140, 170) // Evening workout - Zone 3-4
                in 20..21 -> Random.nextInt(85, 105) // Evening activity - Zone 1-2
                else -> Random.nextInt(65, 85) // Night rest - Zone 1
            }
            
            // Add some natural variation
            val heartRate = (baseHeartRate + Random.nextInt(-5, 6)).coerceIn(50, 200)
            
            try {
                val sample = HeartRateRecord.Sample(
                    time = timestamp,
                    beatsPerMinute = heartRate.toLong()
                )
                samples.add(sample)
            } catch (e: Exception) {
                Log.w(TAG, "Failed to create heart rate sample for timestamp $timestamp", e)
            }
        }
        
        // Create a single HeartRateRecord with all samples
        if (samples.isNotEmpty()) {
            try {
                val record = HeartRateRecord(
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
                data.add(record)
            } catch (e: Exception) {
                Log.w(TAG, "Failed to create heart rate record", e)
            }
        }
        
        Log.d(TAG, "Generated ${data.size} dummy heart rate records with ${samples.size} samples")
        return data
    }
    
    private fun generateDummyStepsData(startTime: Instant, endTime: Instant): List<StepsRecord> {
        val data = mutableListOf<StepsRecord>()
        val duration = ChronoUnit.HOURS.between(startTime, endTime)
        
        // Generate hourly step data
        for (i in 0 until duration.toInt()) {
            val timestamp = startTime.plus(i.toLong(), ChronoUnit.HOURS)
            val localTime = timestamp.atZone(ZoneId.systemDefault()).toLocalTime()
            
            // Generate realistic steps based on time of day
            val steps = when (localTime.hour) {
                in 0..5 -> Random.nextInt(0, 50)      // Sleep
                in 6..8 -> Random.nextInt(800, 1500)  // Morning exercise
                in 9..11 -> Random.nextInt(300, 800)  // Morning activity
                in 12..13 -> Random.nextInt(400, 900) // Lunch walk
                in 14..16 -> Random.nextInt(200, 600) // Afternoon
                in 17..19 -> Random.nextInt(1000, 2000) // Evening workout
                in 20..21 -> Random.nextInt(200, 500) // Evening activity
                else -> Random.nextInt(0, 100)       // Night
            }
            
            try {
                val endTime = timestamp.plus(1, ChronoUnit.HOURS)
                val record = StepsRecord(
                    count = steps.toLong(),
                    startTime = timestamp,
                    startZoneOffset = ZoneId.systemDefault().rules.getOffset(timestamp),
                    endTime = endTime,
                    endZoneOffset = ZoneId.systemDefault().rules.getOffset(endTime),
                    metadata = Metadata.unknownRecordingMethod(
                        device = androidx.health.connect.client.records.metadata.Device(
                            manufacturer = "Mock",
                            model = "MockDevice",
                            type = androidx.health.connect.client.records.metadata.Device.TYPE_UNKNOWN
                        )
                    )
                )
                data.add(record)
            } catch (e: Exception) {
                Log.w(TAG, "Failed to create steps record for timestamp $timestamp", e)
            }
        }
        
        Log.d(TAG, "Generated ${data.size} dummy steps records")
        return data
    }
}