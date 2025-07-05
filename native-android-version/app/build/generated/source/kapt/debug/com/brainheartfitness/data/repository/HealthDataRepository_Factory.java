package com.brainheartfitness.data.repository;

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

  public HealthDataRepository_Factory(Provider<HealthConnectManager> healthConnectManagerProvider) {
    this.healthConnectManagerProvider = healthConnectManagerProvider;
  }

  @Override
  public HealthDataRepository get() {
    return newInstance(healthConnectManagerProvider.get());
  }

  public static HealthDataRepository_Factory create(
      Provider<HealthConnectManager> healthConnectManagerProvider) {
    return new HealthDataRepository_Factory(healthConnectManagerProvider);
  }

  public static HealthDataRepository newInstance(HealthConnectManager healthConnectManager) {
    return new HealthDataRepository(healthConnectManager);
  }
}
