package com.brainheartfitness.di;

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

  public AppModule_ProvideHealthDataRepositoryFactory(
      Provider<HealthConnectManager> healthConnectManagerProvider) {
    this.healthConnectManagerProvider = healthConnectManagerProvider;
  }

  @Override
  public HealthDataRepository get() {
    return provideHealthDataRepository(healthConnectManagerProvider.get());
  }

  public static AppModule_ProvideHealthDataRepositoryFactory create(
      Provider<HealthConnectManager> healthConnectManagerProvider) {
    return new AppModule_ProvideHealthDataRepositoryFactory(healthConnectManagerProvider);
  }

  public static HealthDataRepository provideHealthDataRepository(
      HealthConnectManager healthConnectManager) {
    return Preconditions.checkNotNullFromProvides(AppModule.INSTANCE.provideHealthDataRepository(healthConnectManager));
  }
}
