#!/bin/bash

# 🚀 Appetize.io Setup Script for Brain Heart Fitness App
# This script automates the setup and upload process for Appetize.io

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APK_PATH="releases/brain-heart-fitness-v1.0.0-release.apk"
APP_NAME="Brain Heart Fitness"
PLATFORM="android"

echo -e "${BLUE}🚀 Appetize.io Setup for Brain Heart Fitness${NC}"
echo "=================================================="

# Check if APK exists
if [ ! -f "$APK_PATH" ]; then
    echo -e "${RED}❌ APK not found at $APK_PATH${NC}"
    echo "Please build the APK first by running:"
    echo "cd react-native-version && npx expo prebuild --platform android && cd android && ./gradlew assembleRelease"
    exit 1
fi

echo -e "${GREEN}✅ APK found: $APK_PATH ($(du -h $APK_PATH | cut -f1))${NC}"

# Check for API token
if [ -z "$APPETIZE_API_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  APPETIZE_API_TOKEN not set${NC}"
    echo ""
    echo "To get your API token:"
    echo "1. Go to https://appetize.io"
    echo "2. Sign up for a free account (100 minutes free!)"
    echo "3. Go to Account Settings -> API Token"
    echo "4. Copy your API token"
    echo "5. Run: export APPETIZE_API_TOKEN='your_token_here'"
    echo "6. Then run this script again"
    echo ""
    echo "Or provide it directly:"
    read -p "Enter your Appetize API token: " APPETIZE_API_TOKEN
    export APPETIZE_API_TOKEN
fi

echo -e "${BLUE}📤 Uploading APK to Appetize.io...${NC}"

# Upload APK to Appetize.io
RESPONSE=$(curl -s -X POST https://api.appetize.io/v1/apps \
  -H "X-API-KEY: $APPETIZE_API_TOKEN" \
  -F "file=@$APK_PATH" \
  -F "platform=$PLATFORM" \
  -F "note=Brain Heart Fitness v1.0.0 - Health tracking app with heart rate zones")

# Check if upload was successful
if echo "$RESPONSE" | grep -q "publicKey"; then
    PUBLIC_KEY=$(echo "$RESPONSE" | grep -o '"publicKey":"[^"]*"' | cut -d'"' -f4)
    APP_URL=$(echo "$RESPONSE" | grep -o '"appURL":"[^"]*"' | cut -d'"' -f4)
    MANAGE_URL=$(echo "$RESPONSE" | grep -o '"manageURL":"[^"]*"' | cut -d'"' -f4)
    
    echo -e "${GREEN}🎉 Upload successful!${NC}"
    echo ""
    echo "📱 App Details:"
    echo "  Public Key: $PUBLIC_KEY"
    echo "  App URL: $APP_URL"
    echo "  Manage URL: $MANAGE_URL"
    echo ""
    
    # Save details to file
    cat > appetize-config.json << EOF
{
  "appName": "$APP_NAME",
  "publicKey": "$PUBLIC_KEY",
  "appURL": "$APP_URL",
  "manageURL": "$MANAGE_URL",
  "platform": "$PLATFORM",
  "uploadDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "apkPath": "$APK_PATH"
}
EOF
    
    echo -e "${GREEN}✅ Configuration saved to appetize-config.json${NC}"
    echo ""
    echo -e "${BLUE}🚀 Quick Start:${NC}"
    echo "1. Test your app: $APP_URL"
    echo "2. Manage settings: $MANAGE_URL"
    echo "3. Embed in website: https://appetize.io/embed/$PUBLIC_KEY"
    echo ""
    echo -e "${YELLOW}💡 Tips:${NC}"
    echo "- The app will launch in about 4 seconds"
    echo "- You can interact with it just like a real device"
    echo "- Use browser dev tools to capture logs if it crashes"
    echo "- Check Health Connect permissions if health features don't work"
    
else
    echo -e "${RED}❌ Upload failed!${NC}"
    echo "Response: $RESPONSE"
    echo ""
    echo "Common issues:"
    echo "- Invalid API token"
    echo "- APK file corrupted"
    echo "- Network connection issues"
    exit 1
fi

echo ""
echo -e "${GREEN}🎯 Next Steps:${NC}"
echo "1. Click the App URL above to test your app"
echo "2. Check if the app launches without crashing"
echo "3. Test heart rate tracking functionality"
echo "4. If issues found, check browser console for error logs"
echo "5. Use './update-appetize.sh' to upload new versions"