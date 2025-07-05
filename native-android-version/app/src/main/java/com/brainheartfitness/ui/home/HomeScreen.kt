package com.brainheartfitness.ui.home

import android.content.Intent
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.brainheartfitness.R
import com.brainheartfitness.data.DataSourceType
import com.brainheartfitness.data.health.HealthConnectManager
import com.brainheartfitness.data.model.HealthConnectState
import com.brainheartfitness.data.model.TimeRange
import com.brainheartfitness.ui.components.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: HomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    
    // Get the HealthConnectManager from the ViewModel (which is injected by Hilt)
    val healthConnectManager = viewModel.getHealthConnectManager()
    
    val permissionLauncher = rememberLauncherForActivityResult(
        contract = healthConnectManager.createPermissionRequestContract()
    ) { granted ->
        if (granted.isNotEmpty()) {
            viewModel.onPermissionsGranted()
        } else {
            viewModel.onPermissionsDenied()
        }
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Header
        Text(
            text = stringResource(R.string.app_name),
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        Text(
            text = stringResource(R.string.subtitle),
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        // Data Source Toggle and Status
        DataSourceCard(
            dataSourceType = uiState.dataSourceType,
            dataSourceError = uiState.dataSourceError,
            isRealDataAvailable = uiState.isRealDataAvailable,
            onToggleDataSource = viewModel::toggleDataSource,
            onSetDataSource = viewModel::setDataSource
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Tab Bar
        TabRow(
            selectedTabIndex = if (uiState.activeTab == TimeRange.DAILY) 0 else 1
        ) {
            Tab(
                selected = uiState.activeTab == TimeRange.DAILY,
                onClick = { viewModel.setActiveTab(TimeRange.DAILY) }
            ) {
                Text(
                    text = stringResource(R.string.daily),
                    modifier = Modifier.padding(16.dp)
                )
            }
            Tab(
                selected = uiState.activeTab == TimeRange.WEEKLY,
                onClick = { viewModel.setActiveTab(TimeRange.WEEKLY) }
            ) {
                Text(
                    text = stringResource(R.string.weekly),
                    modifier = Modifier.padding(16.dp)
                )
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Main content based on state
        when (uiState.healthConnectState) {
            HealthConnectState.AVAILABLE -> {
                if (uiState.hasPermissions) {
                    // Show main content
                    if (uiState.isLoading) {
                        LoadingCard()
                    } else {
                        val error = uiState.error
                        val currentData = uiState.currentData
                        
                        if (error != null) {
                            ErrorCard(
                                message = error,
                                onRetry = { viewModel.retry() }
                            )
                        } else if (currentData != null) {
                            GoalCard(
                                currentMinutes = currentData.totalZone2PlusMinutes,
                                goalMinutes = currentData.zone2PlusGoal,
                                timeRange = uiState.activeTab
                            )
                            
                            Spacer(modifier = Modifier.height(16.dp))
                            
                            HeartRateZonesList(
                                zones = currentData.zones,
                                timeRange = uiState.activeTab
                            )
                        }
                    }
                } else {
                    // Permission request UI
                    PermissionRequestCard(
                        onRequestPermissions = {
                            permissionLauncher.launch(healthConnectManager.getRequiredPermissions())
                        }
                    )
                }
            }
            HealthConnectState.NOT_INSTALLED -> {
                DownloadHealthConnectCard()
            }
            HealthConnectState.UPDATE_REQUIRED -> {
                UpdateHealthConnectCard()
            }
            HealthConnectState.NOT_SUPPORTED -> {
                NotSupportedCard()
            }
        }
    }
}

@Composable
fun DataSourceCard(
    dataSourceType: DataSourceType,
    dataSourceError: String?,
    isRealDataAvailable: Boolean,
    onToggleDataSource: () -> Unit,
    onSetDataSource: (DataSourceType) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (dataSourceType == DataSourceType.REAL) 
                MaterialTheme.colorScheme.primaryContainer 
            else 
                MaterialTheme.colorScheme.secondaryContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Data Source",
                        style = MaterialTheme.typography.titleMedium,
                        color = if (dataSourceType == DataSourceType.REAL) 
                            MaterialTheme.colorScheme.onPrimaryContainer 
                        else 
                            MaterialTheme.colorScheme.onSecondaryContainer
                    )
                    Text(
                        text = when (dataSourceType) {
                            DataSourceType.REAL -> "Real Health Connect Data"
                            DataSourceType.MOCK -> "Mock Data (Demo)"
                        },
                        style = MaterialTheme.typography.bodyMedium,
                        color = if (dataSourceType == DataSourceType.REAL) 
                            MaterialTheme.colorScheme.onPrimaryContainer 
                        else 
                            MaterialTheme.colorScheme.onSecondaryContainer
                    )
                }
                
                Switch(
                    checked = dataSourceType == DataSourceType.REAL,
                    onCheckedChange = { isReal ->
                        onSetDataSource(if (isReal) DataSourceType.REAL else DataSourceType.MOCK)
                    }
                )
            }
            
            // Show error if real data failed
            if (dataSourceError != null && dataSourceType == DataSourceType.REAL) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "⚠️ $dataSourceError",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.error,
                    modifier = Modifier.fillMaxWidth()
                )
                Text(
                    text = "Automatically switched to mock data",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.fillMaxWidth()
                )
            }
            
            // Show real data availability status
            if (dataSourceType == DataSourceType.REAL) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = if (isRealDataAvailable) "✅ Real data available" else "📊 Checking for real data...",
                    style = MaterialTheme.typography.bodySmall,
                    color = if (dataSourceType == DataSourceType.REAL) 
                        MaterialTheme.colorScheme.onPrimaryContainer 
                    else 
                        MaterialTheme.colorScheme.onSecondaryContainer
                )
            }
        }
    }
}

