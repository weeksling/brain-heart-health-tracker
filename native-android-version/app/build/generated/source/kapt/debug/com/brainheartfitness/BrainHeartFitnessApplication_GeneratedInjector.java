package com.brainheartfitness;

import dagger.hilt.InstallIn;
import dagger.hilt.codegen.OriginatingElement;
import dagger.hilt.components.SingletonComponent;
import dagger.hilt.internal.GeneratedEntryPoint;
import javax.annotation.processing.Generated;

@OriginatingElement(
    topLevelClass = BrainHeartFitnessApplication.class
)
@GeneratedEntryPoint
@InstallIn(SingletonComponent.class)
@Generated("dagger.hilt.android.processor.internal.androidentrypoint.InjectorEntryPointGenerator")
public interface BrainHeartFitnessApplication_GeneratedInjector {
  void injectBrainHeartFitnessApplication(
      BrainHeartFitnessApplication brainHeartFitnessApplication);
}
