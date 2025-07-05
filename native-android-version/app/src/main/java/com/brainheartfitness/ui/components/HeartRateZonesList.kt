package com.brainheartfitness.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.brainheartfitness.R
import com.brainheartfitness.data.model.HeartRateZone
import com.brainheartfitness.data.model.TimeRange
import kotlin.math.min

@Composable
fun HeartRateZonesList(
    zones: List<HeartRateZone>,
    timeRange: TimeRange,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier) {
        Text(
            text = "Heart Rate Zones",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 12.dp)
        )
        
        zones.forEach { zone ->
            HeartRateZoneCard(
                zone = zone,
                timeRange = timeRange,
                modifier = Modifier.padding(bottom = 8.dp)
            )
        }
    }
}

@Composable
fun HeartRateZoneCard(
    zone: HeartRateZone,
    timeRange: TimeRange,
    modifier: Modifier = Modifier
) {
    val goal = if (timeRange == TimeRange.DAILY) zone.dailyGoal else zone.weeklyGoal
    val progressPercentage = if (goal > 0) {
        min((zone.minutes.toFloat() / goal) * 100f, 100f)
    } else 0f
    
    Card(
        modifier = modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = zone.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = zone.description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${zone.minBpm}-${if (zone.maxBpm == 999) "220" else zone.maxBpm} BPM",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Column(
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        text = "${zone.minutes}",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        color = zone.color
                    )
                    Text(
                        text = stringResource(R.string.minutes_abbrev),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            
            if (goal > 0) {
                Spacer(modifier = Modifier.height(12.dp))
                
                LinearProgressIndicator(
                    progress = { progressPercentage / 100f },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp),
                    color = zone.color,
                    trackColor = zone.color.copy(alpha = 0.2f)
                )
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Text(
                    text = "Goal: $goal ${stringResource(R.string.minutes_abbrev)}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}