package com.brainheartfitness.di;

import com.brainheartfitness.data.DataSourceManager;
import com.brainheartfitness.data.health.HealthConnectManager;
import com.brainheartfitness.data.repository.HealthDataRepository;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
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
public final class AppModule_ProvideHealthDataRepositoryFactory implements Factory<HealthDataRepository> {
  private final Provider<HealthConnectManager> healthConnectManagerProvider;

  private final Provider<DataSourceManager> dataSourceManagerProvider;

  public AppModule_ProvideHealthDataRepositoryFactory(
      Provider<HealthConnectManager> healthConnectManagerProvider,
      Provider<DataSourceManager> dataSourceManagerProvider) {
    this.healthConnectManagerProvider = healthConnectManagerProvider;
    this.dataSourceManagerProvider = dataSourceManagerProvider;
  }

  @Override
  public HealthDataRepository get() {
    return provideHealthDataRepository(healthConnectManagerProvider.get(), dataSourceManagerProvider.get());
  }

  public static AppModule_ProvideHealthDataRepositoryFactory create(
      Provider<HealthConnectManager> healthConnectManagerProvider,
      Provider<DataSourceManager> dataSourceManagerProvider) {
    return new AppModule_ProvideHealthDataRepositoryFactory(healthConnectManagerProvider, dataSourceManagerProvider);
  }

  public static HealthDataRepository provideHealthDataRepository(
      HealthConnectManager healthConnectManager, DataSourceManager dataSourceManager) {
    return Preconditions.checkNotNullFromProvides(AppModule.INSTANCE.provideHealthDataRepository(healthConnectManager, dataSourceManager));
  }
}
