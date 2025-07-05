package com.brainheartfitness.data.health;

@javax.inject.Singleton()
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000V\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\"\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u000b\n\u0000\b\u0007\u0018\u00002\u00020\u0001B\u0011\b\u0007\u0012\b\b\u0001\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\u000e\u0010\n\u001a\u00020\u000bH\u0086@\u00a2\u0006\u0002\u0010\fJ\u001e\u0010\r\u001a\u001a\u0012\n\u0012\b\u0012\u0004\u0012\u00020\t0\b\u0012\n\u0012\b\u0012\u0004\u0012\u00020\t0\b0\u000eJ\u001e\u0010\u000f\u001a\b\u0012\u0004\u0012\u00020\u00110\u00102\u0006\u0010\u0012\u001a\u00020\u00132\u0006\u0010\u0014\u001a\u00020\u0013H\u0002J\u001e\u0010\u0015\u001a\b\u0012\u0004\u0012\u00020\u00160\u00102\u0006\u0010\u0012\u001a\u00020\u00132\u0006\u0010\u0014\u001a\u00020\u0013H\u0002J$\u0010\u0017\u001a\b\u0012\u0004\u0012\u00020\u00180\u00102\u0006\u0010\u0012\u001a\u00020\u00132\u0006\u0010\u0014\u001a\u00020\u0013H\u0086@\u00a2\u0006\u0002\u0010\u0019J$\u0010\u001a\u001a\b\u0012\u0004\u0012\u00020\u00110\u00102\u0006\u0010\u0012\u001a\u00020\u00132\u0006\u0010\u0014\u001a\u00020\u0013H\u0086@\u00a2\u0006\u0002\u0010\u0019J\f\u0010\u001b\u001a\b\u0012\u0004\u0012\u00020\t0\bJ$\u0010\u001c\u001a\b\u0012\u0004\u0012\u00020\u00160\u00102\u0006\u0010\u0012\u001a\u00020\u00132\u0006\u0010\u0014\u001a\u00020\u0013H\u0086@\u00a2\u0006\u0002\u0010\u0019J\u000e\u0010\u001d\u001a\u00020\u001eH\u0086@\u00a2\u0006\u0002\u0010\fR\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0014\u0010\u0007\u001a\b\u0012\u0004\u0012\u00020\t0\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u001f"}, d2 = {"Lcom/brainheartfitness/data/health/HealthConnectManager;", "", "context", "Landroid/content/Context;", "(Landroid/content/Context;)V", "healthConnectClient", "Landroidx/health/connect/client/HealthConnectClient;", "permissions", "", "", "checkAvailability", "Lcom/brainheartfitness/data/model/HealthConnectState;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "createPermissionRequestContract", "Landroidx/activity/result/contract/ActivityResultContract;", "generateDummyHeartRateData", "", "Landroidx/health/connect/client/records/HeartRateRecord;", "startTime", "Ljava/time/Instant;", "endTime", "generateDummyStepsData", "Landroidx/health/connect/client/records/StepsRecord;", "getExerciseData", "Landroidx/health/connect/client/records/ExerciseSessionRecord;", "(Ljava/time/Instant;Ljava/time/Instant;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getHeartRateData", "getRequiredPermissions", "getStepsData", "hasAllPermissions", "", "app_debug"})
public final class HealthConnectManager {
    @org.jetbrains.annotations.NotNull()
    private final android.content.Context context = null;
    @org.jetbrains.annotations.NotNull()
    private final androidx.health.connect.client.HealthConnectClient healthConnectClient = null;
    @org.jetbrains.annotations.NotNull()
    private final java.util.Set<java.lang.String> permissions = null;
    
    @javax.inject.Inject()
    public HealthConnectManager(@dagger.hilt.android.qualifiers.ApplicationContext()
    @org.jetbrains.annotations.NotNull()
    android.content.Context context) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object checkAvailability(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.brainheartfitness.data.model.HealthConnectState> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object hasAllPermissions(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.lang.Boolean> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final androidx.activity.result.contract.ActivityResultContract<java.util.Set<java.lang.String>, java.util.Set<java.lang.String>> createPermissionRequestContract() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.Set<java.lang.String> getRequiredPermissions() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getHeartRateData(@org.jetbrains.annotations.NotNull()
    java.time.Instant startTime, @org.jetbrains.annotations.NotNull()
    java.time.Instant endTime, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.List<androidx.health.connect.client.records.HeartRateRecord>> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getStepsData(@org.jetbrains.annotations.NotNull()
    java.time.Instant startTime, @org.jetbrains.annotations.NotNull()
    java.time.Instant endTime, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.List<androidx.health.connect.client.records.StepsRecord>> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getExerciseData(@org.jetbrains.annotations.NotNull()
    java.time.Instant startTime, @org.jetbrains.annotations.NotNull()
    java.time.Instant endTime, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.List<androidx.health.connect.client.records.ExerciseSessionRecord>> $completion) {
        return null;
    }
    
    private final java.util.List<androidx.health.connect.client.records.HeartRateRecord> generateDummyHeartRateData(java.time.Instant startTime, java.time.Instant endTime) {
        return null;
    }
    
    private final java.util.List<androidx.health.connect.client.records.StepsRecord> generateDummyStepsData(java.time.Instant startTime, java.time.Instant endTime) {
        return null;
    }
}