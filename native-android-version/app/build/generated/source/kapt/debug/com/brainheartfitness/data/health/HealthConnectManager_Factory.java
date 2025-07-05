package com.brainheartfitness.data.health;

import android.content.Context;
import com.brainheartfitness.data.DataSourceManager;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
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
public final class HealthConnectManager_Factory implements Factory<HealthConnectManager> {
  private final Provider<Context> contextProvider;

  private final Provider<DataSourceManager> dataSourceManagerProvider;

  public HealthConnectManager_Factory(Provider<Context> contextProvider,
      Provider<DataSourceManager> dataSourceManagerProvider) {
    this.contextProvider = contextProvider;
    this.dataSourceManagerProvider = dataSourceManagerProvider;
  }

  @Override
  public HealthConnectManager get() {
    return newInstance(contextProvider.get(), dataSourceManagerProvider.get());
  }

  public static HealthConnectManager_Factory create(Provider<Context> contextProvider,
      Provider<DataSourceManager> dataSourceManagerProvider) {
    return new HealthConnectManager_Factory(contextProvider, dataSourceManagerProvider);
  }

  public static HealthConnectManager newInstance(Context context,
      DataSourceManager dataSourceManager) {
    return new HealthConnectManager(context, dataSourceManager);
  }
}
