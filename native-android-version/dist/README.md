# Brain Heart Fitness - Native Android APK

This folder contains the compiled APK file for the Brain Heart Fitness app, converted from React Native to native Android.

## 📱 APK Details

- **File**: `BrainHeartFitness-debug.apk`
- **Size**: ~13MB
- **Type**: Debug build (for testing)
- **Target**: Android 8.0+ (API 26+)
- **Architecture**: Universal (supports all Android architectures)

## 🚀 Installation

### Method 1: ADB Install (Recommended)
```bash
adb install BrainHeartFitness-debug.apk
```

### Method 2: Direct Install on Device
1. Transfer the APK file to your Android device
2. Enable "Install from Unknown Sources" in your device settings
3. Open the APK file on your device to install

## 🎯 Features

The native Android app includes:

- **Direct Health Connect Integration**: No React Native wrapper needed
- **Modern UI**: Jetpack Compose with Material Design 3
- **Heart Rate Zone Tracking**: 5 zones with color-coded progress
- **Daily/Weekly Goals**: 150 minutes Zone 2+ activity tracking
- **Permission Management**: Proper Health Connect permissions
- **Offline Mode**: Dummy data generation for testing without health data

## 🏗️ Technical Details

- **Architecture**: MVVM + Hilt + Jetpack Compose
- **Language**: 100% Kotlin
- **Performance**: ~30-40% smaller than React Native equivalent
- **Direct API Access**: Native Health Connect client
- **Dependencies**: Modern AndroidX libraries

## 📊 App Functionality

1. **Home Screen**: Daily/Weekly toggle with heart rate zone breakdown
2. **Progress Screen**: Weekly progress charts and goal tracking
3. **Permissions**: Health Connect permission request and management
4. **Dummy Data**: Generates realistic test data when Health Connect unavailable

## 🔧 Development Notes

This is a **debug build** suitable for:
- Testing and development
- Demonstration purposes
- Feature validation
- Performance comparison with React Native version

For production deployment, build a release APK with:
```bash
./gradlew assembleRelease
```

## 📋 Requirements

- Android 8.0+ (API 26+)
- Health Connect (optional - app works with dummy data)
- ~20MB free storage space

## 🎨 Native Android Benefits

Compared to the React Native version:
- **Smaller APK size** (no JavaScript runtime)
- **Better performance** (no bridge overhead)
- **Direct API access** (no wrapper libraries)
- **Modern architecture** (latest Android best practices)
- **Type safety** (Kotlin's null safety and type system)

---

Built with ❤️ using modern Android development practices.