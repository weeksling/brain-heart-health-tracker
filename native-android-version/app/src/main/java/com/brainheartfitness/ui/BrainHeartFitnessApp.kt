package com.brainheartfitness.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.brainheartfitness.R
import com.brainheartfitness.ui.home.HomeScreen
import com.brainheartfitness.ui.progress.ProgressScreen
import com.brainheartfitness.ui.explore.ExploreScreen

sealed class Screen(val route: String, val resourceId: Int) {
    object Home : Screen("home", R.string.home)
    object Progress : Screen("progress", R.string.progress)
    object Explore : Screen("explore", R.string.explore)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BrainHeartFitnessApp(modifier: Modifier = Modifier) {
    val navController = rememberNavController()
    val items = listOf(Screen.Home, Screen.Progress, Screen.Explore)
    
    Scaffold(
        modifier = modifier,
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination
                
                items.forEach { screen ->
                    NavigationBarItem(
                        icon = { 
                            // Using simple text icons for now
                            Text(
                                text = when (screen) {
                                    Screen.Home -> "🏠"
                                    Screen.Progress -> "📊"
                                    Screen.Explore -> "🔍"
                                }
                            )
                        },
                        label = { Text(stringResource(screen.resourceId)) },
                        selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            navController.navigate(screen.route) {
                                // Pop up to the start destination of the graph to
                                // avoid building up a large stack of destinations
                                // on the back stack as users select items
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                // Avoid multiple copies of the same destination when
                                // reselecting the same item
                                launchSingleTop = true
                                // Restore state when reselecting a previously selected item
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Home.route) {
                HomeScreen()
            }
            composable(Screen.Progress.route) {
                ProgressScreen()
            }
            composable(Screen.Explore.route) {
                ExploreScreen()
            }
        }
    }
}

