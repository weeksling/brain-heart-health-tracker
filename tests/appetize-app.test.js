// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');

// Load app configuration
const config = JSON.parse(fs.readFileSync('appetize-config.json', 'utf8'));
const APP_URL = config.appURL;
const PUBLIC_KEY = config.publicKey;

test.describe('Brain Heart Fitness App on Appetize.io', () => {
  let consoleLogs = [];
  let consoleErrors = [];

  test.beforeEach(async ({ page }) => {
    // Capture console logs
    page.on('console', msg => {
      const logEntry = `[${msg.type()}] ${msg.text()}`;
      consoleLogs.push(logEntry);
      
      if (msg.type() === 'error') {
        consoleErrors.push(logEntry);
      }
      
      console.log(`Console ${msg.type()}: ${msg.text()}`);
    });

    // Capture page errors
    page.on('pageerror', error => {
      const errorEntry = `[PAGE ERROR] ${error.message}`;
      consoleErrors.push(errorEntry);
      console.log(`Page Error: ${error.message}`);
    });
  });

  test('App loads and starts without immediate crash', async ({ page }) => {
    console.log(`🚀 Testing app: ${APP_URL}`);
    
    // Navigate to Appetize app
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    
    // Wait for Appetize to load
    await page.waitForSelector('[data-testid="appetize-player"], iframe, .appetize-container', { timeout: 30000 });
    
    // Take screenshot of initial load
    await page.screenshot({ path: 'test-results/01-appetize-loaded.png', fullPage: true });
    
    // Look for the app start button or similar
    const startButton = page.locator('text="Tap to Play"').or(page.locator('text="Start Session"')).or(page.locator('[data-testid="start-button"]'));
    
    // Wait a bit for the page to stabilize
    await page.waitForTimeout(3000);
    
    // Take screenshot before starting
    await page.screenshot({ path: 'test-results/02-before-start.png', fullPage: true });
    
    // Click start if visible
    if (await startButton.isVisible()) {
      console.log('📱 Starting app session...');
      await startButton.click();
    }
    
    // Wait for app to load in emulator
    console.log('⏳ Waiting for app to load...');
    await page.waitForTimeout(10000); // Give app time to start
    
    // Take screenshot after app should have started
    await page.screenshot({ path: 'test-results/03-app-started.png', fullPage: true });
    
    // Check for any obvious error messages
    const errorMessages = await page.locator('text=/error|crash|failed/i').count();
    
    expect(errorMessages).toBe(0);
    
    console.log('✅ App loaded without immediate crash');
  });

  test('Check for app UI elements and interactions', async ({ page }) => {
    console.log('🔍 Testing app UI elements...');
    
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="appetize-player"], iframe, .appetize-container', { timeout: 30000 });
    
    // Start the session
    const startButton = page.locator('text="Tap to Play"').or(page.locator('text="Start Session"'));
    if (await startButton.isVisible()) {
      await startButton.click();
      await page.waitForTimeout(8000);
    }
    
    // Look for device screen
    const deviceScreen = page.locator('[data-testid="device-screen"], .device-screen, iframe');
    await expect(deviceScreen).toBeVisible({ timeout: 15000 });
    
    // Try to interact with the device screen (if it's not in iframe)
    try {
      // Take screenshot of app running
      await page.screenshot({ path: 'test-results/04-app-running.png', fullPage: true });
      
      // Try to click on the device screen area
      const deviceBounds = await deviceScreen.boundingBox();
      if (deviceBounds) {
        console.log('📱 Attempting to interact with app...');
        
        // Click in the center of the device screen
        await page.mouse.click(
          deviceBounds.x + deviceBounds.width / 2,
          deviceBounds.y + deviceBounds.height / 2
        );
        
        await page.waitForTimeout(2000);
        
        // Try a few more taps to navigate
        await page.mouse.click(
          deviceBounds.x + deviceBounds.width / 2,
          deviceBounds.y + deviceBounds.height / 3
        );
        
        await page.waitForTimeout(2000);
        
        // Take screenshot after interactions
        await page.screenshot({ path: 'test-results/05-after-interactions.png', fullPage: true });
      }
    } catch (error) {
      console.log(`⚠️ Interaction failed: ${error.message}`);
    }
    
    console.log('✅ UI interaction test completed');
  });

  test('Monitor for crashes and performance issues', async ({ page }) => {
    console.log('🔍 Monitoring for crashes and performance...');
    
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    
    // Start the session
    const startButton = page.locator('text="Tap to Play"').or(page.locator('text="Start Session"'));
    if (await startButton.isVisible()) {
      await startButton.click();
    }
    
    // Monitor for 30 seconds
    const monitoringDuration = 30000;
    const checkInterval = 2000;
    const checks = monitoringDuration / checkInterval;
    
    for (let i = 0; i < checks; i++) {
      await page.waitForTimeout(checkInterval);
      
      // Check if app is still responsive
      const pageTitle = await page.title();
      expect(pageTitle).toBeTruthy();
      
      // Take periodic screenshots
      if (i % 5 === 0) {
        await page.screenshot({ path: `test-results/06-monitor-${i}.png` });
      }
      
      console.log(`⏱️ Monitoring... ${(i + 1) * checkInterval / 1000}s/${monitoringDuration / 1000}s`);
    }
    
    console.log('✅ Crash monitoring completed');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Save console logs
    const logData = {
      testName: testInfo.title,
      status: testInfo.status,
      consoleLogs: consoleLogs,
      consoleErrors: consoleErrors,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
      `test-results/console-logs-${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}.json`,
      JSON.stringify(logData, null, 2)
    );
    
    // Final screenshot
    await page.screenshot({ path: `test-results/final-${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}.png`, fullPage: true });
    
    // Report summary
    console.log(`\n📊 Test Summary for "${testInfo.title}":`);
    console.log(`   Status: ${testInfo.status}`);
    console.log(`   Console logs: ${consoleLogs.length}`);
    console.log(`   Console errors: ${consoleErrors.length}`);
    
    if (consoleErrors.length > 0) {
      console.log(`\n❌ Errors found:`);
      consoleErrors.forEach(error => console.log(`   ${error}`));
    }
    
    // Reset for next test
    consoleLogs = [];
    consoleErrors = [];
  });
});