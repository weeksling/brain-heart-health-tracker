package com.brainheartfitness.ui.home;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000H\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\u000b\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u0007\u0018\u00002\u00020\u0001B\u001f\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u0012\u0006\u0010\u0006\u001a\u00020\u0007\u00a2\u0006\u0002\u0010\bJ\b\u0010\u0010\u001a\u00020\u0011H\u0002J\u000e\u0010\u0012\u001a\u00020\u0011H\u0082@\u00a2\u0006\u0002\u0010\u0013J\u0006\u0010\u0014\u001a\u00020\u0005J\b\u0010\u0015\u001a\u00020\u0011H\u0002J\b\u0010\u0016\u001a\u00020\u0011H\u0002J\b\u0010\u0017\u001a\u00020\u0011H\u0002J\u0006\u0010\u0018\u001a\u00020\u0011J\u0006\u0010\u0019\u001a\u00020\u0011J\u0006\u0010\u001a\u001a\u00020\u0011J\u000e\u0010\u001b\u001a\u00020\u00112\u0006\u0010\u001c\u001a\u00020\u001dJ\u000e\u0010\u001e\u001a\u00020\u00112\u0006\u0010\u001f\u001a\u00020 J\u0006\u0010!\u001a\u00020\u0011R\u0014\u0010\t\u001a\b\u0012\u0004\u0012\u00020\u000b0\nX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0007X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0017\u0010\f\u001a\b\u0012\u0004\u0012\u00020\u000b0\r\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\u000f\u00a8\u0006\""}, d2 = {"Lcom/brainheartfitness/ui/home/HomeViewModel;", "Landroidx/lifecycle/ViewModel;", "healthDataRepository", "Lcom/brainheartfitness/data/repository/HealthDataRepository;", "healthConnectManager", "Lcom/brainheartfitness/data/health/HealthConnectManager;", "dataSourceManager", "Lcom/brainheartfitness/data/DataSourceManager;", "(Lcom/brainheartfitness/data/repository/HealthDataRepository;Lcom/brainheartfitness/data/health/HealthConnectManager;Lcom/brainheartfitness/data/DataSourceManager;)V", "_uiState", "Lkotlinx/coroutines/flow/MutableStateFlow;", "Lcom/brainheartfitness/ui/home/HomeUiState;", "uiState", "Lkotlinx/coroutines/flow/StateFlow;", "getUiState", "()Lkotlinx/coroutines/flow/StateFlow;", "checkHealthConnectAvailability", "", "checkPermissions", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getHealthConnectManager", "loadDailyData", "loadWeeklyData", "observeDataSourceState", "onPermissionsDenied", "onPermissionsGranted", "retry", "setActiveTab", "timeRange", "Lcom/brainheartfitness/data/model/TimeRange;", "setDataSource", "dataSourceType", "Lcom/brainheartfitness/data/DataSourceType;", "toggleDataSource", "app_debug"})
@dagger.hilt.android.lifecycle.HiltViewModel()
public final class HomeViewModel extends androidx.lifecycle.ViewModel {
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.repository.HealthDataRepository healthDataRepository = null;
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.health.HealthConnectManager healthConnectManager = null;
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.DataSourceManager dataSourceManager = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.MutableStateFlow<com.brainheartfitness.ui.home.HomeUiState> _uiState = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.StateFlow<com.brainheartfitness.ui.home.HomeUiState> uiState = null;
    
    @javax.inject.Inject()
    public HomeViewModel(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.repository.HealthDataRepository healthDataRepository, @org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.health.HealthConnectManager healthConnectManager, @org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.DataSourceManager dataSourceManager) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final kotlinx.coroutines.flow.StateFlow<com.brainheartfitness.ui.home.HomeUiState> getUiState() {
        return null;
    }
    
    private final void observeDataSourceState() {
    }
    
    public final void setActiveTab(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.model.TimeRange timeRange) {
    }
    
    public final void toggleDataSource() {
    }
    
    public final void setDataSource(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.DataSourceType dataSourceType) {
    }
    
    public final void onPermissionsGranted() {
    }
    
    public final void onPermissionsDenied() {
    }
    
    public final void retry() {
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.brainheartfitness.data.health.HealthConnectManager getHealthConnectManager() {
        return null;
    }
    
    private final void checkHealthConnectAvailability() {
    }
    
    private final java.lang.Object checkPermissions(kotlin.coroutines.Continuation<? super kotlin.Unit> $completion) {
        return null;
    }
    
    private final void loadWeeklyData() {
    }
    
    private final void loadDailyData() {
    }
}