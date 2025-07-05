package com.brainheartfitness.data.repository;

@javax.inject.Singleton()
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000|\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010$\n\u0002\u0010\u000e\n\u0002\b\u0003\b\u0007\u0018\u0000 /2\u00020\u0001:\u0002/0B\u0017\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\u0016\u0010\u0007\u001a\u00020\b2\f\u0010\t\u001a\b\u0012\u0004\u0012\u00020\u000b0\nH\u0002J\u0016\u0010\f\u001a\u00020\r2\f\u0010\u000e\u001a\b\u0012\u0004\u0012\u00020\u000f0\nH\u0002J\u0016\u0010\u0010\u001a\u00020\u00112\u0006\u0010\u0012\u001a\u00020\u00132\u0006\u0010\u0014\u001a\u00020\u0015J\u0016\u0010\u0010\u001a\u00020\u00112\u0006\u0010\u0012\u001a\u00020\u00162\u0006\u0010\u0014\u001a\u00020\u0015J\u0016\u0010\u0017\u001a\u00020\u00182\f\u0010\u0019\u001a\b\u0012\u0004\u0012\u00020\u001a0\nH\u0002J\u0018\u0010\u001b\u001a\b\u0012\u0004\u0012\u00020\u00180\n2\b\b\u0002\u0010\u001c\u001a\u00020\rH\u0002J\u0010\u0010\u001d\u001a\u00020\u00132\u0006\u0010\u001e\u001a\u00020\u001fH\u0002J\b\u0010 \u001a\u00020\u0016H\u0002J\u000e\u0010!\u001a\b\u0012\u0004\u0012\u00020\"0\nH\u0002J\u001c\u0010#\u001a\b\u0012\u0004\u0012\u00020\u00180\n2\f\u0010\t\u001a\b\u0012\u0004\u0012\u00020\u000b0\nH\u0002J\u0016\u0010$\u001a\u00020\u00132\u0006\u0010\u001e\u001a\u00020\u001fH\u0086@\u00a2\u0006\u0002\u0010%J\u0010\u0010&\u001a\u00020\'2\u0006\u0010(\u001a\u00020\'H\u0002J\u000e\u0010)\u001a\u00020\u0016H\u0086@\u00a2\u0006\u0002\u0010*J\u0014\u0010+\u001a\b\u0012\u0004\u0012\u00020\"0\nH\u0086@\u00a2\u0006\u0002\u0010*J\"\u0010,\u001a\u000e\u0012\u0004\u0012\u00020.\u0012\u0004\u0012\u00020\r0-2\f\u0010\t\u001a\b\u0012\u0004\u0012\u00020\u000b0\nH\u0002R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u00061"}, d2 = {"Lcom/brainheartfitness/data/repository/HealthDataRepository;", "", "healthConnectManager", "Lcom/brainheartfitness/data/health/HealthConnectManager;", "dataSourceManager", "Lcom/brainheartfitness/data/DataSourceManager;", "(Lcom/brainheartfitness/data/health/HealthConnectManager;Lcom/brainheartfitness/data/DataSourceManager;)V", "calculateHeartRateStats", "Lcom/brainheartfitness/data/repository/HealthDataRepository$HeartRateStats;", "heartRateData", "", "Landroidx/health/connect/client/records/HeartRateRecord;", "calculateTotalSteps", "", "stepsData", "Landroidx/health/connect/client/records/StepsRecord;", "convertToProgressData", "Lcom/brainheartfitness/data/model/ProgressData;", "summary", "Lcom/brainheartfitness/data/model/DailyHealthSummary;", "timeRange", "Lcom/brainheartfitness/data/model/TimeRange;", "Lcom/brainheartfitness/data/model/WeeklyHealthSummary;", "createSessionFromSamples", "Lcom/brainheartfitness/data/model/HeartRateSession;", "samples", "Landroidx/health/connect/client/records/HeartRateRecord$Sample;", "generateDummySessions", "count", "generateFallbackDailyData", "date", "Ljava/time/LocalDate;", "generateFallbackWeeklyData", "generateFallbackWeeklyProgress", "Lcom/brainheartfitness/data/model/DailyProgress;", "generateSessionsFromHeartRateData", "getDailyHealthSummary", "(Ljava/time/LocalDate;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getWeekStart", "Ljava/time/Instant;", "timestamp", "getWeeklyHealthSummary", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getWeeklyProgress", "processHeartRateIntoZones", "", "", "Companion", "HeartRateStats", "app_debug"})
public final class HealthDataRepository {
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.health.HealthConnectManager healthConnectManager = null;
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.DataSourceManager dataSourceManager = null;
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String TAG = "HealthDataRepository";
    @org.jetbrains.annotations.NotNull()
    public static final com.brainheartfitness.data.repository.HealthDataRepository.Companion Companion = null;
    
    @javax.inject.Inject()
    public HealthDataRepository(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.health.HealthConnectManager healthConnectManager, @org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.DataSourceManager dataSourceManager) {
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
    
    private final java.util.Map<java.lang.String, java.lang.Integer> processHeartRateIntoZones(java.util.List<androidx.health.connect.client.records.HeartRateRecord> heartRateData) {
        return null;
    }
    
    private final com.brainheartfitness.data.repository.HealthDataRepository.HeartRateStats calculateHeartRateStats(java.util.List<androidx.health.connect.client.records.HeartRateRecord> heartRateData) {
        return null;
    }
    
    private final int calculateTotalSteps(java.util.List<androidx.health.connect.client.records.StepsRecord> stepsData) {
        return 0;
    }
    
    private final java.util.List<com.brainheartfitness.data.model.HeartRateSession> generateSessionsFromHeartRateData(java.util.List<androidx.health.connect.client.records.HeartRateRecord> heartRateData) {
        return null;
    }
    
    private final com.brainheartfitness.data.model.HeartRateSession createSessionFromSamples(java.util.List<androidx.health.connect.client.records.HeartRateRecord.Sample> samples) {
        return null;
    }
    
    private final com.brainheartfitness.data.model.WeeklyHealthSummary generateFallbackWeeklyData() {
        return null;
    }
    
    private final com.brainheartfitness.data.model.DailyHealthSummary generateFallbackDailyData(java.time.LocalDate date) {
        return null;
    }
    
    private final java.util.List<com.brainheartfitness.data.model.DailyProgress> generateFallbackWeeklyProgress() {
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
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0005"}, d2 = {"Lcom/brainheartfitness/data/repository/HealthDataRepository$Companion;", "", "()V", "TAG", "", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000 \n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\b\n\u0002\b\f\n\u0002\u0010\u000b\n\u0002\b\u0003\n\u0002\u0010\u000e\n\u0000\b\u0082\b\u0018\u00002\u00020\u0001B\u001d\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0003\u0012\u0006\u0010\u0005\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0006J\t\u0010\u000b\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\f\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\r\u001a\u00020\u0003H\u00c6\u0003J\'\u0010\u000e\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00032\b\b\u0002\u0010\u0005\u001a\u00020\u0003H\u00c6\u0001J\u0013\u0010\u000f\u001a\u00020\u00102\b\u0010\u0011\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010\u0012\u001a\u00020\u0003H\u00d6\u0001J\t\u0010\u0013\u001a\u00020\u0014H\u00d6\u0001R\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0007\u0010\bR\u0011\u0010\u0004\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\t\u0010\bR\u0011\u0010\u0005\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\n\u0010\b\u00a8\u0006\u0015"}, d2 = {"Lcom/brainheartfitness/data/repository/HealthDataRepository$HeartRateStats;", "", "average", "", "max", "min", "(III)V", "getAverage", "()I", "getMax", "getMin", "component1", "component2", "component3", "copy", "equals", "", "other", "hashCode", "toString", "", "app_debug"})
    static final class HeartRateStats {
        private final int average = 0;
        private final int max = 0;
        private final int min = 0;
        
        public HeartRateStats(int average, int max, int min) {
            super();
        }
        
        public final int getAverage() {
            return 0;
        }
        
        public final int getMax() {
            return 0;
        }
        
        public final int getMin() {
            return 0;
        }
        
        public final int component1() {
            return 0;
        }
        
        public final int component2() {
            return 0;
        }
        
        public final int component3() {
            return 0;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final com.brainheartfitness.data.repository.HealthDataRepository.HeartRateStats copy(int average, int max, int min) {
            return null;
        }
        
        @java.lang.Override()
        public boolean equals(@org.jetbrains.annotations.Nullable()
        java.lang.Object other) {
            return false;
        }
        
        @java.lang.Override()
        public int hashCode() {
            return 0;
        }
        
        @java.lang.Override()
        @org.jetbrains.annotations.NotNull()
        public java.lang.String toString() {
            return null;
        }
    }
}