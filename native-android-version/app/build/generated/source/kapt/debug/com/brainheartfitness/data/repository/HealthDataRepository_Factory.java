package com.brainheartfitness.data.repository;

import com.brainheartfitness.data.DataSourceManager;
import com.brainheartfitness.data.health.HealthConnectManager;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata("javax.inject.Singleton")
@QualifierMetadata
@DaggerGenerated
@Generated(
    value = "dagger.internal.codegen.ComponentProcessor",
    comments = "https://dagger.dev"
)
@SuppressWarnings({
    "unchecked",
    "rawtypes",
    "KotlinInternal",
    "KotlinInternalInJava",
    "cast",
    "deprecation"
})
public final class HealthDataRepository_Factory implements Factory<HealthDataRepository> {
  private final Provider<HealthConnectManager> healthConnectManagerProvider;

  private final Provider<DataSourceManager> dataSourceManagerProvider;

  public HealthDataRepository_Factory(Provider<HealthConnectManager> healthConnectManagerProvider,
      Provider<DataSourceManager> dataSourceManagerProvider) {
    this.healthConnectManagerProvider = healthConnectManagerProvider;
    this.dataSourceManagerProvider = dataSourceManagerProvider;
  }

  @Override
  public HealthDataRepository get() {
    return newInstance(healthConnectManagerProvider.get(), dataSourceManagerProvider.get());
  }

  public static HealthDataRepository_Factory create(
      Provider<HealthConnectManager> healthConnectManagerProvider,
      Provider<DataSourceManager> dataSourceManagerProvider) {
    return new HealthDataRepository_Factory(healthConnectManagerProvider, dataSourceManagerProvider);
  }

  public static HealthDataRepository newInstance(HealthConnectManager healthConnectManager,
      DataSourceManager dataSourceManager) {
    return new HealthDataRepository(healthConnectManager, dataSourceManager);
  }
}
