package com.brainheartfitness.ui;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000&\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\b\n\u0002\b\b\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\b7\u0018\u00002\u00020\u0001:\u0003\u000b\f\rB\u0017\b\u0004\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006R\u0011\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0007\u0010\bR\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\t\u0010\n\u0082\u0001\u0003\u000e\u000f\u0010\u00a8\u0006\u0011"}, d2 = {"Lcom/brainheartfitness/ui/Screen;", "", "route", "", "resourceId", "", "(Ljava/lang/String;I)V", "getResourceId", "()I", "getRoute", "()Ljava/lang/String;", "Explore", "Home", "Progress", "Lcom/brainheartfitness/ui/Screen$Explore;", "Lcom/brainheartfitness/ui/Screen$Home;", "Lcom/brainheartfitness/ui/Screen$Progress;", "app_debug"})
public abstract class Screen {
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String route = null;
    private final int resourceId = 0;
    
    private Screen(java.lang.String route, int resourceId) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getRoute() {
        return null;
    }
    
    public final int getResourceId() {
        return 0;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\f\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u00c7\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002\u00a8\u0006\u0003"}, d2 = {"Lcom/brainheartfitness/ui/Screen$Explore;", "Lcom/brainheartfitness/ui/Screen;", "()V", "app_debug"})
    public static final class Explore extends com.brainheartfitness.ui.Screen {
        @org.jetbrains.annotations.NotNull()
        public static final com.brainheartfitness.ui.Screen.Explore INSTANCE = null;
        
        private Explore() {
        }
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\f\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u00c7\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002\u00a8\u0006\u0003"}, d2 = {"Lcom/brainheartfitness/ui/Screen$Home;", "Lcom/brainheartfitness/ui/Screen;", "()V", "app_debug"})
    public static final class Home extends com.brainheartfitness.ui.Screen {
        @org.jetbrains.annotations.NotNull()
        public static final com.brainheartfitness.ui.Screen.Home INSTANCE = null;
        
        private Home() {
        }
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\f\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u00c7\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002\u00a8\u0006\u0003"}, d2 = {"Lcom/brainheartfitness/ui/Screen$Progress;", "Lcom/brainheartfitness/ui/Screen;", "()V", "app_debug"})
    public static final class Progress extends com.brainheartfitness.ui.Screen {
        @org.jetbrains.annotations.NotNull()
        public static final com.brainheartfitness.ui.Screen.Progress INSTANCE = null;
        
        private Progress() {
        }
    }
}