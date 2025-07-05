package com.brainheartfitness.ui.home;

@kotlin.Metadata(mv = {1, 9, 0}, k = 2, xi = 48, d1 = {"\u0000 \n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\t\u001a\b\u0010\u0000\u001a\u00020\u0001H\u0007\u001a\u001e\u0010\u0002\u001a\u00020\u00012\u0006\u0010\u0003\u001a\u00020\u00042\f\u0010\u0005\u001a\b\u0012\u0004\u0012\u00020\u00010\u0006H\u0007\u001a\u0012\u0010\u0007\u001a\u00020\u00012\b\b\u0002\u0010\b\u001a\u00020\tH\u0007\u001a0\u0010\n\u001a\u00020\u00012\u0006\u0010\u000b\u001a\u00020\u00042\u0006\u0010\f\u001a\u00020\u00042\b\u0010\r\u001a\u0004\u0018\u00010\u00042\f\u0010\u000e\u001a\b\u0012\u0004\u0012\u00020\u00010\u0006H\u0007\u001a\b\u0010\u000f\u001a\u00020\u0001H\u0007\u001a\b\u0010\u0010\u001a\u00020\u0001H\u0007\u001a\b\u0010\u0011\u001a\u00020\u0001H\u0007\u00a8\u0006\u0012"}, d2 = {"DownloadHealthConnectCard", "", "ErrorCard", "message", "", "onRetry", "Lkotlin/Function0;", "HomeScreen", "viewModel", "Lcom/brainheartfitness/ui/home/HomeViewModel;", "InfoCard", "title", "description", "buttonText", "onButtonClick", "LoadingCard", "NotSupportedCard", "UpdateHealthConnectCard", "app_debug"})
public final class HomeScreenKt {
    
    @kotlin.OptIn(markerClass = {androidx.compose.material3.ExperimentalMaterial3Api.class})
    @androidx.compose.runtime.Composable()
    public static final void HomeScreen(@org.jetbrains.annotations.NotNull()
    com.brainheartfitness.ui.home.HomeViewModel viewModel) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void LoadingCard() {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void ErrorCard(@org.jetbrains.annotations.NotNull()
    java.lang.String message, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onRetry) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void DownloadHealthConnectCard() {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void UpdateHealthConnectCard() {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void NotSupportedCard() {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void InfoCard(@org.jetbrains.annotations.NotNull()
    java.lang.String title, @org.jetbrains.annotations.NotNull()
    java.lang.String description, @org.jetbrains.annotations.Nullable()
    java.lang.String buttonText, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onButtonClick) {
    }
}