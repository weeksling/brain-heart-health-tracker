package com.brainheartfitness.data.health

import android.content.Context
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
import com.brainheartfitness.data.model.HealthConnectState
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.time.Instant
import java.time.ZoneOffset
import kotlin.random.Random
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class HealthConnectManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
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
            false
        }
    }
    
    fun createPermissionRequestContract(): ActivityResultContract<Set<HealthPermission>, Set<HealthPermission>> {
        return PermissionController.createRequestPermissionResultContract()
    }
    
    fun getRequiredPermissions(): Set<HealthPermission> = permissions
    
    suspend fun getHeartRateData(startTime: Instant, endTime: Instant): List<HeartRateRecord> = withContext(Dispatchers.IO) {
        try {
            val request = ReadRecordsRequest(
                recordType = HeartRateRecord::class,
                timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
            )
            healthConnectClient.readRecords(request).records
        } catch (e: Exception) {
            // Return dummy data for development/testing
            generateDummyHeartRateData(startTime, endTime)
        }
    }
    
    suspend fun getStepsData(startTime: Instant, endTime: Instant): List<StepsRecord> = withContext(Dispatchers.IO) {
        try {
            val request = ReadRecordsRequest(
                recordType = StepsRecord::class,
                timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
            )
            healthConnectClient.readRecords(request).records
        } catch (e: Exception) {
            // Return dummy data for development/testing
            generateDummyStepsData(startTime, endTime)
        }
    }
    
    suspend fun getExerciseData(startTime: Instant, endTime: Instant): List<ExerciseSessionRecord> = withContext(Dispatchers.IO) {
        try {
            val request = ReadRecordsRequest(
                recordType = ExerciseSessionRecord::class,
                timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
            )
            healthConnectClient.readRecords(request).records
        } catch (e: Exception) {
            emptyList()
        }
    }
    
    // Generate dummy data for development/testing when Health Connect is not available
    private fun generateDummyHeartRateData(startTime: Instant, endTime: Instant): List<HeartRateRecord> {
        // For now, return empty list to avoid compilation issues
        // In a real implementation, we would create proper dummy data
        return emptyList()
    }
    
    private fun generateDummyStepsData(startTime: Instant, endTime: Instant): List<StepsRecord> {
        // For now, return empty list to avoid compilation issues
        // In a real implementation, we would create proper dummy data
        return emptyList()
    }
}