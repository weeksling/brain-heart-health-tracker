package com.brainheartfitness.ui.home;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00004\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0015\n\u0002\u0010\b\n\u0002\b\u0002\b\u0087\b\u0018\u00002\u00020\u0001BE\u0012\b\b\u0002\u0010\u0002\u001a\u00020\u0003\u0012\b\b\u0002\u0010\u0004\u001a\u00020\u0005\u0012\b\b\u0002\u0010\u0006\u001a\u00020\u0007\u0012\b\b\u0002\u0010\b\u001a\u00020\u0007\u0012\n\b\u0002\u0010\t\u001a\u0004\u0018\u00010\n\u0012\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\f\u00a2\u0006\u0002\u0010\rJ\t\u0010\u0018\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0019\u001a\u00020\u0005H\u00c6\u0003J\t\u0010\u001a\u001a\u00020\u0007H\u00c6\u0003J\t\u0010\u001b\u001a\u00020\u0007H\u00c6\u0003J\u000b\u0010\u001c\u001a\u0004\u0018\u00010\nH\u00c6\u0003J\u000b\u0010\u001d\u001a\u0004\u0018\u00010\fH\u00c6\u0003JI\u0010\u001e\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00052\b\b\u0002\u0010\u0006\u001a\u00020\u00072\b\b\u0002\u0010\b\u001a\u00020\u00072\n\b\u0002\u0010\t\u001a\u0004\u0018\u00010\n2\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\fH\u00c6\u0001J\u0013\u0010\u001f\u001a\u00020\u00072\b\u0010 \u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010!\u001a\u00020\"H\u00d6\u0001J\t\u0010#\u001a\u00020\fH\u00d6\u0001R\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\u000fR\u0013\u0010\t\u001a\u0004\u0018\u00010\n\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0010\u0010\u0011R\u0013\u0010\u000b\u001a\u0004\u0018\u00010\f\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u0013R\u0011\u0010\u0006\u001a\u00020\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0014\u0010\u0015R\u0011\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0016\u0010\u0017R\u0011\u0010\b\u001a\u00020\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\b\u0010\u0015\u00a8\u0006$"}, d2 = {"Lcom/brainheartfitness/ui/home/HomeUiState;", "", "activeTab", "Lcom/brainheartfitness/data/model/TimeRange;", "healthConnectState", "Lcom/brainheartfitness/data/model/HealthConnectState;", "hasPermissions", "", "isLoading", "currentData", "Lcom/brainheartfitness/data/model/ProgressData;", "error", "", "(Lcom/brainheartfitness/data/model/TimeRange;Lcom/brainheartfitness/data/model/HealthConnectState;ZZLcom/brainheartfitness/data/model/ProgressData;Ljava/lang/String;)V", "getActiveTab", "()Lcom/brainheartfitness/data/model/TimeRange;", "getCurrentData", "()Lcom/brainheartfitness/data/model/ProgressData;", "getError", "()Ljava/lang/String;", "getHasPermissions", "()Z", "getHealthConnectState", "()Lcom/brainheartfitness/data/model/HealthConnectState;", "component1", "component2", "component3", "component4", "component5", "component6", "copy", "equals", "other", "hashCode", "", "toString", "app_debug"})
public final class HomeUiState {
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.model.TimeRange activeTab = null;
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.model.HealthConnectState healthConnectState = null;
    private final boolean hasPermissions = false;
    private final boolean isLoading = false;
    @org.jetbrains.annotations.Nullable()
    private final com.brainheartfitness.data.model.ProgressData currentData = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String error = null;
    
    public HomeUiState(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.model.TimeRange activeTab, @org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.model.HealthConnectState healthConnectState, boolean hasPermissions, boolean isLoading, @org.jetbrains.annotations.Nullable()
    com.brainheartfitness.data.model.ProgressData currentData, @org.jetbrains.annotations.Nullable()
    java.lang.String error) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.brainheartfitness.data.model.TimeRange getActiveTab() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.brainheartfitness.data.model.HealthConnectState getHealthConnectState() {
        return null;
    }
    
    public final boolean getHasPermissions() {
        return false;
    }
    
    public final boolean isLoading() {
        return false;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.brainheartfitness.data.model.ProgressData getCurrentData() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getError() {
        return null;
    }
    
    public HomeUiState() {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.brainheartfitness.data.model.TimeRange component1() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.brainheartfitness.data.model.HealthConnectState component2() {
        return null;
    }
    
    public final boolean component3() {
        return false;
    }
    
    public final boolean component4() {
        return false;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.brainheartfitness.data.model.ProgressData component5() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component6() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.brainheartfitness.ui.home.HomeUiState copy(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.model.TimeRange activeTab, @org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.model.HealthConnectState healthConnectState, boolean hasPermissions, boolean isLoading, @org.jetbrains.annotations.Nullable()
    com.brainheartfitness.data.model.ProgressData currentData, @org.jetbrains.annotations.Nullable()
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