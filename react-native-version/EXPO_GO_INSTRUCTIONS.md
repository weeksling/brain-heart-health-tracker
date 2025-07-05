# Running Brain Heart Fitness Tracker in Expo Go

## Overview
This app uses Android Health Connect to track heart rate data. When running in Expo Go, Health Connect is not available, so the app will use simulated data for demonstration purposes.

## Running in Expo Go

1. **Install Expo Go** on your Android device from Google Play Store

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Scan the QR code** with Expo Go app

4. **What to expect**:
   - The app will detect it's running in Expo Go
   - It will automatically use simulated heart rate data
   - You'll see a demo of the app's features with dummy data
   - All UI and functionality will work normally

## Building for Production

To use real Health Connect data, you need to build the app:

### Prerequisites
- Android device with Health Connect installed
- EAS CLI: `npm install -g eas-cli`

### Build Steps

1. **Configure EAS** (first time only):
   ```bash
   eas build:configure
   ```

2. **Build APK**:
   ```bash
   eas build -p android --profile preview
   ```

3. **Install the APK** on your Android device

4. **Grant permissions** when prompted for Health Connect access

## Troubleshooting

### "Health Connect not available" error
This is normal in Expo Go. The app will automatically use simulated data.

### App crashes on startup
Make sure you have the latest version of Expo Go installed.

### No data showing
The app generates dummy data automatically. If you don't see any data, try:
- Switching between Daily and Weekly tabs
- Pulling down to refresh
- Restarting the app

## Development Notes

The app detects Expo Go environment by:
1. Checking if Health Connect SDK is available
2. Catching initialization errors gracefully
3. Falling back to dummy data generation

No special configuration needed - it works automatically!