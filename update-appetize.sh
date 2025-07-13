#!/bin/bash

# 🔄 Update Appetize.io App Script
# Updates existing app with new APK version

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Updating Appetize.io App${NC}"
echo "================================"

# Check if config exists
if [ ! -f "appetize-config.json" ]; then
    echo -e "${RED}❌ appetize-config.json not found${NC}"
    echo "Please run ./setup-appetize.sh first to create initial app"
    exit 1
fi

# Read existing config
PUBLIC_KEY=$(grep -o '"publicKey":"[^"]*"' appetize-config.json | cut -d'"' -f4)
APK_PATH=$(grep -o '"apkPath":"[^"]*"' appetize-config.json | cut -d'"' -f4)

echo -e "${GREEN}✅ Found existing app: $PUBLIC_KEY${NC}"

# Check if APK exists
if [ ! -f "$APK_PATH" ]; then
    echo -e "${RED}❌ APK not found at $APK_PATH${NC}"
    echo "Please build a new APK first"
    exit 1
fi

APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
echo -e "${GREEN}✅ APK found: $APK_PATH ($APK_SIZE)${NC}"

# Check for API token
if [ -z "$APPETIZE_API_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  APPETIZE_API_TOKEN not set${NC}"
    read -p "Enter your Appetize API token: " APPETIZE_API_TOKEN
    export APPETIZE_API_TOKEN
fi

echo -e "${BLUE}📤 Uploading updated APK...${NC}"

# Update existing app
RESPONSE=$(curl -s -X POST "https://api.appetize.io/v1/apps/$PUBLIC_KEY" \
  -H "X-API-KEY: $APPETIZE_API_TOKEN" \
  -F "file=@$APK_PATH" \
  -F "platform=android" \
  -F "note=Brain Heart Fitness v1.0.0 - Updated $(date)")

# Check if update was successful
if echo "$RESPONSE" | grep -q "publicKey"; then
    APP_URL=$(echo "$RESPONSE" | grep -o '"appURL":"[^"]*"' | cut -d'"' -f4)
    MANAGE_URL=$(echo "$RESPONSE" | grep -o '"manageURL":"[^"]*"' | cut -d'"' -f4)
    
    echo -e "${GREEN}🎉 Update successful!${NC}"
    echo ""
    echo "📱 Updated App:"
    echo "  App URL: $APP_URL"
    echo "  Manage URL: $MANAGE_URL"
    echo ""
    
    # Update config file
    cat > appetize-config.json << EOF
{
  "appName": "Brain Heart Fitness",
  "publicKey": "$PUBLIC_KEY",
  "appURL": "$APP_URL",
  "manageURL": "$MANAGE_URL",
  "platform": "android",
  "uploadDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "apkPath": "$APK_PATH"
}
EOF
    
    echo -e "${GREEN}✅ Configuration updated${NC}"
    echo ""
    echo -e "${BLUE}🚀 Test your updated app: $APP_URL${NC}"
    
else
    echo -e "${RED}❌ Update failed!${NC}"
    echo "Response: $RESPONSE"
    exit 1
fi