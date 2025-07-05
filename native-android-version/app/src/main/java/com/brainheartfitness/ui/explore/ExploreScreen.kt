package com.brainheartfitness.ui.explore

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.brainheartfitness.data.model.DailyHealthSummary
import com.brainheartfitness.data.model.HeartRateSession
import com.brainheartfitness.data.model.WeeklyHealthSummary
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExploreScreen(
    viewModel: ExploreViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Raw Activity Data",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            
            IconButton(onClick = { viewModel.refresh() }) {
                Text("🔄")
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Data status indicator
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.errorContainer
            )
        ) {
            Text(
                text = "⚠️ Currently showing MOCK DATA - Not connected to real API",
                modifier = Modifier.padding(16.dp),
                color = MaterialTheme.colorScheme.onErrorContainer,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        when {
            uiState.isLoading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            
            uiState.error != null -> {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "Error: ${uiState.error}",
                        color = MaterialTheme.colorScheme.error
                    )
                    Button(
                        onClick = { viewModel.refresh() },
                        modifier = Modifier.padding(top = 8.dp)
                    ) {
                        Text("Retry")
                    }
                }
            }
            
            else -> {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Weekly Data
                    item {
                        WeeklyDataCard(uiState.weeklyData)
                    }
                    
                    // Daily Data
                    item {
                        DailyDataCard(uiState.dailyData)
                    }
                    
                    // Heart Rate Sessions
                    item {
                        SessionsCard(uiState.weeklyData?.sessions ?: emptyList())
                    }
                }
            }
        }
    }
}

@Composable
fun WeeklyDataCard(weeklyData: WeeklyHealthSummary?) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Weekly Summary",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            if (weeklyData != null) {
                DataRow("Total Active Minutes", "${weeklyData.totalMinutes} min")
                DataRow("Average Heart Rate", "${weeklyData.averageHeartRate} bpm")
                DataRow("Max Heart Rate", "${weeklyData.maxHeartRate} bpm")
                DataRow("Min Heart Rate", "${weeklyData.minHeartRate} bpm")
                DataRow("Total Steps", "${weeklyData.totalSteps}")
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Text(
                    text = "Zone Breakdown:",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                
                weeklyData.zoneBreakdown.forEach { (zone, minutes) ->
                    DataRow("  $zone", "$minutes min")
                }
            } else {
                Text("No weekly data available")
            }
        }
    }
}

@Composable
fun DailyDataCard(dailyData: DailyHealthSummary?) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Today's Summary",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            if (dailyData != null) {
                DataRow("Date", dailyData.date.toString())
                DataRow("Total Active Minutes", "${dailyData.totalMinutes} min")
                DataRow("Average Heart Rate", "${dailyData.averageHeartRate} bpm")
                DataRow("Max Heart Rate", "${dailyData.maxHeartRate} bpm")
                DataRow("Min Heart Rate", "${dailyData.minHeartRate} bpm")
                DataRow("Steps", "${dailyData.steps}")
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Text(
                    text = "Zone Breakdown:",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                
                dailyData.zoneBreakdown.forEach { (zone, minutes) ->
                    DataRow("  $zone", "$minutes min")
                }
            } else {
                Text("No daily data available")
            }
        }
    }
}

@Composable
fun SessionsCard(sessions: List<HeartRateSession>) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Heart Rate Sessions (${sessions.size})",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            if (sessions.isEmpty()) {
                Text("No sessions recorded")
            } else {
                sessions.forEachIndexed { index, session ->
                    SessionItem(session, index + 1)
                    if (index < sessions.size - 1) {
                        Spacer(modifier = Modifier.height(8.dp))
                        HorizontalDivider()
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun SessionItem(session: HeartRateSession, sessionNumber: Int) {
    Column {
        Text(
            text = "Session $sessionNumber",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        
        val startTime = session.startTime.atZone(java.time.ZoneId.systemDefault())
        val endTime = session.endTime.atZone(java.time.ZoneId.systemDefault())
        val duration = java.time.Duration.between(session.startTime, session.endTime)
        
        DataRow("Start Time", startTime.format(DateTimeFormatter.ofLocalizedDateTime(FormatStyle.SHORT)))
        DataRow("End Time", endTime.format(DateTimeFormatter.ofLocalizedDateTime(FormatStyle.SHORT)))
        DataRow("Duration", "${duration.toMinutes()} minutes")
        DataRow("Average BPM", "${session.averageBpm}")
        DataRow("Max BPM", "${session.maxBpm}")
        DataRow("Min BPM", "${session.minBpm}")
        
        Text(
            text = "Zone Minutes:",
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Bold
        )
        
        session.zoneMinutes.forEach { (zone, minutes) ->
            DataRow("  $zone", "$minutes min")
        }
    }
}

@Composable
fun DataRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            modifier = Modifier.weight(1f)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium
        )
    }
}