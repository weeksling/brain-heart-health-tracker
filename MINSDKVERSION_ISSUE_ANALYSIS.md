# minSdkVersion Issue Analysis - Expo SDK 53

## Problem Summary

Your Expo SDK 53 project is ignoring the `minSdkVersion: 26` configuration in `app.json` and defaulting to `minSdkVersion: 24`. This is preventing you from using the `react-native-health-connect` library which requires API level 26+.

## Root Cause

The issue is with the **ExpoRootProject Gradle plugin** in Expo SDK 53. From your gradle output:

```
[ExpoRootProject] Using the following versions:
  - minSdk:      24
  - compileSdk:  35
  - targetSdk:   35
```

The ExpoRootProject plugin is hardcoding `minSdk: 24` and completely ignoring your `app.json` configuration.

## This is a Known Issue in Expo SDK 53

Based on my research, this appears to be a regression in Expo SDK 53 where the minSdkVersion configuration is not being properly read from the app config by the ExpoRootProject plugin.

## Solutions (in order of recommendation)

### Solution 1: Downgrade to Expo SDK 52 (Recommended)

Since you mentioned you can't use Expo Go anyway (you need native APIs), downgrading to SDK 52 is the most reliable solution:

```bash
# Downgrade to Expo SDK 52
npx expo install expo@^52.0.0 --fix

# Clean up
rm -rf node_modules
npm install

# Update any dependencies that might be incompatible
npx expo install --fix
```

**Why this works**: Expo SDK 52 properly respects the minSdkVersion configuration from app.json. In SDK 52, you can see this was working correctly as noted in the changelog: "Android minSdkVersion and compileSdkVersion bumped from 23 to 24".

### Solution 2: Override in Android Gradle Configuration

If you want to stay on SDK 53, you can directly override the minSdkVersion in your Android gradle files:

**Option A: Override in `android/build.gradle`**

Add this to your `android/build.gradle` file:

```gradle
ext {
    minSdkVersion = 26
    compileSdkVersion = 35
    targetSdkVersion = 35
}
```

**Option B: Use expo-build-properties plugin**

Add this to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "react-native-health-connect",
        {
          "permissions": [
            "android.permission.health.READ_HEART_RATE",
            "android.permission.health.READ_STEPS",
            "android.permission.health.READ_EXERCISE"
          ]
        }
      ],
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 26
          }
        }
      ]
    ]
  }
}
```

### Solution 3: Create a Config Plugin

Create a custom config plugin to force the minSdkVersion:

**plugins/android-minsdk-plugin.js**:
```javascript
const { withAndroidManifest } = require('@expo/config-plugins');

function withMinSdkVersion(config) {
  return withAndroidManifest(config, async config => {
    const androidManifest = config.modResults;
    
    // Set minimum SDK version
    if (!androidManifest.manifest['uses-sdk']) {
      androidManifest.manifest['uses-sdk'] = [{}];
    }
    
    androidManifest.manifest['uses-sdk'][0]['$'] = {
      ...androidManifest.manifest['uses-sdk'][0]['$'],
      'android:minSdkVersion': '26'
    };
    
    return config;
  });
}

module.exports = withMinSdkVersion;
```

Then add it to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      "./plugins/android-minsdk-plugin",
      // ... other plugins
    ]
  }
}
```

## My Recommendation

**Go with Solution 1 (Downgrade to Expo SDK 52)** for the following reasons:

1. **Reliability**: SDK 52 properly handles minSdkVersion configuration
2. **Stability**: SDK 52 is more mature and has fewer breaking changes
3. **Health Connect Support**: SDK 52 supports React Native 0.76, which is perfectly fine for health-connect
4. **Less Complexity**: No need for workarounds or custom plugins
5. **Development Builds**: Since you're already using development builds (not Expo Go), you won't lose any functionality

## Steps to Implement the Downgrade

1. **Backup your current state**:
   ```bash
   git add . && git commit -m "Backup before SDK downgrade"
   ```

2. **Downgrade to SDK 52**:
   ```bash
   npx expo install expo@^52.0.0 --fix
   ```

3. **Clean install dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Update your app.json if needed** (check if any SDK 53 specific config needs to be removed)

5. **Test your health-connect integration**:
   ```bash
   npx expo run:android
   ```

6. **Verify the minSdkVersion is working**:
   ```bash
   cd android && ./gradlew properties | grep -i sdk
   ```

## Additional Notes

- Expo SDK 53 introduced the New Architecture by default, but this shouldn't affect your health-connect usage
- Your current `app.json` configuration with `minSdkVersion: 26` is correct and should work fine in SDK 52
- The react-native-health-connect library version 3.3.3 that you're using is compatible with both SDK 52 and 53

## Verification Commands

After implementing the solution, verify it works:

```bash
# Check your Expo config resolves correctly
npx expo config | grep -A 10 -B 10 "minSdkVersion"

# Check Android gradle properties
cd android && ./gradlew properties | grep -i "sdk\|min\|compile\|target"

# Build and test
npx expo run:android
```

Your health-connect integration should work properly once the minSdkVersion is correctly set to 26.