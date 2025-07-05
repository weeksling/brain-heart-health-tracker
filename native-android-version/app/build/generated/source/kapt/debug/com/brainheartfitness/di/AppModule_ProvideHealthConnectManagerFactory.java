package com.brainheartfitness.di;

import android.content.Context;
import com.brainheartfitness.data.DataSourceManager;
import com.brainheartfitness.data.health.HealthConnectManager;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata("javax.inject.Singleton")
@QualifierMetadata("dagger.hilt.android.qualifiers.ApplicationContext")
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
public final class AppModule_ProvideHealthConnectManagerFactory implements Factory<HealthConnectManager> {
  private final Provider<Context> contextProvider;

  private final Provider<DataSourceManager> dataSourceManagerProvider;

  public AppModule_ProvideHealthConnectManagerFactory(Provider<Context> contextProvider,
      Provider<DataSourceManager> dataSourceManagerProvider) {
    this.contextProvider = contextProvider;
    this.dataSourceManagerProvider = dataSourceManagerProvider;
  }

  @Override
  public HealthConnectManager get() {
    return provideHealthConnectManager(contextProvider.get(), dataSourceManagerProvider.get());
  }

  public static AppModule_ProvideHealthConnectManagerFactory create(
      Provider<Context> contextProvider, Provider<DataSourceManager> dataSourceManagerProvider) {
    return new AppModule_ProvideHealthConnectManagerFactory(contextProvider, dataSourceManagerProvider);
  }

  public static HealthConnectManager provideHealthConnectManager(Context context,
      DataSourceManager dataSourceManager) {
    return Preconditions.checkNotNullFromProvides(AppModule.INSTANCE.provideHealthConnectManager(context, dataSourceManager));
  }
}
