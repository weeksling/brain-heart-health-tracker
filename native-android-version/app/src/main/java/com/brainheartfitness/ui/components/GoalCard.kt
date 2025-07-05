package com.brainheartfitness.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.brainheartfitness.R
import com.brainheartfitness.data.model.TimeRange
import kotlin.math.min

@Composable
fun GoalCard(
    currentMinutes: Int,
    goalMinutes: Int,
    timeRange: TimeRange,
    modifier: Modifier = Modifier
) {
    val progressPercentage = min((currentMinutes.toFloat() / goalMinutes) * 100f, 100f)
    val goalText = if (timeRange == TimeRange.DAILY) {
        stringResource(R.string.daily_goal)
    } else {
        stringResource(R.string.weekly_goal)
    }
    
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = goalText,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
            
            Text(
                text = "$goalMinutes minutes of moderate+ activity ${if (timeRange == TimeRange.DAILY) "today" else "this week"}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onPrimaryContainer,
                modifier = Modifier.padding(top = 4.dp)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                verticalAlignment = Alignment.Bottom
            ) {
                Text(
                    text = "$currentMinutes",
                    style = MaterialTheme.typography.headlineLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = " / $goalMinutes ${stringResource(R.string.minutes_abbrev)}",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                    modifier = Modifier.padding(bottom = 4.dp)
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            LinearProgressIndicator(
                progress = { progressPercentage / 100f },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp),
                color = MaterialTheme.colorScheme.primary,
                trackColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)
            )
            
            if (progressPercentage >= 100f) {
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = stringResource(R.string.goal_achieved),
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}