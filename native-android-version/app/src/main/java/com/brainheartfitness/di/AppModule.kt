package com.brainheartfitness.di

import android.content.Context
import com.brainheartfitness.data.DataSourceManager
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
    fun provideDataSourceManager(
        @ApplicationContext context: Context
    ): DataSourceManager = DataSourceManager(context)
    
    @Provides
    @Singleton
    fun provideHealthConnectManager(
        @ApplicationContext context: Context,
        dataSourceManager: DataSourceManager
    ): HealthConnectManager = HealthConnectManager(context, dataSourceManager)
    
    @Provides
    @Singleton
    fun provideHealthDataRepository(
        healthConnectManager: HealthConnectManager,
        dataSourceManager: DataSourceManager
    ): HealthDataRepository = HealthDataRepository(healthConnectManager, dataSourceManager)
}