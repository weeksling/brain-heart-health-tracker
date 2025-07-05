package com.brainheartfitness.ui.home;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00008\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\t\n\u0002\u0018\u0002\n\u0000\b\u0007\u0018\u00002\u00020\u0001B\u0017\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\b\u0010\u000e\u001a\u00020\u000fH\u0002J\u000e\u0010\u0010\u001a\u00020\u000fH\u0082@\u00a2\u0006\u0002\u0010\u0011J\b\u0010\u0012\u001a\u00020\u000fH\u0002J\b\u0010\u0013\u001a\u00020\u000fH\u0002J\u0006\u0010\u0014\u001a\u00020\u000fJ\u0006\u0010\u0015\u001a\u00020\u000fJ\u0006\u0010\u0016\u001a\u00020\u000fJ\u000e\u0010\u0017\u001a\u00020\u000f2\u0006\u0010\u0018\u001a\u00020\u0019R\u0014\u0010\u0007\u001a\b\u0012\u0004\u0012\u00020\t0\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0017\u0010\n\u001a\b\u0012\u0004\u0012\u00020\t0\u000b\u00a2\u0006\b\n\u0000\u001a\u0004\b\f\u0010\r\u00a8\u0006\u001a"}, d2 = {"Lcom/brainheartfitness/ui/home/HomeViewModel;", "Landroidx/lifecycle/ViewModel;", "healthDataRepository", "Lcom/brainheartfitness/data/repository/HealthDataRepository;", "healthConnectManager", "Lcom/brainheartfitness/data/health/HealthConnectManager;", "(Lcom/brainheartfitness/data/repository/HealthDataRepository;Lcom/brainheartfitness/data/health/HealthConnectManager;)V", "_uiState", "Lkotlinx/coroutines/flow/MutableStateFlow;", "Lcom/brainheartfitness/ui/home/HomeUiState;", "uiState", "Lkotlinx/coroutines/flow/StateFlow;", "getUiState", "()Lkotlinx/coroutines/flow/StateFlow;", "checkHealthConnectAvailability", "", "checkPermissions", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "loadDailyData", "loadWeeklyData", "onPermissionsDenied", "onPermissionsGranted", "retry", "setActiveTab", "timeRange", "Lcom/brainheartfitness/data/model/TimeRange;", "app_debug"})
@dagger.hilt.android.lifecycle.HiltViewModel()
public final class HomeViewModel extends androidx.lifecycle.ViewModel {
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.repository.HealthDataRepository healthDataRepository = null;
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.health.HealthConnectManager healthConnectManager = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.MutableStateFlow<com.brainheartfitness.ui.home.HomeUiState> _uiState = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.StateFlow<com.brainheartfitness.ui.home.HomeUiState> uiState = null;
    
    @javax.inject.Inject()
    public HomeViewModel(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.repository.HealthDataRepository healthDataRepository, @org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.health.HealthConnectManager healthConnectManager) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final kotlinx.coroutines.flow.StateFlow<com.brainheartfitness.ui.home.HomeUiState> getUiState() {
        return null;
    }
    
    public final void setActiveTab(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.model.TimeRange timeRange) {
    }
    
    public final void onPermissionsGranted() {
    }
    
    public final void onPermissionsDenied() {
    }
    
    public final void retry() {
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