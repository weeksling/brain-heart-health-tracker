package com.brainheartfitness.ui.explore;

@kotlin.Metadata(mv = {1, 9, 0}, k = 2, xi = 48, d1 = {"\u0000<\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0010 \n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\u001a\u0012\u0010\u0000\u001a\u00020\u00012\b\u0010\u0002\u001a\u0004\u0018\u00010\u0003H\u0007\u001a\u0018\u0010\u0004\u001a\u00020\u00012\u0006\u0010\u0005\u001a\u00020\u00062\u0006\u0010\u0007\u001a\u00020\u0006H\u0007\u001a\u0012\u0010\b\u001a\u00020\u00012\b\b\u0002\u0010\t\u001a\u00020\nH\u0007\u001a\u0018\u0010\u000b\u001a\u00020\u00012\u0006\u0010\f\u001a\u00020\r2\u0006\u0010\u000e\u001a\u00020\u000fH\u0007\u001a\u0016\u0010\u0010\u001a\u00020\u00012\f\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\r0\u0012H\u0007\u001a\u0012\u0010\u0013\u001a\u00020\u00012\b\u0010\u0014\u001a\u0004\u0018\u00010\u0015H\u0007\u00a8\u0006\u0016"}, d2 = {"DailyDataCard", "", "dailyData", "Lcom/brainheartfitness/data/model/DailyHealthSummary;", "DataRow", "label", "", "value", "ExploreScreen", "viewModel", "Lcom/brainheartfitness/ui/explore/ExploreViewModel;", "SessionItem", "session", "Lcom/brainheartfitness/data/model/HeartRateSession;", "sessionNumber", "", "SessionsCard", "sessions", "", "WeeklyDataCard", "weeklyData", "Lcom/brainheartfitness/data/model/WeeklyHealthSummary;", "app_debug"})
public final class ExploreScreenKt {
    
    @kotlin.OptIn(markerClass = {androidx.compose.material3.ExperimentalMaterial3Api.class})
    @androidx.compose.runtime.Composable()
    public static final void ExploreScreen(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.ui.explore.ExploreViewModel viewModel) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void WeeklyDataCard(@org.jetbrains.annotations.Nullable()
    com.brainheartfitness.data.model.WeeklyHealthSummary weeklyData) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void DailyDataCard(@org.jetbrains.annotations.Nullable()
    com.brainheartfitness.data.model.DailyHealthSummary dailyData) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void SessionsCard(@org.jetbrains.annotations.NotNull()
    java.util.List<com.brainheartfitness.data.model.HeartRateSession> sessions) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void SessionItem(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.data.model.HeartRateSession session, int sessionNumber) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void DataRow(@org.jetbrains.annotations.NotNull()
    java.lang.String label, @org.jetbrains.annotations.NotNull()
    java.lang.String value) {
    }
}