@Composable
fun LoadingCard() {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(32.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                CircularProgressIndicator()
                Spacer(modifier = Modifier.height(16.dp))
                Text(text = stringResource(R.string.loading))
            }
        }
    }
}

@Composable
fun ErrorCard(
    message: String,
    onRetry: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.errorContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = stringResource(R.string.error_loading_data),
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onErrorContainer
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = message,
                color = MaterialTheme.colorScheme.onErrorContainer
            )
            Spacer(modifier = Modifier.height(16.dp))
            Button(onClick = onRetry) {
                Text(text = stringResource(R.string.retry))
            }
        }
    }
}

@Composable
fun DownloadHealthConnectCard() {
    val context = LocalContext.current
    
    InfoCard(
        title = stringResource(R.string.health_connect_not_installed),
        description = "Health Connect is required to track your fitness data. Please install it from the Play Store.",
        buttonText = stringResource(R.string.download_health_connect),
        onButtonClick = {
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse("market://details?id=com.google.android.apps.healthdata")
            }
            context.startActivity(intent)
        }
    )
}

@Composable
fun UpdateHealthConnectCard() {
    val context = LocalContext.current
    
    InfoCard(
        title = stringResource(R.string.health_connect_update_required),
        description = "Please update Health Connect to the latest version.",
        buttonText = stringResource(R.string.update_health_connect),
        onButtonClick = {
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse("market://details?id=com.google.android.apps.healthdata")
            }
            context.startActivity(intent)
        }
    )
}

@Composable
fun NotSupportedCard() {
    InfoCard(
        title = "Health Connect Not Supported",
        description = "Your device doesn't support Health Connect. This app requires Android 8.0 or higher.",
        buttonText = null,
        onButtonClick = { }
    )
}

@Composable
fun InfoCard(
    title: String,
    description: String,
    buttonText: String?,
    onButtonClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = description,
                textAlign = TextAlign.Center
            )
            if (buttonText != null) {
                Spacer(modifier = Modifier.height(16.dp))
                Button(onClick = onButtonClick) {
                    Text(text = buttonText)
                }
            }
        }
    }
}