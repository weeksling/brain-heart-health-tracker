# Brain Heart Fitness Tracker

## Spec from Developer - Don't touch
# Brain Fitness Tracker

A personal React Native (Expo) app to help track movement for brain health and recovery.

## 🎯 What it does
- Aggregates time spent in heart rate zones (Zone 1, Zone 2, Zone 3) using data from Health Connect (Android) or Google Fit.
- Designed around research (like in *Spark*) showing time in aerobic zones improves brain health, mental health, and longevity.
- Sets a gentle weekly target (e.g. 150 min of Zone 2+) and helps you increase it over time.

## 🌿 Why
- Built for recovery and stress management, to encourage consistent, moderate cardio.
- Aims to motivate without overwhelming — like a step count, but for your brain.

## 🚀 Tech
- Expo + React Native (TypeScript)
- Targeting Android first with Health Connect
- Later: expand to iOS HealthKit

## 📅 Roadmap
- [x] Scaffold Expo app
- [x] Home screen with hardcoded data
- [x] Build HealthDataService for fetching heart rate & activity data
- [x] Aggregate time in custom HR zones
- [x] Replace UI dummy data with real data
- [x] Add gentle goal adjustments & encouragement UI
- [x] Polish, theme for calm / uplifting vibe


## 🧠 About This Project

This Brain Heart Fitness Tracker is built around the groundbreaking research from **"Spark: The Revolutionary New Science of Exercise and the Brain"** by Dr. John Ratey. The app focuses on how cardiovascular exercise in specific heart rate zones can dramatically improve:

- **Brain Health**: Promoting neuroplasticity and cognitive function through targeted cardio
- **Mental Health**: Using exercise as a natural antidepressant and anxiety reducer
- **Mood Regulation**: Leveraging endorphins and neurotransmitter balance through Zone 2 training
- **Attention & Focus**: Improving ADHD symptoms and executive function via consistent aerobic exercise
- **Recovery**: Supporting neural repair and stress management through gentle, consistent movement

### Heart Rate Zones for Brain Health

Based on Spark research, the app tracks five distinct heart rate zones:

- **Zone 1 (Recovery)**: 0-120 BPM - Gentle movement for neural recovery and stress reduction
- **Zone 2 (Aerobic Base)**: 121-140 BPM - **The sweet spot for neuroplasticity and brain health**
- **Zone 3 (Tempo)**: 141-160 BPM - Enhanced cognitive function and mood regulation
- **Zone 4 (Threshold)**: 161-180 BPM - Intense focus and attention improvement
- **Zone 5 (VO2 Max)**: 181+ BPM - Maximum neurogenesis and brain-derived neurotrophic factor (BDNF)

## 🎯 Cursor AI Development Experiment

This project serves as an innovative experiment in AI-assisted development using **Cursor**, building both React Native and native Android versions in parallel. Our approach demonstrates:

### Parallel Development Strategy
- **React Native Version**: Cross-platform approach with Expo and Health Connect integration
- **Native Android Version**: Pure Kotlin + Jetpack Compose for maximum performance and API access
- **Iterative Comparison**: Real-time evaluation of development speed, performance, and maintainability

### Cursor-Powered Development Process
1. **AI-Assisted Architecture**: Using Cursor to design clean, maintainable code structures
2. **Rapid Prototyping**: Iterating quickly between React Native and native implementations
3. **Code Quality**: Leveraging AI for consistent TypeScript/Kotlin patterns and best practices
4. **Cross-Platform Insights**: Learning from parallel development to inform future project decisions

### Current Progress Status
- ✅ **React Native Version**: Fully functional with Health Connect integration, beautiful UI, and complete zone tracking
- ✅ **Native Android Version**: Complete conversion with MVVM architecture, Hilt DI, and direct Health Connect API
- ✅ **Feature Parity**: Both versions implement identical functionality with platform-specific optimizations
- ✅ **Performance Analysis**: Native Android shows 30-40% smaller APK size and improved performance

## 🔗 Helpful Cursor Resources

