# Use Ubuntu 22.04 as base image
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=$ANDROID_HOME
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV NODE_VERSION=20

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    openjdk-17-jdk \
    build-essential \
    python3 \
    python3-pip \
    libc6-dev \
    libstdc++6 \
    lib32z1 \
    lib32ncurses6 \
    lib32stdc++6 \
    libbz2-1.0 \
    libxrender1 \
    libxtst6 \
    libxi6 \
    libfreetype6 \
    libxft2 \
    qemu-kvm \
    libvirt-daemon-system \
    libvirt-clients \
    bridge-utils \
    cpu-checker \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Yarn (optional, but useful for React Native projects)
RUN npm install -g yarn

# Create android-sdk directory
RUN mkdir -p $ANDROID_HOME

# Download and install Android SDK Command Line Tools
RUN wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O /tmp/cmdline-tools.zip \
    && unzip -q /tmp/cmdline-tools.zip -d /tmp \
    && mkdir -p $ANDROID_HOME/cmdline-tools/latest \
    && mv /tmp/cmdline-tools/* $ANDROID_HOME/cmdline-tools/latest/ \
    && rm -rf /tmp/cmdline-tools.zip /tmp/cmdline-tools

# Accept Android SDK licenses
RUN yes | sdkmanager --licenses

# Install Android SDK components
RUN sdkmanager --update
RUN sdkmanager \
    "platform-tools" \
    "platforms;android-34" \
    "platforms;android-33" \
    "platforms;android-32" \
    "platforms;android-31" \
    "build-tools;34.0.0" \
    "build-tools;33.0.2" \
    "build-tools;32.0.0" \
    "emulator" \
    "system-images;android-34;google_apis;x86_64" \
    "system-images;android-33;google_apis;x86_64"

# Install Gradle (latest version)
RUN wget -q https://services.gradle.org/distributions/gradle-8.5-bin.zip -O /tmp/gradle.zip \
    && unzip -q /tmp/gradle.zip -d /opt \
    && rm /tmp/gradle.zip
ENV PATH=$PATH:/opt/gradle-8.5/bin

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Install React Native CLI globally
RUN npm install -g @react-native-community/cli

# Install EAS CLI globally (for Expo projects)
RUN npm install -g eas-cli

# Create a non-root user for development
RUN useradd -m -s /bin/bash developer && \
    echo "developer:developer" | chpasswd && \
    usermod -aG sudo developer

# Set up workspace directory
WORKDIR /workspace

# Change ownership of Android SDK to developer user
RUN chown -R developer:developer $ANDROID_HOME

# Switch to developer user
USER developer

# Create AVD (Android Virtual Device) - optional, for testing
RUN echo "no" | avdmanager create avd -n test_device -k "system-images;android-34;google_apis;x86_64" -f

# Set up environment for the developer user
RUN echo 'export ANDROID_HOME=/opt/android-sdk' >> ~/.bashrc && \
    echo 'export ANDROID_SDK_ROOT=$ANDROID_HOME' >> ~/.bashrc && \
    echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator' >> ~/.bashrc && \
    echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc

# Verify installations
RUN node --version && \
    npm --version && \
    java -version && \
    gradle --version && \
    adb --version

# Default command
CMD ["/bin/bash"]