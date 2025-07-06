# Docker Environment for Background Agents

This setup provides a Docker environment with Android SDK and Node.js 20 pre-installed for use with Cursor's background agents.

## What's Included

- **Node.js 20** - As specified in the React Native project's `.nvmrc`
- **Android SDK** - Latest command line tools with multiple platform versions
- **Java 17** - Required for Android development
- **Gradle 8.5** - For building Android projects
- **Expo CLI** - For React Native/Expo development
- **React Native CLI** - For React Native development
- **EAS CLI** - For Expo Application Services

## Android SDK Components

The environment includes:
- Platform Tools (ADB, Fastboot)
- Android platforms: 31, 32, 33, 34
- Build tools: 32.0.0, 33.0.2, 34.0.0
- Emulator and system images for Android 33 and 34

## Configuration Files

- `cursor.json` - Configures Cursor to use the custom Docker environment for background agents
- `Dockerfile` - Defines the Docker image with all necessary tools
- `.dockerignore` - Optimizes Docker build by excluding unnecessary files

## Usage

Once these files are in place, Cursor's background agents will automatically use this environment when you start conversations. The environment will have all the necessary tools to:

1. Build and run React Native applications
2. Build native Android applications
3. Use Android SDK tools (ADB, emulator, etc.)
4. Install npm packages and run Node.js scripts

## Building the Docker Image (Optional)

If you want to build the image manually:

```bash
docker build -t android-nodejs-dev .
```

## Environment Variables

The following environment variables are automatically set:
- `ANDROID_HOME=/opt/android-sdk`
- `ANDROID_SDK_ROOT=/opt/android-sdk`
- `JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64`
- `NODE_VERSION=20`

## User Configuration

The Docker environment runs as a non-root user `developer` with sudo privileges for security best practices.