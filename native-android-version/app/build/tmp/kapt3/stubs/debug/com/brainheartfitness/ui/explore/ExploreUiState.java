package com.brainheartfitness.ui.explore;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000,\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0010\n\u0002\u0010\b\n\u0002\b\u0002\b\u0087\b\u0018\u00002\u00020\u0001B3\u0012\b\b\u0002\u0010\u0002\u001a\u00020\u0003\u0012\n\b\u0002\u0010\u0004\u001a\u0004\u0018\u00010\u0005\u0012\n\b\u0002\u0010\u0006\u001a\u0004\u0018\u00010\u0007\u0012\n\b\u0002\u0010\b\u001a\u0004\u0018\u00010\t\u00a2\u0006\u0002\u0010\nJ\t\u0010\u0012\u001a\u00020\u0003H\u00c6\u0003J\u000b\u0010\u0013\u001a\u0004\u0018\u00010\u0005H\u00c6\u0003J\u000b\u0010\u0014\u001a\u0004\u0018\u00010\u0007H\u00c6\u0003J\u000b\u0010\u0015\u001a\u0004\u0018\u00010\tH\u00c6\u0003J7\u0010\u0016\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\n\b\u0002\u0010\u0004\u001a\u0004\u0018\u00010\u00052\n\b\u0002\u0010\u0006\u001a\u0004\u0018\u00010\u00072\n\b\u0002\u0010\b\u001a\u0004\u0018\u00010\tH\u00c6\u0001J\u0013\u0010\u0017\u001a\u00020\u00032\b\u0010\u0018\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010\u0019\u001a\u00020\u001aH\u00d6\u0001J\t\u0010\u001b\u001a\u00020\tH\u00d6\u0001R\u0013\u0010\u0006\u001a\u0004\u0018\u00010\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000b\u0010\fR\u0013\u0010\b\u001a\u0004\u0018\u00010\t\u00a2\u0006\b\n\u0000\u001a\u0004\b\r\u0010\u000eR\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0002\u0010\u000fR\u0013\u0010\u0004\u001a\u0004\u0018\u00010\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0010\u0010\u0011\u00a8\u0006\u001c"}, d2 = {"Lcom/brainheartfitness/ui/explore/ExploreUiState;", "", "isLoading", "", "weeklyData", "Lcom/brainheartfitness/data/model/WeeklyHealthSummary;", "dailyData", "Lcom/brainheartfitness/data/model/DailyHealthSummary;", "error", "", "(ZLcom/brainheartfitness/data/model/WeeklyHealthSummary;Lcom/brainheartfitness/data/model/DailyHealthSummary;Ljava/lang/String;)V", "getDailyData", "()Lcom/brainheartfitness/data/model/DailyHealthSummary;", "getError", "()Ljava/lang/String;", "()Z", "getWeeklyData", "()Lcom/brainheartfitness/data/model/WeeklyHealthSummary;", "component1", "component2", "component3", "component4", "copy", "equals", "other", "hashCode", "", "toString", "app_debug"})
public final class ExploreUiState {
    private final boolean isLoading = false;
    @org.jetbrains.annotations.Nullable()
    private final com.brainheartfitness.data.model.WeeklyHealthSummary weeklyData = null;
    @org.jetbrains.annotations.Nullable()
    private final com.brainheartfitness.data.model.DailyHealthSummary dailyData = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String error = null;
    
    public ExploreUiState(boolean isLoading, @org.jetbrains.annotations.Nullable()
    com.brainheartfitness.data.model.WeeklyHealthSummary weeklyData, @org.jetbrains.annotations.Nullable()
    com.brainheartfitness.data.model.DailyHealthSummary dailyData, @org.jetbrains.annotations.Nullable()
    java.lang.String error) {
        super();
    }
    
    public final boolean isLoading() {
        return false;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.brainheartfitness.data.model.WeeklyHealthSummary getWeeklyData() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.brainheartfitness.data.model.DailyHealthSummary getDailyData() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getError() {
        return null;
    }
    
    public ExploreUiState() {
        super();
    }
    
    public final boolean component1() {
        return false;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.brainheartfitness.data.model.WeeklyHealthSummary component2() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.brainheartfitness.data.model.DailyHealthSummary component3() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component4() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.brainheartfitness.ui.explore.ExploreUiState copy(boolean isLoading, @org.jetbrains.annotations.Nullable()
    com.brainheartfitness.data.model.WeeklyHealthSummary weeklyData, @org.jetbrains.annotations.Nullable()
    com.brainheartfitness.data.model.DailyHealthSummary dailyData, @org.jetbrains.annotations.Nullable()
    java.lang.String error) {
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