package com.brainheartfitness.ui.progress;

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
public final class ProgressViewModel_Factory implements Factory<ProgressViewModel> {
  private final Provider<HealthDataRepository> healthDataRepositoryProvider;

  public ProgressViewModel_Factory(Provider<HealthDataRepository> healthDataRepositoryProvider) {
    this.healthDataRepositoryProvider = healthDataRepositoryProvider;
  }

  @Override
  public ProgressViewModel get() {
    return newInstance(healthDataRepositoryProvider.get());
  }

  public static ProgressViewModel_Factory create(
      Provider<HealthDataRepository> healthDataRepositoryProvider) {
    return new ProgressViewModel_Factory(healthDataRepositoryProvider);
  }

  public static ProgressViewModel newInstance(HealthDataRepository healthDataRepository) {
    return new ProgressViewModel(healthDataRepository);
  }
}