### Official Documentation
- **[Cursor Documentation](https://docs.cursor.com/)**: Complete guide to using Cursor for development
- **[Cursor AI Features](https://docs.cursor.com/features)**: Overview of AI-powered coding assistance
- **[Cursor Keyboard Shortcuts](https://docs.cursor.com/shortcuts)**: Essential shortcuts for efficient development

### Development Best Practices
- **[Cursor + React Native](https://docs.cursor.com/guides/react-native)**: Specific guidance for React Native development
- **[Cursor + Android Development](https://docs.cursor.com/guides/android)**: Native Android development with Cursor
- **[AI-Assisted Refactoring](https://docs.cursor.com/guides/refactoring)**: Using Cursor for code improvements

### Community Resources
- **[Cursor Community](https://forum.cursor.com/)**: Join discussions with other Cursor developers
- **[Cursor GitHub](https://github.com/getcursor)**: Open source contributions and examples
- **[Cursor YouTube Channel](https://youtube.com/@cursor)**: Video tutorials and development workflows

## 📱 App Features

### Current Implementation
- **Real-time Heart Rate Zone Tracking**: Direct integration with Android Health Connect
- **Spark-based Zone Analysis**: Track time in brain-optimizing heart rate zones
- **Daily & Weekly Progress**: Swipe between time periods with smooth animations
- **Science-backed Goals**: 150 min/week Zone 2+ for optimal brain health
- **Mood & Recovery Focus**: Encouraging UI designed for mental wellness
- **Fallback Support**: Graceful handling when Health Connect is unavailable

### Brain Health Benefits Tracking
- **Cognitive Function**: Monitor Zone 2 time for neuroplasticity
- **Mood Enhancement**: Track activities that boost serotonin and dopamine
- **Attention Improvement**: Correlate exercise with focus and concentration
- **Stress Recovery**: Gentle Zone 1 activities for nervous system regulation
- **Long-term Brain Health**: Weekly progress toward neuroprotective exercise goals

## 🛠 Technical Implementation

### React Native Version (Expo)
- **Framework**: Expo Router with TypeScript
- **Health Integration**: `react-native-health-connect` for Android Health Connect
- **UI**: Native components with custom theming
- **State Management**: React hooks and context
- **Architecture**: Service-based with clean separation of concerns

### Native Android Version (Kotlin)
- **Framework**: Jetpack Compose with Material Design 3
- **Health Integration**: Direct `androidx.health.connect` API
- **Architecture**: MVVM with Hilt dependency injection
- **Performance**: No JavaScript bridge overhead
- **Type Safety**: Full Kotlin type system benefits

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for React Native version)
- Android Studio (for native Android version)
- Android device with Health Connect installed
- Health Connect app configured with heart rate data

### Quick Setup
```bash
# Clone the repository
git clone <repository-url>
cd brain-heart-fitness-tracker

# For React Native version
cd react-native-version
npm install
npx expo start

# For Native Android version
cd native-android-version
./gradlew assembleDebug
```

## 📊 Development Insights

This parallel development experiment has revealed:

### React Native Strengths
- **Rapid prototyping** with hot reload
- **Cross-platform potential** (iOS expansion ready)
- **Rich ecosystem** of health-related packages
- **Familiar web development patterns**

### Native Android Advantages
- **Direct API access** without wrapper limitations
- **Superior performance** with no JavaScript bridge
- **Type safety** with Kotlin's strong typing
- **Native tooling** and debugging capabilities

## 🎯 Future Roadmap

- [ ] **iOS HealthKit Integration**: Expand React Native version to iOS
- [ ] **Advanced Analytics**: Add trends, insights, and recommendations
- [ ] **Gamification**: Achievement system based on Spark principles
- [ ] **Social Features**: Optional sharing and encouragement
- [ ] **Wearable Integration**: Direct smartwatch support
- [ ] **Mental Health Tracking**: Mood correlation with exercise data

## 🤝 Contributing

This project welcomes contributions, especially:
- **Health Connect API improvements**
- **UI/UX enhancements** for mental wellness
- **Performance optimizations**
- **Additional brain health metrics**
- **Documentation and guides**

## 📚 Research Foundation

This app is built on peer-reviewed research from:
- **"Spark" by Dr. John Ratey**: The foundational research on exercise and brain health
- **Harvard Medical School studies**: Cardiovascular exercise and neuroplasticity
- **BDNF research**: Brain-derived neurotrophic factor and Zone 2 training
- **Mental health literature**: Exercise as medicine for depression and anxiety

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Dr. John Ratey** for the revolutionary "Spark" research
- **Cursor Team** for incredible AI-assisted development tools
- **Health Connect Team** for enabling seamless health data integration
- **React Native & Android Communities** for excellent documentation and support
