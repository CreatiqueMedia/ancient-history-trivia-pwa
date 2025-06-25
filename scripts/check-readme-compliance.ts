#!/usr/bin/env ts-node
import * as fs from 'fs';

// List of required phrases/sections for compliance
const requiredSections = [
  'Quarterly Trivia Bundle Delivery & Cloud Integration',
  'Automated Quarterly Release Workflow',
  'App Store Submission Guide',
  'Best Practices & Maintenance',
  'Mobile & PWA Best Practices (Apple, Android, Web)',
  'General PWA Best Practices',
  'Android (Google Play Store)',
  'iOS (Apple App Store)',
  'Store Compliance & User Experience',
  'Security & Privacy',
  'Testing & QA',
  'Professional Footer',
  'privacy policy',
  'service worker',
  'Supabase',
  'bundle',
  'Lighthouse',
  'CHANGELOG.md',
  'FAQ',
  'Accessibility',
  'Contribution Guidelines',
  'Known Issues & Roadmap'
];

const readmePath = 'README.md';
const readme = fs.readFileSync(readmePath, 'utf-8');

let allPassed = true;

console.log('Checking README.md for required compliance sections...');
for (const section of requiredSections) {
  if (!readme.includes(section)) {
    console.error(`❌ Missing required section or phrase: "${section}"`);
    allPassed = false;
  } else {
    console.log(`✅ Found: "${section}"`);
  }
}

if (!allPassed) {
  console.error('\nREADME.md compliance check failed. Please update the documentation.');
  process.exit(1);
} else {
  console.log('\nREADME.md compliance check passed!');
  process.exit(0);
}
