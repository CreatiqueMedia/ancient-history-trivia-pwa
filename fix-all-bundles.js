#!/usr/bin/env node

const fs = require('fs');

// Read the current bundles.ts file
let content = fs.readFileSync('./src/data/bundles.ts', 'utf8');

// Create the correct difficultyBreakdown pattern
const correctBreakdown = `difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    }`;

// Pattern to match any difficultyBreakdown block
const difficultyPattern = /difficultyBreakdown:\s*\{[^}]*\}/g;

// Replace all difficultyBreakdown blocks with the correct values
content = content.replace(difficultyPattern, correctBreakdown);

// Write the updated content back
fs.writeFileSync('./src/data/bundles.ts', content);

console.log('✅ Successfully updated ALL bundles to have exactly 25 Easy, 50 Medium, 25 Hard questions');
