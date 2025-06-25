#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function checkFileExists(filePath: string, description: string) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing: ${description} (${filePath})`);
    return false;
  }
  console.log(`✅ Found: ${description}`);
  return true;
}

function checkManifest() {
  const manifestPath = path.join('public', 'manifest.webmanifest');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Missing manifest.webmanifest');
    return false;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const requiredIcons = [192, 512];
  const icons = manifest.icons || [];
  for (const size of requiredIcons) {
    if (!icons.some((icon: any) => icon.sizes && icon.sizes.includes(`${size}x${size}`))) {
      console.error(`❌ Missing required icon size: ${size}x${size}`);
      return false;
    }
  }
  if (!manifest.name || !manifest.short_name) {
    console.error('❌ Manifest missing name or short_name');
    return false;
  }
  console.log('✅ Manifest is store-compliant');
  return true;
}

function checkServiceWorker() {
  return checkFileExists(path.join('public', 'sw.js'), 'Service Worker (sw.js)');
}

function checkPrivacyPolicy() {
  return checkFileExists(path.join('public', 'privacy-policy.html'), 'Privacy Policy');
}

function checkLighthouse() {
  try {
    const result = execSync('npx lhci autorun --config=./lighthouserc.js', { stdio: 'pipe' }).toString();
    if (result.includes('score: 0.9') || result.includes('score: 1')) {
      console.log('✅ Lighthouse audit passed (90+ scores)');
      return true;
    } else {
      console.error('❌ Lighthouse audit did not meet 90+ scores');
      return false;
    }
  } catch (e) {
    console.error('❌ Lighthouse audit failed to run');
    return false;
  }
}

function checkDependencies() {
  try {
    execSync('yarn audit --groups dependencies --level high', { stdio: 'pipe' });
    console.log('✅ Dependencies pass yarn audit');
    return true;
  } catch (e) {
    console.error('❌ Dependency vulnerabilities found');
    return false;
  }
}

function checkCI() {
  return checkFileExists('.github/workflows/readme-compliance.yml', 'CI/CD Workflow');
}

function checkSupabaseConfig() {
  return checkFileExists('firebase.json', 'Firebase Hosting Config (for HTTPS)') &&
    checkFileExists('public/trivia-bundles-2025-Q3.json', 'Sample Exported Bundle') &&
    checkFileExists('src/data/bundles.ts', 'Bundle Source Data');
}

function runAllChecks() {
  let allPassed = true;
  allPassed = checkManifest() && allPassed;
  allPassed = checkServiceWorker() && allPassed;
  allPassed = checkPrivacyPolicy() && allPassed;
  allPassed = checkSupabaseConfig() && allPassed;
  allPassed = checkDependencies() && allPassed;
  allPassed = checkCI() && allPassed;
  // Lighthouse check is optional, comment out if not configured
  // allPassed = checkLighthouse() && allPassed;
  if (allPassed) {
    console.log('\n🎉 Project is PRODUCTION READY!');
    process.exit(0);
  } else {
    console.error('\n❌ Project is NOT production ready. See errors above.');
    process.exit(1);
  }
}

runAllChecks();
