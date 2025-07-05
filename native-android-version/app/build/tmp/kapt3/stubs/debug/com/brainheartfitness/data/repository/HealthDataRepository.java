package com.brainheartfitness.data.repository;

@javax.inject.Singleton()
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000P\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0000\b\u0007\u0018\u00002\u00020\u0001B\u000f\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\u0016\u0010\u0005\u001a\u00020\u00062\u0006\u0010\u0007\u001a\u00020\b2\u0006\u0010\t\u001a\u00020\nJ\u0016\u0010\u0005\u001a\u00020\u00062\u0006\u0010\u0007\u001a\u00020\u000b2\u0006\u0010\t\u001a\u00020\nJ\u0018\u0010\f\u001a\b\u0012\u0004\u0012\u00020\u000e0\r2\b\b\u0002\u0010\u000f\u001a\u00020\u0010H\u0002J\u0016\u0010\u0011\u001a\u00020\b2\u0006\u0010\u0012\u001a\u00020\u0013H\u0086@\u00a2\u0006\u0002\u0010\u0014J\u0010\u0010\u0015\u001a\u00020\u00162\u0006\u0010\u0017\u001a\u00020\u0016H\u0002J\u000e\u0010\u0018\u001a\u00020\u000bH\u0086@\u00a2\u0006\u0002\u0010\u0019J\u0014\u0010\u001a\u001a\b\u0012\u0004\u0012\u00020\u001b0\rH\u0086@\u00a2\u0006\u0002\u0010\u0019R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u001c"}, d2 = {"Lcom/brainheartfitness/data/repository/HealthDataRepository;", "", "healthConnectManager", "Lcom/brainheartfitness/data/health/HealthConnectManager;", "(Lcom/brainheartfitness/data/health/HealthConnectManager;)V", "convertToProgressData", "Lcom/brainheartfitness/data/model/ProgressData;", "summary", "Lcom/brainheartfitness/data/model/DailyHealthSummary;", "timeRange", "Lcom/brainheartfitness/data/model/TimeRange;", "Lcom/brainheartfitness/data/model/WeeklyHealthSummary;", "generateDummySessions", "", "Lcom/brainheartfitness/data/model/HeartRateSession;", "count", "", "getDailyHealthSummary", "date", "Ljava/time/LocalDate;", "(Ljava/time/LocalDate;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getWeekStart", "Ljava/time/Instant;", "timestamp", "getWeeklyHealthSummary", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getWeeklyProgress", "Lcom/brainheartfitness/data/model/DailyProgress;", "app_debug"})
public final class HealthDataRepository {
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.health.HealthConnectManager healthConnectManager = null;
    
    @javax.inject.Inject()
    public HealthDataRepository(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.health.HealthConnectManager healthConnectManager) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getWeeklyHealthSummary(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.brainheartfitness.data.model.WeeklyHealthSummary> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getDailyHealthSummary(@org.jetbrains.annotations.NotNull()
    java.time.LocalDate date, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.brainheartfitness.data.model.DailyHealthSummary> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getWeeklyProgress(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.List<com.brainheartfitness.data.model.DailyProgress>> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.brainheartfitness.data.model.ProgressData convertToProgressData(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.model.WeeklyHealthSummary summary, @org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.model.TimeRange timeRange) {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.brainheartfitness.data.model.ProgressData convertToProgressData(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.model.DailyHealthSummary summary, @org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.model.TimeRange timeRange) {
        return null;
    }
    
    private final java.time.Instant getWeekStart(java.time.Instant timestamp) {
        return null;
    }
    
    private final java.util.List<com.brainheartfitness.data.model.HeartRateSession> generateDummySessions(int count) {
        return null;
    }
}