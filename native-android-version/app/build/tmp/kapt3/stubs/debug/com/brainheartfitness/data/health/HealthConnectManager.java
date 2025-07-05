package com.brainheartfitness.data.health;

@javax.inject.Singleton()
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000^\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\"\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u000b\n\u0002\b\u0002\b\u0007\u0018\u0000 !2\u00020\u0001:\u0001!B\u0019\b\u0007\u0012\b\b\u0001\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\u000e\u0010\f\u001a\u00020\rH\u0086@\u00a2\u0006\u0002\u0010\u000eJ\u001e\u0010\u000f\u001a\u001a\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u000b0\n\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u000b0\n0\u0010J\u001e\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u00130\u00122\u0006\u0010\u0014\u001a\u00020\u00152\u0006\u0010\u0016\u001a\u00020\u0015H\u0002J\u001e\u0010\u0017\u001a\b\u0012\u0004\u0012\u00020\u00180\u00122\u0006\u0010\u0014\u001a\u00020\u00152\u0006\u0010\u0016\u001a\u00020\u0015H\u0002J$\u0010\u0019\u001a\b\u0012\u0004\u0012\u00020\u001a0\u00122\u0006\u0010\u0014\u001a\u00020\u00152\u0006\u0010\u0016\u001a\u00020\u0015H\u0086@\u00a2\u0006\u0002\u0010\u001bJ$\u0010\u001c\u001a\b\u0012\u0004\u0012\u00020\u00130\u00122\u0006\u0010\u0014\u001a\u00020\u00152\u0006\u0010\u0016\u001a\u00020\u0015H\u0086@\u00a2\u0006\u0002\u0010\u001bJ\f\u0010\u001d\u001a\b\u0012\u0004\u0012\u00020\u000b0\nJ$\u0010\u001e\u001a\b\u0012\u0004\u0012\u00020\u00180\u00122\u0006\u0010\u0014\u001a\u00020\u00152\u0006\u0010\u0016\u001a\u00020\u0015H\u0086@\u00a2\u0006\u0002\u0010\u001bJ\u000e\u0010\u001f\u001a\u00020 H\u0086@\u00a2\u0006\u0002\u0010\u000eR\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0014\u0010\t\u001a\b\u0012\u0004\u0012\u00020\u000b0\nX\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\""}, d2 = {"Lcom/brainheartfitness/data/health/HealthConnectManager;", "", "context", "Landroid/content/Context;", "dataSourceManager", "Lcom/brainheartfitness/data/DataSourceManager;", "(Landroid/content/Context;Lcom/brainheartfitness/data/DataSourceManager;)V", "healthConnectClient", "Landroidx/health/connect/client/HealthConnectClient;", "permissions", "", "", "checkAvailability", "Lcom/brainheartfitness/data/model/HealthConnectState;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "createPermissionRequestContract", "Landroidx/activity/result/contract/ActivityResultContract;", "generateDummyHeartRateData", "", "Landroidx/health/connect/client/records/HeartRateRecord;", "startTime", "Ljava/time/Instant;", "endTime", "generateDummyStepsData", "Landroidx/health/connect/client/records/StepsRecord;", "getExerciseData", "Landroidx/health/connect/client/records/ExerciseSessionRecord;", "(Ljava/time/Instant;Ljava/time/Instant;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getHeartRateData", "getRequiredPermissions", "getStepsData", "hasAllPermissions", "", "Companion", "app_debug"})
public final class HealthConnectManager {
    @org.jetbrains.annotations.NotNull()
    private final android.content.Context context = null;
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.DataSourceManager dataSourceManager = null;
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String TAG = "HealthConnectManager";
    @org.jetbrains.annotations.NotNull()
    private final androidx.health.connect.client.HealthConnectClient healthConnectClient = null;
    @org.jetbrains.annotations.NotNull()
    private final java.util.Set<java.lang.String> permissions = null;
    @org.jetbrains.annotations.NotNull()
    public static final com.brainheartfitness.data.health.HealthConnectManager.Companion Companion = null;
    
    @javax.inject.Inject()
    public HealthConnectManager(@dagger.hilt.android.qualifiers.ApplicationContext()
    @org.jetbrains.annotations.NotNull()
    android.content.Context context, @org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.DataSourceManager dataSourceManager) {
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
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0005"}, d2 = {"Lcom/brainheartfitness/data/health/HealthConnectManager$Companion;", "", "()V", "TAG", "", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
}