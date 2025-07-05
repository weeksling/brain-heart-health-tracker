package com.brainheartfitness.data.model

import androidx.compose.ui.graphics.Color

data class HeartRateZone(
    val id: String,
    val name: String,
    val description: String,
    val minBpm: Int,
    val maxBpm: Int,
    val color: Color,
    val minutes: Int = 0,
    val dailyGoal: Int = 0,
    val weeklyGoal: Int = 0
) {
    companion object {
        val DEFAULT_ZONES = listOf(
            HeartRateZone(
                id = "zone1",
                name = "Zone 1",
                description = "Recovery",
                minBpm = 0,
                maxBpm = 120,
                color = Color(0xFF81C784),
                dailyGoal = 20,
                weeklyGoal = 150
            ),
            HeartRateZone(
                id = "zone2",
                name = "Zone 2",
                description = "Aerobic Base",
                minBpm = 121,
                maxBpm = 140,
                color = Color(0xFF64B5F6),
                dailyGoal = 25,
                weeklyGoal = 150
            ),
            HeartRateZone(
                id = "zone3",
                name = "Zone 3",
                description = "Tempo",
                minBpm = 141,
                maxBpm = 160,
                color = Color(0xFFFFB74D),
                dailyGoal = 5,
                weeklyGoal = 30
            ),
            HeartRateZone(
                id = "zone4",
                name = "Zone 4",
                description = "Threshold",
                minBpm = 161,
                maxBpm = 180,
                color = Color(0xFFF44336),
                dailyGoal = 0,
                weeklyGoal = 0
            ),
            HeartRateZone(
                id = "zone5",
                name = "Zone 5",
                description = "VO2 Max",
                minBpm = 181,
                maxBpm = 999,
                color = Color(0xFF9C27B0),
                dailyGoal = 0,
                weeklyGoal = 0
            )
        )
    }
}