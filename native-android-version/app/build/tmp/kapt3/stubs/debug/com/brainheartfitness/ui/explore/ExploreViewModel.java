package com.brainheartfitness.ui.explore;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\u0005\b\u0007\u0018\u00002\u00020\u0001B\u0017\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\u0006\u0010\u000e\u001a\u00020\u000fJ\b\u0010\u0010\u001a\u00020\u000fH\u0002J\u000e\u0010\u0011\u001a\u00020\u000fH\u0082@\u00a2\u0006\u0002\u0010\u0012J\u0006\u0010\u0013\u001a\u00020\u000fR\u0014\u0010\u0007\u001a\b\u0012\u0004\u0012\u00020\t0\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0017\u0010\n\u001a\b\u0012\u0004\u0012\u00020\t0\u000b\u00a2\u0006\b\n\u0000\u001a\u0004\b\f\u0010\r\u00a8\u0006\u0014"}, d2 = {"Lcom/brainheartfitness/ui/explore/ExploreViewModel;", "Landroidx/lifecycle/ViewModel;", "healthDataRepository", "Lcom/brainheartfitness/data/repository/HealthDataRepository;", "healthConnectManager", "Lcom/brainheartfitness/data/health/HealthConnectManager;", "(Lcom/brainheartfitness/data/repository/HealthDataRepository;Lcom/brainheartfitness/data/health/HealthConnectManager;)V", "_uiState", "Lkotlinx/coroutines/flow/MutableStateFlow;", "Lcom/brainheartfitness/ui/explore/ExploreUiState;", "uiState", "Lkotlinx/coroutines/flow/StateFlow;", "getUiState", "()Lkotlinx/coroutines/flow/StateFlow;", "getRawDataDebugInfo", "", "loadRawData", "loadRawDataDebugInfo", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "refresh", "app_debug"})
@dagger.hilt.android.lifecycle.HiltViewModel()
public final class ExploreViewModel extends androidx.lifecycle.ViewModel {
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.repository.HealthDataRepository healthDataRepository = null;
    @org.jetbrains.annotations.NotNull()
    private final com.brainheartfitness.data.health.HealthConnectManager healthConnectManager = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.MutableStateFlow<com.brainheartfitness.ui.explore.ExploreUiState> _uiState = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.StateFlow<com.brainheartfitness.ui.explore.ExploreUiState> uiState = null;
    
    @javax.inject.Inject()
    public ExploreViewModel(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.repository.HealthDataRepository healthDataRepository, @org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.health.HealthConnectManager healthConnectManager) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final kotlinx.coroutines.flow.StateFlow<com.brainheartfitness.ui.explore.ExploreUiState> getUiState() {
        return null;
    }
    
    private final void loadRawData() {
    }
    
    public final void refresh() {
    }
    
    public final void getRawDataDebugInfo() {
    }
    
    private final java.lang.Object loadRawDataDebugInfo(kotlin.coroutines.Continuation<? super kotlin.Unit> $completion) {
        return null;
    }
}