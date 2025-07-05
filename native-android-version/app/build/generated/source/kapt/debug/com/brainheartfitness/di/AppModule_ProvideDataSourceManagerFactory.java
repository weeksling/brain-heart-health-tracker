package com.brainheartfitness.di;

import android.content.Context;
import com.brainheartfitness.data.DataSourceManager;
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
public final class AppModule_ProvideDataSourceManagerFactory implements Factory<DataSourceManager> {
  private final Provider<Context> contextProvider;

  public AppModule_ProvideDataSourceManagerFactory(Provider<Context> contextProvider) {
    this.contextProvider = contextProvider;
  }

  @Override
  public DataSourceManager get() {
    return provideDataSourceManager(contextProvider.get());
  }

  public static AppModule_ProvideDataSourceManagerFactory create(
      Provider<Context> contextProvider) {
    return new AppModule_ProvideDataSourceManagerFactory(contextProvider);
  }

  public static DataSourceManager provideDataSourceManager(Context context) {
    return Preconditions.checkNotNullFromProvides(AppModule.INSTANCE.provideDataSourceManager(context));
  }
}
