package com.brainheartfitness.data.model;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000.\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0003\n\u0002\u0010$\n\u0002\u0010\u000e\n\u0002\b\u0012\n\u0002\u0010\u000b\n\u0002\b\u0004\b\u0087\b\u0018\u00002\u00020\u0001BA\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0003\u0012\u0006\u0010\u0005\u001a\u00020\u0006\u0012\u0006\u0010\u0007\u001a\u00020\u0006\u0012\u0006\u0010\b\u001a\u00020\u0006\u0012\u0012\u0010\t\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00060\n\u00a2\u0006\u0002\u0010\fJ\t\u0010\u0016\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0017\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0018\u001a\u00020\u0006H\u00c6\u0003J\t\u0010\u0019\u001a\u00020\u0006H\u00c6\u0003J\t\u0010\u001a\u001a\u00020\u0006H\u00c6\u0003J\u0015\u0010\u001b\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00060\nH\u00c6\u0003JQ\u0010\u001c\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00032\b\b\u0002\u0010\u0005\u001a\u00020\u00062\b\b\u0002\u0010\u0007\u001a\u00020\u00062\b\b\u0002\u0010\b\u001a\u00020\u00062\u0014\b\u0002\u0010\t\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00060\nH\u00c6\u0001J\u0013\u0010\u001d\u001a\u00020\u001e2\b\u0010\u001f\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010 \u001a\u00020\u0006H\u00d6\u0001J\t\u0010!\u001a\u00020\u000bH\u00d6\u0001R\u0011\u0010\u0005\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\r\u0010\u000eR\u0011\u0010\u0004\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000f\u0010\u0010R\u0011\u0010\u0007\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0011\u0010\u000eR\u0011\u0010\b\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u000eR\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0013\u0010\u0010R\u001d\u0010\t\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00060\n\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0014\u0010\u0015\u00a8\u0006\""}, d2 = {"Lcom/brainheartfitness/data/model/HeartRateSession;", "", "startTime", "Ljava/time/Instant;", "endTime", "averageBpm", "", "maxBpm", "minBpm", "zoneMinutes", "", "", "(Ljava/time/Instant;Ljava/time/Instant;IIILjava/util/Map;)V", "getAverageBpm", "()I", "getEndTime", "()Ljava/time/Instant;", "getMaxBpm", "getMinBpm", "getStartTime", "getZoneMinutes", "()Ljava/util/Map;", "component1", "component2", "component3", "component4", "component5", "component6", "copy", "equals", "", "other", "hashCode", "toString", "app_debug"})
public final class HeartRateSession {
    @org.jetbrains.annotations.NotNull()
    private final java.time.Instant startTime = null;
    @org.jetbrains.annotations.NotNull()
    private final java.time.Instant endTime = null;
    private final int averageBpm = 0;
    private final int maxBpm = 0;
    private final int minBpm = 0;
    @org.jetbrains.annotations.NotNull()
    private final java.util.Map<java.lang.String, java.lang.Integer> zoneMinutes = null;
    
    public HeartRateSession(@org.jetbrains.annotations.NotNull()
    java.time.Instant startTime, @org.jetbrains.annotations.NotNull()
    java.time.Instant endTime, int averageBpm, int maxBpm, int minBpm, @org.jetbrains.annotations.NotNull()
    java.util.Map<java.lang.String, java.lang.Integer> zoneMinutes) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.time.Instant getStartTime() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.time.Instant getEndTime() {
        return null;
    }
    
    public final int getAverageBpm() {
        return 0;
    }
    
    public final int getMaxBpm() {
        return 0;
    }
    
    public final int getMinBpm() {
        return 0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.Map<java.lang.String, java.lang.Integer> getZoneMinutes() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.time.Instant component1() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.time.Instant component2() {
        return null;
    }
    
    public final int component3() {
        return 0;
    }
    
    public final int component4() {
        return 0;
    }
    
    public final int component5() {
        return 0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.Map<java.lang.String, java.lang.Integer> component6() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.brainheartfitness.data.model.HeartRateSession copy(@org.jetbrains.annotations.NotNull()
    java.time.Instant startTime, @org.jetbrains.annotations.NotNull()
    java.time.Instant endTime, int averageBpm, int maxBpm, int minBpm, @org.jetbrains.annotations.NotNull()
    java.util.Map<java.lang.String, java.lang.Integer> zoneMinutes) {
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