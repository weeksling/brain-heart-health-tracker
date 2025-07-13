#!/usr/bin/env node

/**
 * 🔍 Manual Appetize.io Testing Script
 * This script manually opens the Appetize app and tests it step by step
 */

const { chromium } = require('playwright');
const fs = require('fs');

// Load app configuration
const config = JSON.parse(fs.readFileSync('appetize-config.json', 'utf8'));
const APP_URL = config.appURL;

async function manualAppetizeTest() {
  console.log('🎭 Starting Manual Appetize.io Test');
  console.log('==================================');
  console.log(`🔗 App URL: ${APP_URL}`);
  console.log('');

  const testResults = {
    startTime: new Date().toISOString(),
    appURL: APP_URL,
    phases: [],
    consoleLogs: [],
    consoleErrors: [],
    screenshots: [],
    finalStatus: 'unknown'
  };

  let browser;
  let page;

  try {
    // Launch browser
    console.log('🚀 Phase 1: Launching browser...');
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    
    page = await context.newPage();

    // Capture console logs
    page.on('console', msg => {
      const logEntry = `[${msg.type()}] ${msg.text()}`;
      testResults.consoleLogs.push(logEntry);
      console.log(`  Console ${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', error => {
      const errorEntry = `[PAGE ERROR] ${error.message}`;
      testResults.consoleErrors.push(errorEntry);
      console.log(`  Page Error: ${error.message}`);
    });

    testResults.phases.push({
      phase: 'Browser Launch',
      status: 'success',
      timestamp: new Date().toISOString()
    });

    // Navigate to Appetize
    console.log('🌐 Phase 2: Navigating to Appetize URL...');
    await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Take initial screenshot
    const screenshot1 = 'test-results/manual-01-page-loaded.png';
    await page.screenshot({ path: screenshot1, fullPage: true });
    testResults.screenshots.push(screenshot1);
    console.log(`  📸 Screenshot saved: ${screenshot1}`);

    testResults.phases.push({
      phase: 'Page Navigation',
      status: 'success',
      timestamp: new Date().toISOString()
    });

    // Check page title and content
    const pageTitle = await page.title();
    console.log(`  📋 Page title: "${pageTitle}"`);
    
    // Wait a bit for any dynamic content to load
    console.log('⏳ Phase 3: Waiting for page to stabilize...');
    await page.waitForTimeout(5000);

    // Take screenshot after stabilization
    const screenshot2 = 'test-results/manual-02-stabilized.png';
    await page.screenshot({ path: screenshot2, fullPage: true });
    testResults.screenshots.push(screenshot2);

    // Look for various possible elements
    console.log('🔍 Phase 4: Analyzing page elements...');
    
    const pageContent = await page.content();
    console.log(`  📄 Page content length: ${pageContent.length} characters`);
    
    // Check for common Appetize elements
    const elements = {
      iframe: await page.locator('iframe').count(),
      tapToPlay: await page.locator('text=/tap.*play/i').count(),
      startSession: await page.locator('text=/start.*session/i').count(),
      appetizeContainer: await page.locator('[class*="appetize"]').count(),
      deviceScreen: await page.locator('[class*="device"]').count(),
      loadingIndicator: await page.locator('text=/loading/i').count()
    };

    console.log('  🎯 Found elements:');
    Object.entries(elements).forEach(([key, count]) => {
      console.log(`    ${key}: ${count}`);
    });

    testResults.phases.push({
      phase: 'Element Analysis',
      status: 'success',
      elements: elements,
      timestamp: new Date().toISOString()
    });

    // Try to find and click a start button
    console.log('▶️ Phase 5: Looking for start button...');
    
    const possibleStartButtons = [
      'text=/tap.*play/i',
      'text=/start.*session/i',
      'text=/play/i',
      'button[class*="start"]',
      'button[class*="play"]',
      '[data-testid*="start"]',
      '[data-testid*="play"]'
    ];

    let buttonFound = false;
    for (const selector of possibleStartButtons) {
      try {
        const button = page.locator(selector);
        if (await button.isVisible({ timeout: 1000 })) {
          console.log(`  ✅ Found button with selector: ${selector}`);
          await button.click();
          buttonFound = true;
          
          // Wait after click
          await page.waitForTimeout(3000);
          
          // Take screenshot after click
          const screenshot3 = 'test-results/manual-03-after-click.png';
          await page.screenshot({ path: screenshot3, fullPage: true });
          testResults.screenshots.push(screenshot3);
          
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    if (!buttonFound) {
      console.log('  ⚠️ No start button found, trying to click center of page...');
      await page.mouse.click(640, 360);
      await page.waitForTimeout(3000);
    }

    testResults.phases.push({
      phase: 'Button Interaction',
      status: buttonFound ? 'success' : 'partial',
      buttonFound: buttonFound,
      timestamp: new Date().toISOString()
    });

    // Monitor for app loading
    console.log('📱 Phase 6: Monitoring for app startup...');
    
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(2000);
      
      // Take periodic screenshots
      if (i % 2 === 0) {
        const screenshot = `test-results/manual-04-monitor-${i}.png`;
        await page.screenshot({ path: screenshot, fullPage: true });
        testResults.screenshots.push(screenshot);
      }
      
      console.log(`  ⏱️ Monitoring ${(i + 1) * 2}s/20s...`);
      
      // Check for any changes in page content
      const currentContent = await page.content();
      if (i === 0) {
        testResults.initialContentLength = currentContent.length;
      }
    }

    testResults.phases.push({
      phase: 'App Monitoring',
      status: 'completed',
      timestamp: new Date().toISOString()
    });

    // Final screenshot
    const finalScreenshot = 'test-results/manual-05-final.png';
    await page.screenshot({ path: finalScreenshot, fullPage: true });
    testResults.screenshots.push(finalScreenshot);

    testResults.finalStatus = 'completed';
    console.log('✅ Test completed successfully');

  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
    testResults.finalStatus = 'failed';
    testResults.error = error.message;
    
    if (page) {
      try {
        const errorScreenshot = 'test-results/manual-error.png';
        await page.screenshot({ path: errorScreenshot, fullPage: true });
        testResults.screenshots.push(errorScreenshot);
      } catch (screenshotError) {
        console.error(`Failed to take error screenshot: ${screenshotError.message}`);
      }
    }
  } finally {
    if (browser) {
      await browser.close();
    }
    
    // Save results
    testResults.endTime = new Date().toISOString();
    testResults.duration = new Date(testResults.endTime) - new Date(testResults.startTime);
    
    fs.writeFileSync(
      'test-results/manual-appetize-test-results.json',
      JSON.stringify(testResults, null, 2)
    );
    
    console.log('');
    console.log('📊 Test Summary:');
    console.log(`   Status: ${testResults.finalStatus}`);
    console.log(`   Phases completed: ${testResults.phases.length}`);
    console.log(`   Console logs: ${testResults.consoleLogs.length}`);
    console.log(`   Console errors: ${testResults.consoleErrors.length}`);
    console.log(`   Screenshots: ${testResults.screenshots.length}`);
    console.log(`   Duration: ${Math.round(testResults.duration / 1000)}s`);
    
    if (testResults.consoleErrors.length > 0) {
      console.log('');
      console.log('❌ Console Errors Found:');
      testResults.consoleErrors.forEach(error => {
        console.log(`   ${error}`);
      });
    }
    
    console.log('');
    console.log('📁 Results saved to: test-results/manual-appetize-test-results.json');
    console.log('📸 Screenshots available in: test-results/manual-*.png');
  }
}

// Run the test
manualAppetizeTest().catch(console.error);