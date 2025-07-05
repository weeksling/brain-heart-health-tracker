package com.brainheartfitness.di

import android.content.Context
import com.brainheartfitness.data.health.HealthConnectManager
import com.brainheartfitness.data.repository.HealthDataRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    @Provides
    @Singleton
    fun provideHealthConnectManager(
        @ApplicationContext context: Context
    ): HealthConnectManager = HealthConnectManager(context)
    
    @Provides
    @Singleton
    fun provideHealthDataRepository(
        healthConnectManager: HealthConnectManager
    ): HealthDataRepository = HealthDataRepository(healthConnectManager)
}