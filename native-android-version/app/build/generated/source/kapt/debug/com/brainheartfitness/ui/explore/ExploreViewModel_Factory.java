package com.brainheartfitness.ui.explore;

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
public final class ExploreViewModel_Factory implements Factory<ExploreViewModel> {
  private final Provider<HealthDataRepository> healthDataRepositoryProvider;

  private final Provider<HealthConnectManager> healthConnectManagerProvider;

  public ExploreViewModel_Factory(Provider<HealthDataRepository> healthDataRepositoryProvider,
      Provider<HealthConnectManager> healthConnectManagerProvider) {
    this.healthDataRepositoryProvider = healthDataRepositoryProvider;
    this.healthConnectManagerProvider = healthConnectManagerProvider;
  }

  @Override
  public ExploreViewModel get() {
    return newInstance(healthDataRepositoryProvider.get(), healthConnectManagerProvider.get());
  }

  public static ExploreViewModel_Factory create(
      Provider<HealthDataRepository> healthDataRepositoryProvider,
      Provider<HealthConnectManager> healthConnectManagerProvider) {
    return new ExploreViewModel_Factory(healthDataRepositoryProvider, healthConnectManagerProvider);
  }

  public static ExploreViewModel newInstance(HealthDataRepository healthDataRepository,
      HealthConnectManager healthConnectManager) {
    return new ExploreViewModel(healthDataRepository, healthConnectManager);
  }
}
