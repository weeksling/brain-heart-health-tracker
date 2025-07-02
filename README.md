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
