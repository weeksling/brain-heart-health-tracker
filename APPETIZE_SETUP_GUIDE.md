# 🚀 Appetize.io Setup Guide

## 📋 **What is Appetize.io?**
Appetize.io is a cloud-based Android/iOS emulator that runs in your web browser. Perfect for testing apps without needing local emulators or physical devices.

**Why it's perfect for your app:**
- ✅ **No hardware acceleration needed** - works in any browser
- ✅ **4-second app loading** - super fast testing
- ✅ **Real device simulation** - touch, sensors, camera work properly
- ✅ **100 free minutes/month** - perfect for development
- ✅ **Crash detection** - browser console shows error logs

## 🎯 **Quick Setup (5 Minutes)**

### **Step 1: Sign Up for Appetize.io**
1. **Go to**: https://appetize.io
2. **Click**: "Sign Up" (top right)
3. **Choose**: Free plan (100 minutes/month)
4. **Fill out**: Basic account information
5. **Verify**: Your email address

### **Step 2: Get Your API Token**
1. **Log in** to Appetize.io
2. **Click**: Your profile/avatar (top right)
3. **Select**: "Account Settings"
4. **Find**: "API Token" section
5. **Click**: "Generate Token" or "Show Token"
6. **Copy**: The API token (starts with `at_...`)

### **Step 3: Set Up Environment**
```bash
# Set your API token (replace with your actual token)
export APPETIZE_API_TOKEN="at_your_token_here"

# Make it permanent (optional)
echo 'export APPETIZE_API_TOKEN="at_your_token_here"' >> ~/.bashrc
```

### **Step 4: Upload Your App**
```bash
# Run the automated setup script
./setup-appetize.sh
```

**That's it!** 🎉 Your app will be uploaded and you'll get a URL to test it immediately.

## 📁 **What Gets Created**

### **Scripts Ready to Use:**
- `setup-appetize.sh` - Initial app upload (run once)
- `update-appetize.sh` - Update app with new versions
- `test-appetize.js` - Automated testing (coming soon)

### **Configuration Files:**
- `appetize-config.json` - Stores your app details
- `test-results/` - Automated test results

## 🔄 **Workflow**

### **Initial Setup:**
```bash
# 1. Sign up at appetize.io and get API token
export APPETIZE_API_TOKEN="your_token"

# 2. Upload your app
./setup-appetize.sh
```

### **After Code Changes:**
```bash
# 1. Build new APK
cd react-native-version
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease

# 2. Update app on Appetize
cd /workspace
./update-appetize.sh
```

### **Testing:**
```bash
# Automated testing (basic)
./test-appetize.js

# Manual testing
# Use the App URL from setup output
```

## 📊 **Expected Output**

### **After successful setup:**
```
🎉 Upload successful!

📱 App Details:
  Public Key: 1234567890abcdef
  App URL: https://appetize.io/app/1234567890abcdef
  Manage URL: https://appetize.io/manage/1234567890abcdef

🚀 Quick Start:
1. Test your app: https://appetize.io/app/1234567890abcdef
2. Manage settings: https://appetize.io/manage/1234567890abcdef
3. Embed in website: https://appetize.io/embed/1234567890abcdef
```

## 🧪 **Testing Your App**

### **Manual Testing Steps:**
1. **Click** the App URL from setup
2. **Wait** ~4 seconds for app to load
3. **Check** if app crashes immediately
4. **Test** basic functionality:
   - App opens without errors
   - UI elements are visible
   - Heart rate features accessible
   - Health Connect permissions work

### **Crash Debugging:**
If your app crashes:
1. **Open** browser developer tools (F12)
2. **Go to** Console tab
3. **Look for** error messages in red
4. **Check** Network tab for failed requests
5. **Copy** error logs for debugging

### **Common Issues & Solutions:**

| Issue | Solution |
|-------|----------|
| **App won't start** | Check Health Connect permissions, ensure API 26+ |
| **Blank screen** | Look for JavaScript errors in console |
| **Network errors** | Check if app needs internet connectivity |
| **Permission errors** | Grant permissions in Appetize settings |

## 💰 **Pricing & Limits**

### **Free Tier (Perfect for Development):**
- ✅ **100 minutes/month** - about 25 test sessions
- ✅ **All devices** - Android/iOS, various versions
- ✅ **Full features** - debugging, screenshots, automation
- ✅ **No time limit** per session

### **If You Need More:**
- **Individual**: $40/month (1000 minutes)
- **Team**: $100/month (unlimited)
- **Enterprise**: Custom pricing

## 🔧 **Advanced Features**

### **Embedding in CI/CD:**
```yaml
# GitHub Actions example
- name: Test on Appetize
  run: |
    export APPETIZE_API_TOKEN=${{ secrets.APPETIZE_TOKEN }}
    ./update-appetize.sh
    ./test-appetize.js
```

### **Custom Device Testing:**
```bash
# Test on specific devices
curl -X POST https://api.appetize.io/v1/apps \
  -H "X-API-KEY: $APPETIZE_API_TOKEN" \
  -F "file=@releases/brain-heart-fitness-v1.0.0-release.apk" \
  -F "platform=android" \
  -F "deviceType=pixel7"
```

### **Automated Screenshot Testing:**
```javascript
// Coming soon: automated visual testing
const screenshots = await session.screenshot();
// Compare with baseline images
```

## 🆘 **Troubleshooting**

### **Setup Issues:**

**"API token invalid"**
```bash
# Check your token
echo $APPETIZE_API_TOKEN
# Should start with 'at_'
```

**"APK upload failed"**
```bash
# Check APK exists and is valid
ls -la releases/brain-heart-fitness-v1.0.0-release.apk
file releases/brain-heart-fitness-v1.0.0-release.apk
```

**"Script permission denied"**
```bash
# Make scripts executable
chmod +x setup-appetize.sh update-appetize.sh test-appetize.js
```

### **App Issues:**

**"App crashes immediately"**
- Check browser console for JavaScript errors
- Ensure app targets Android 8.0+ (API 26+)
- Check Health Connect permissions

**"Health features don't work"**
- Ensure Google Play Services available
- Check app permissions in Appetize settings
- Test on Android 8.0+ devices

### **Getting Help:**

1. **Check browser console** for detailed error logs
2. **Use Appetize docs**: https://docs.appetize.io
3. **Contact Appetize support**: Very responsive
4. **Check our troubleshooting**: `ANDROID_EMULATOR_SOLUTIONS.md`

## 🎉 **Success Checklist**

After setup, you should have:
- ✅ **Appetize account** with API token
- ✅ **App uploaded** and accessible via URL
- ✅ **Scripts working** for updates and testing
- ✅ **App launches** without immediate crashes
- ✅ **Basic functionality** working

## 🚀 **Next Steps**

1. **Test your app** using the provided URL
2. **Set up automated testing** with the scripts
3. **Integrate with CI/CD** for continuous testing
4. **Consider BrowserStack** for more comprehensive testing
5. **Monitor crash reports** for production issues

---

**Ready to get started? Run `./setup-appetize.sh` and you'll be testing in 5 minutes!** 🚀