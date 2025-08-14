#!/usr/bin/env node

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';

const urls = [
  'https://ancient-history-trivia.web.app',
  'https://ancient-history-trivia.web.app/store',
  'https://ancient-history-trivia.web.app/store?tab=subscription'
];

const config = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36'
  }
};

async function runLighthouse(url, name) {
  console.log(`🔍 Running Lighthouse audit for: ${url}`);
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });
  
  try {
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      disableDeviceEmulation: false,
      throttlingMethod: 'simulate'
    }, config);

    // Save the report
    const reportHtml = runnerResult.report;
    const reportPath = `lighthouse-${name}.html`;
    fs.writeFileSync(reportPath, reportHtml);
    
    // Save JSON results for analysis
    const jsonPath = `lighthouse-${name}.json`;
    fs.writeFileSync(jsonPath, JSON.stringify(runnerResult.lhr, null, 2));
    
    console.log(`📊 Report saved: ${reportPath}`);
    
    // Extract key metrics
    const lhr = runnerResult.lhr;
    const scores = {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      pwa: lhr.categories.pwa ? Math.round(lhr.categories.pwa.score * 100) : 'N/A'
    };
    
    console.log(`📈 Scores for ${name}:`);
    console.log(`  Performance: ${scores.performance}/100`);
    console.log(`  Accessibility: ${scores.accessibility}/100`);
    console.log(`  Best Practices: ${scores.bestPractices}/100`);
    console.log(`  SEO: ${scores.seo}/100`);
    console.log(`  PWA: ${scores.pwa}/100`);
    
    // Check for critical issues
    const audits = lhr.audits;
    const criticalIssues = [];
    
    // Performance issues
    if (scores.performance < 80) {
      criticalIssues.push(`Low performance score: ${scores.performance}/100`);
    }
    
    // Accessibility issues
    if (scores.accessibility < 90) {
      criticalIssues.push(`Accessibility issues: ${scores.accessibility}/100`);
    }
    
    // Check specific audits
    if (audits['first-contentful-paint'] && audits['first-contentful-paint'].numericValue > 3000) {
      criticalIssues.push(`Slow First Contentful Paint: ${Math.round(audits['first-contentful-paint'].numericValue)}ms`);
    }
    
    if (audits['largest-contentful-paint'] && audits['largest-contentful-paint'].numericValue > 4000) {
      criticalIssues.push(`Slow Largest Contentful Paint: ${Math.round(audits['largest-contentful-paint'].numericValue)}ms`);
    }
    
    if (audits['cumulative-layout-shift'] && audits['cumulative-layout-shift'].numericValue > 0.1) {
      criticalIssues.push(`High Cumulative Layout Shift: ${audits['cumulative-layout-shift'].numericValue.toFixed(3)}`);
    }
    
    // Stripe/Payment specific checks
    if (url.includes('store')) {
      console.log(`💳 Payment-specific checks for ${name}:`);
      
      // Check for Stripe resources
      const networkRequests = lhr.audits['network-requests'];
      if (networkRequests && networkRequests.details) {
        const stripeRequests = networkRequests.details.items.filter(item => 
          item.url.includes('stripe.com') || item.url.includes('stripe.js')
        );
        console.log(`  Stripe requests: ${stripeRequests.length}`);
        
        stripeRequests.forEach(req => {
          console.log(`    ${req.url} - ${req.statusCode} (${req.transferSize} bytes)`);
        });
      }
      
      // Check for payment-related security
      if (audits['is-on-https'] && !audits['is-on-https'].score) {
        criticalIssues.push('Payment page not served over HTTPS');
      }
      
      if (audits['mixed-content'] && !audits['mixed-content'].score) {
        criticalIssues.push('Mixed content detected on payment page');
      }
    }
    
    if (criticalIssues.length > 0) {
      console.log(`⚠️  Critical issues found:`);
      criticalIssues.forEach(issue => console.log(`    ${issue}`));
    } else {
      console.log(`✅ No critical issues found for ${name}`);
    }
    
    console.log('');
    return scores;
    
  } finally {
    await chrome.kill();
  }
}

async function main() {
  console.log('🚀 Starting Lighthouse audits for Ancient History Trivia PWA...\n');
  
  const allScores = [];
  
  for (const url of urls) {
    const name = url.split('/').pop() || 'home';
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '-') || 'home';
    
    try {
      const scores = await runLighthouse(url, cleanName);
      allScores.push({ url, name: cleanName, scores });
    } catch (error) {
      console.error(`❌ Error auditing ${url}:`, error.message);
    }
  }
  
  // Summary
  console.log('📋 LIGHTHOUSE AUDIT SUMMARY');
  console.log('='.repeat(50));
  
  allScores.forEach(({ url, name, scores }) => {
    console.log(`${name.toUpperCase()}:`);
    console.log(`  URL: ${url}`);
    console.log(`  Performance: ${scores.performance}/100`);
    console.log(`  Accessibility: ${scores.accessibility}/100`);
    console.log(`  Best Practices: ${scores.bestPractices}/100`);
    console.log(`  SEO: ${scores.seo}/100`);
    console.log(`  PWA: ${scores.pwa}/100`);
    console.log('');
  });
  
  // Calculate averages
  if (allScores.length > 0) {
    const avgScores = {
      performance: Math.round(allScores.reduce((sum, s) => sum + s.scores.performance, 0) / allScores.length),
      accessibility: Math.round(allScores.reduce((sum, s) => sum + s.scores.accessibility, 0) / allScores.length),
      bestPractices: Math.round(allScores.reduce((sum, s) => sum + s.scores.bestPractices, 0) / allScores.length),
      seo: Math.round(allScores.reduce((sum, s) => sum + s.scores.seo, 0) / allScores.length)
    };
    
    console.log('AVERAGE SCORES:');
    console.log(`  Performance: ${avgScores.performance}/100`);
    console.log(`  Accessibility: ${avgScores.accessibility}/100`);
    console.log(`  Best Practices: ${avgScores.bestPractices}/100`);
    console.log(`  SEO: ${avgScores.seo}/100`);
  }
  
  console.log('\n🎯 Recommendations:');
  console.log('- Review HTML reports for detailed insights');
  console.log('- Focus on performance if scores < 80');
  console.log('- Address accessibility issues if scores < 90');
  console.log('- Ensure payment flows are secure and fast');
}

main().catch(console.error);
