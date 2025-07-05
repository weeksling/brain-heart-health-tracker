# Build Issues Analysis & Solutions

## Overview
Your Brain Heart Fitness Tracker app is failing to build when using `expo run:android` or EAS Build, despite working fine in Expo Go. The issues are primarily related to **react-native-health-connect** library compatibility with your current Expo SDK version.

## Root Causes Identified

### 1. **Version Compatibility Issues**
- **Current Setup**: Expo SDK 53 (React Native 0.79.4) + `react-native-health-connect` v3.3.3
- **Problem**: This combination has known compatibility issues
- **Evidence**: Research shows multiple reports of build failures with this setup

### 2. **Missing Build Properties Configuration**
- **Issue**: Your `app.json` correctly sets `minSdkVersion: 26` but doesn't configure the build properties plugin
- **Problem**: The minSdkVersion setting only applies to the generated manifest, not the actual build configuration
- **Required**: `expo-build-properties` plugin configuration

### 3. **Health Connect Plugin Issues**
- **Issue**: The `react-native-health-connect` plugin has known issues with Android manifest generation
- **Problem**: Missing intent filters and proper permission configuration
- **Evidence**: Multiple GitHub issues report similar problems

### 4. **New Architecture Compatibility**
- **Issue**: SDK 53 enables New Architecture by default
- **Problem**: `react-native-health-connect` v3.3.3 may not be fully compatible with New Architecture
- **Impact**: Can cause build failures and runtime issues

## Solutions (Recommended Order)

### Solution 1: Fix Build Properties Configuration

Add the `expo-build-properties` plugin to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 26,
            "compileSdkVersion": 34,
            "targetSdkVersion": 34,
            "buildToolsVersion": "34.0.0"
          }
        }
      ],
      [
        "react-native-health-connect",
        {
          "permissions": [
            "android.permission.health.READ_HEART_RATE",
            "android.permission.health.READ_STEPS", 
            "android.permission.health.READ_EXERCISE"
          ]
        }
      ]
    ]
  }
}
```

### Solution 2: Update Health Connect Library

Consider upgrading to a more recent version or switching to an alternative:

**Option A - Update react-native-health-connect:**
```bash
npx expo install react-native-health-connect@latest
```

**Option B - Switch to expo-health (if available):**
```bash
npx expo install expo-health
```

**Option C - Use kingstinct/react-native-healthkit (more actively maintained):**
```bash
npm install @kingstinct/react-native-healthkit
```

### Solution 3: Add Custom Android Manifest Plugin

Create a custom plugin to ensure proper Android manifest configuration:

```javascript
// plugins/android-health-connect.js
const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withHealthConnect(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults.manifest;
    
    // Add Health Connect intent filter
    if (androidManifest.application?.[0]?.activity) {
      androidManifest.application[0].activity[0]['intent-filter'].push({
        action: [
          {
            $: {
              'android:name': 'androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE',
            },
          },
        ],
      });
    }
    
    // Add Health Connect provider
    if (!androidManifest.application[0].provider) {
      androidManifest.application[0].provider = [];
    }
    
    androidManifest.application[0].provider.push({
      $: {
        'android:name': 'androidx.health.connect.client.HealthConnectClient',
        'android:authorities': '${applicationId}.healthconnect',
        'android:exported': 'false',
      },
    });
    
    return config;
  });
};
```

Then add to your `app.json`:
```json
{
  "expo": {
    "plugins": [
      "./plugins/android-health-connect.js",
      // ... other plugins
    ]
  }
}
```

### Solution 4: Disable New Architecture (Temporary)

If the above solutions don't work, temporarily disable New Architecture:

```json
{
  "expo": {
    "newArchEnabled": false,
    // ... rest of config
  }
}
```

### Solution 5: Alternative Health Connect Implementation

Consider using a more modern approach with Expo Modules API:

```bash
npx create-expo-module@latest --local health-connect
```

This would create a local module that you can customize for your specific needs.

## Build Commands to Try

After implementing the solutions:

1. **Clean and rebuild:**
```bash
npx expo prebuild --clean
npx expo run:android
```

2. **Or for EAS Build:**
```bash
eas build --platform android --clear-cache
```

## Alternative Approach: Use Development Build

If you continue having issues, consider creating a development build specifically for Health Connect:

```bash
# Install dev client
npx expo install expo-dev-client

# Create development build
npx expo run:android
```

## Verification Steps

1. **Check if Health Connect is installed** on your target device
2. **Verify permissions** are properly configured in the Android manifest
3. **Test the build** on a physical device with Health Connect app installed
4. **Monitor logs** for any Health Connect initialization errors

## Next Steps

1. Start with **Solution 1** (Build Properties) - this is the most likely fix
2. If that doesn't work, try **Solution 2** (Update library)
3. Consider **Solution 3** (Custom plugin) for manifest issues
4. Use **Solution 4** (Disable New Architecture) as a last resort

## Important Notes

- The `android/` directory you mentioned adding config to manually will be overwritten by prebuild
- Always use config plugins for native configuration when using managed workflow
- Test on physical Android device with Health Connect app installed
- Consider implementing graceful fallbacks when Health Connect is not available

This analysis should help you resolve the build issues systematically. Start with the first solution and work your way through them.