package com.brainheartfitness.data;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000D\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0007\b\u0007\u0018\u0000 \u001b2\u00020\u0001:\u0001\u001bB\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\u0006\u0010\u000e\u001a\u00020\u000fJ\b\u0010\u0010\u001a\u0004\u0018\u00010\u0011J\u0006\u0010\u0012\u001a\u00020\u0013J\b\u0010\u0014\u001a\u00020\u0015H\u0002J\u000e\u0010\u0016\u001a\u00020\u00152\u0006\u0010\u0017\u001a\u00020\u0011J\u0006\u0010\u0018\u001a\u00020\u0015J\u000e\u0010\u0019\u001a\u00020\u00152\u0006\u0010\u001a\u001a\u00020\u000fR\u0014\u0010\u0005\u001a\b\u0012\u0004\u0012\u00020\u00070\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0017\u0010\b\u001a\b\u0012\u0004\u0012\u00020\u00070\t\u00a2\u0006\b\n\u0000\u001a\u0004\b\n\u0010\u000bR\u000e\u0010\f\u001a\u00020\rX\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u001c"}, d2 = {"Lcom/brainheartfitness/data/DataSourceManager;", "", "context", "Landroid/content/Context;", "(Landroid/content/Context;)V", "_dataSourceState", "Lkotlinx/coroutines/flow/MutableStateFlow;", "Lcom/brainheartfitness/data/DataSourceState;", "dataSourceState", "Lkotlinx/coroutines/flow/StateFlow;", "getDataSourceState", "()Lkotlinx/coroutines/flow/StateFlow;", "preferences", "Landroid/content/SharedPreferences;", "getCurrentSource", "Lcom/brainheartfitness/data/DataSourceType;", "getLastError", "", "isUsingRealData", "", "loadSavedDataSource", "", "reportRealDataError", "error", "reportRealDataSuccess", "setDataSource", "source", "Companion", "app_debug"})
public final class DataSourceManager {
    @org.jetbrains.annotations.NotNull()
    private final android.content.Context context = null;
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String PREF_NAME = "data_source_prefs";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String KEY_DATA_SOURCE = "data_source_type";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String TAG = "DataSourceManager";
    @org.jetbrains.annotations.NotNull()
    private final android.content.SharedPreferences preferences = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.MutableStateFlow<com.brainheartfitness.data.DataSourceState> _dataSourceState = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.StateFlow<com.brainheartfitness.data.DataSourceState> dataSourceState = null;
    @org.jetbrains.annotations.NotNull()
    public static final com.brainheartfitness.data.DataSourceManager.Companion Companion = null;
    
    public DataSourceManager(@org.jetbrains.annotations.NotNull()
    android.content.Context context) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final kotlinx.coroutines.flow.StateFlow<com.brainheartfitness.data.DataSourceState> getDataSourceState() {
        return null;
    }
    
    private final void loadSavedDataSource() {
    }
    
    public final void setDataSource(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.DataSourceType source) {
    }
    
    public final void reportRealDataError(@org.jetbrains.annotations.NotNull()
    java.lang.String error) {
    }
    
    public final void reportRealDataSuccess() {
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.brainheartfitness.data.DataSourceType getCurrentSource() {
        return null;
    }
    
    public final boolean isUsingRealData() {
        return false;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getLastError() {
        return null;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0014\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0003\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0007"}, d2 = {"Lcom/brainheartfitness/data/DataSourceManager$Companion;", "", "()V", "KEY_DATA_SOURCE", "", "PREF_NAME", "TAG", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
}