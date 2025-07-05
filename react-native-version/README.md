# Brain Heart Fitness Tracker

## Spec from Developer - Don't touch
# Brain Fitness Tracker

A personal React Native (Expo) app to help track movement for brain health and recovery.

## 🎯 What it does
- Aggregates time spent in heart rate zones (Zone 1, Zone 2, Zone 3) using data from Health Connect (Android) or Google Fit.
- Designed around research (like in *Spark*) showing time in aerobic zones improves brain health, mental health, and longevity.
- Sets a gentle weekly target (e.g. 150 min of Zone 2+) and helps you increase it over time.

## 🌿 Why
- Built for recovery from alcohol and stress damage, to encourage consistent, moderate cardio.
- Aims to motivate without overwhelming — like a step count, but for your brain.

## 🚀 Tech
- Expo + React Native (TypeScript)
- Targeting Android first with Health Connect
- Later: expand to iOS HealthKit

## 📅 Roadmap
- [x] Scaffold Expo app
- [ ] Home screen with hardcoded data
- [ ] Build HealthDataService for fetching heart rate & activity data
- [ ] Aggregate time in custom HR zones
- [ ] Replace UI dummy data with real data
- [ ] Add gentle goal adjustments & encouragement UI
- [ ] Polish, theme for calm / uplifting vibe


## Spec from automation and AI - Maintain as you see fit

A React Native app built with Expo that tracks heart rate zones for optimal brain health and recovery, based on the research from "Spark: The Revolutionary New Science of Exercise and the Brain."

## Features

- **Real-time Heart Rate Zone Tracking**: Integrates with Android Health Connect to fetch real heart rate data
- **Zone-based Activity Analysis**: Tracks time spent in different heart rate zones (Zone 1: Recovery, Zone 2: Aerobic Base, Zone 3: Tempo)
- **Daily & Weekly Views**: Swipe between daily and weekly summaries with smooth animations
- **Science-based Goals**: Default goals based on "Spark" research (150 min/week Zone 2+, 150 min/week Zone 1, 30 min/week Zone 3)
- **Brain Health Focus**: Encouraging UI designed to motivate brain health through exercise
- **Fallback Support**: Graceful fallback to dummy data when Health Connect is unavailable

## Heart Rate Zones

The app uses 5 heart rate zones based on "Spark" research:

- **Zone 1 (Recovery)**: 0-120 BPM - Light activity for recovery
- **Zone 2 (Aerobic Base)**: 121-140 BPM - **Primary target for brain health**
- **Zone 3 (Tempo)**: 141-160 BPM - Moderate intensity
- **Zone 4 (Threshold)**: 161-180 BPM - High intensity
- **Zone 5 (VO2 Max)**: 181+ BPM - Maximum effort

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Expo CLI
- Android device with Android 8.0+ (API 26+) for Health Connect
- Health Connect app installed on device

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd brain-heart-fitness-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on Android device:
```bash
npx expo run:android
```

### Health Connect Setup

1. **Install Health Connect**: Ensure the Health Connect app is installed on your Android device
   - Available on Google Play Store
   - Requires Android 8.0+ (API 26+)

2. **Grant Permissions**: When you first open the app, it will request Health Connect permissions:
   - Heart Rate data access
   - Steps data access
   - Exercise Session data access

3. **Verify Integration**: The app will automatically detect if Health Connect is available and request necessary permissions

### Android Permissions

The app requires the following Android permissions (automatically configured in `app.json`):

```json
{
  "android": {
    "permissions": [
      "android.permission.ACTIVITY_RECOGNITION",
      "android.permission.BODY_SENSORS", 
      "android.permission.BODY_SENSORS_BACKGROUND"
    ],
    "minSdkVersion": 26,
    "targetSdkVersion": 34
  }
}
```

## Development

### Project Structure

```
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Main home screen
│   │   └── explore.tsx    # Explore screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── constants/             # App constants and colors
├── hooks/                 # Custom React hooks
├── services/              # Business logic services
│   └── HealthDataService.ts  # Health Connect integration
└── assets/               # Images and fonts
```

### Key Components

- **HealthDataService**: Manages Health Connect integration, data fetching, and zone calculations
- **HomeScreen**: Main UI with zone cards, progress tracking, and swipe navigation
- **ThemedText/ThemedView**: Consistent theming components

### Data Flow

1. **Initialization**: `HealthDataService.initialize()` checks Health Connect availability
2. **Permission Request**: Requests necessary Health Connect permissions
3. **Data Fetching**: Fetches heart rate data for specified time ranges
4. **Zone Calculation**: Processes heart rate data into zone breakdowns
5. **UI Updates**: Displays real-time data with fallback to dummy data

### Adding New Features

1. **New Health Data Types**: Extend `HealthDataService` with new record types
2. **Custom Zones**: Modify zone definitions in `HealthDataService.getHeartRateZones()`
3. **Additional Views**: Add new screens in the `app/` directory
4. **UI Components**: Create reusable components in `components/`

## Troubleshooting

### Health Connect Issues

- **"Health Connect not available"**: Ensure Health Connect app is installed and device meets requirements
- **"Permissions denied"**: Manually grant permissions in Health Connect app settings
- **"No data available"**: Check if heart rate data exists in Health Connect for the selected time range

### Development Issues

- **Metro bundler errors**: Clear cache with `npx expo start --clear`
- **Android build issues**: Ensure Android SDK and build tools are properly configured
- **Permission errors**: Verify Android manifest permissions are correctly set

### Fallback Behavior

The app gracefully handles Health Connect unavailability:
- Falls back to realistic dummy data for development
- Shows appropriate error messages
- Maintains full UI functionality
- Allows testing without real health data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on Android device
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Research based on "Spark: The Revolutionary New Science of Exercise and the Brain" by John J. Ratey, MD
- Built with React Native, Expo, and Health Connect
- UI inspired by modern fitness and health tracking apps

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
