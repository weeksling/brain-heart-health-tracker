package com.brainheartfitness.ui.home;

import com.brainheartfitness.data.DataSourceManager;
import com.brainheartfitness.data.health.HealthConnectManager;
import com.brainheartfitness.data.repository.HealthDataRepository;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata
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
public final class HomeViewModel_Factory implements Factory<HomeViewModel> {
  private final Provider<HealthDataRepository> healthDataRepositoryProvider;

  private final Provider<HealthConnectManager> healthConnectManagerProvider;

  private final Provider<DataSourceManager> dataSourceManagerProvider;

  public HomeViewModel_Factory(Provider<HealthDataRepository> healthDataRepositoryProvider,
      Provider<HealthConnectManager> healthConnectManagerProvider,
      Provider<DataSourceManager> dataSourceManagerProvider) {
    this.healthDataRepositoryProvider = healthDataRepositoryProvider;
    this.healthConnectManagerProvider = healthConnectManagerProvider;
    this.dataSourceManagerProvider = dataSourceManagerProvider;
  }

  @Override
  public HomeViewModel get() {
    return newInstance(healthDataRepositoryProvider.get(), healthConnectManagerProvider.get(), dataSourceManagerProvider.get());
  }

  public static HomeViewModel_Factory create(
      Provider<HealthDataRepository> healthDataRepositoryProvider,
      Provider<HealthConnectManager> healthConnectManagerProvider,
      Provider<DataSourceManager> dataSourceManagerProvider) {
    return new HomeViewModel_Factory(healthDataRepositoryProvider, healthConnectManagerProvider, dataSourceManagerProvider);
  }

  public static HomeViewModel newInstance(HealthDataRepository healthDataRepository,
      HealthConnectManager healthConnectManager, DataSourceManager dataSourceManager) {
    return new HomeViewModel(healthDataRepository, healthConnectManager, dataSourceManager);
  }
}
