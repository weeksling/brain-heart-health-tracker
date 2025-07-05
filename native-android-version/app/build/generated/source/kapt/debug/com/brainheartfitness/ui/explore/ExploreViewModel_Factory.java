package com.brainheartfitness.ui.explore;

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

  public ExploreViewModel_Factory(Provider<HealthDataRepository> healthDataRepositoryProvider) {
    this.healthDataRepositoryProvider = healthDataRepositoryProvider;
  }

  @Override
  public ExploreViewModel get() {
    return newInstance(healthDataRepositoryProvider.get());
  }

  public static ExploreViewModel_Factory create(
      Provider<HealthDataRepository> healthDataRepositoryProvider) {
    return new ExploreViewModel_Factory(healthDataRepositoryProvider);
  }

  public static ExploreViewModel newInstance(HealthDataRepository healthDataRepository) {
    return new ExploreViewModel(healthDataRepository);
  }
}
