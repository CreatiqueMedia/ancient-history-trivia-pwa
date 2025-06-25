#!/usr/bin/env ts-node

/**
 * CLI for Quarterly Trivia Bundle Release Workflow
 * Usage:
 *   yarn ts-node scripts/quarterly-release.ts <command>
 * Commands:
 *   export      Export new bundles (calls export-bundles.ts)
 *   check       Check for question redundancy using usedInVersions
 *   upload      Upload bundle to Supabase Storage (calls upload-bundles-to-supabase.ts)
 *   changelog   Update changelog/version tracking
 *   all         Run all steps in order
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const EXPORT_SCRIPT = path.join(__dirname, 'export-bundles.ts');
const UPLOAD_SCRIPT = path.join(__dirname, 'upload-bundles-to-supabase.ts');
const BUNDLES_PATH = path.join(__dirname, '../public');
const QUESTIONS_PATH = path.join(__dirname, '../src/data/questions.ts');
const BUNDLES_VERSION_FILE = path.join(__dirname, '../public/bundles-versions.json');
const CHANGELOG_FILE = path.join(__dirname, '../CHANGELOG.md');

function runExport() {
  console.log('Exporting bundles...');
  execSync(`yarn ts-node ${EXPORT_SCRIPT}`, { stdio: 'inherit' });
}

function runRedundancyCheck() {
  console.log('Checking for question redundancy across versions...');
  // This is a placeholder. Implement logic to parse bundles and check usedInVersions.
  // For now, just print a message.
  // TODO: Implement actual redundancy check logic.
  console.log('Redundancy check: Not yet implemented.');
}

function runUpload() {
  console.log('Uploading bundles to Supabase Storage...');
  execSync(`yarn ts-node ${UPLOAD_SCRIPT}`, { stdio: 'inherit' });
}

function updateChangelog() {
  console.log('Updating changelog...');
  // This is a placeholder. Implement logic to append release info to CHANGELOG.md.
  // For now, just print a message.
  // TODO: Implement actual changelog update logic.
  console.log('Changelog update: Not yet implemented.');
}

function runAll() {
  runExport();
  runRedundancyCheck();
  runUpload();
  updateChangelog();
}

const command = process.argv[2];

switch (command) {
  case 'export':
    runExport();
    break;
  case 'check':
    runRedundancyCheck();
    break;
  case 'upload':
    runUpload();
    break;
  case 'changelog':
    updateChangelog();
    break;
  case 'all':
    runAll();
    break;
  default:
    console.log('Usage: yarn ts-node scripts/quarterly-release.ts <export|check|upload|changelog|all>');
    process.exit(1);
}
