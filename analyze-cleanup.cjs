#!/usr/bin/env node

/**
 * Comprehensive Project Cleanup Tool
 * Analyzes the codebase to detect unused files, test files, and cleanup candidates
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProjectAnalyzer {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.usedFiles = new Set();
    this.testFiles = new Set();
    this.configFiles = new Set();
    this.buildFiles = new Set();
    this.unusedFiles = new Set();
    this.cleanupCandidates = new Set();
  }

  // Get all files in project (excluding node_modules, .git, etc.)
  getAllFiles() {
    const excludeDirs = ['node_modules', '.git', 'dist', 'yarn-cache', '.firebase'];
    const files = [];
    
    const walk = (dir) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !excludeDirs.includes(item)) {
          walk(fullPath);
        } else if (stat.isFile()) {
          files.push(fullPath);
        }
      }
    };
    
    walk(this.projectRoot);
    return files;
  }

  // Check if file is referenced in codebase
  isFileReferenced(filePath) {
    const relativePath = path.relative(this.projectRoot, filePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    
    try {
      // Search for imports/references
      const searchPatterns = [
        relativePath.replace(/\\/g, '/'),
        fileName,
        path.basename(filePath)
      ];
      
      for (const pattern of searchPatterns) {
        try {
          execSync(`grep -r "${pattern}" src/ --include="*.tsx" --include="*.ts" --include="*.js" --include="*.jsx" 2>/dev/null`, { cwd: this.projectRoot });
          return true;
        } catch (e) {
          // Continue to next pattern
        }
      }
      
      // Check package.json scripts
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      const scriptsStr = JSON.stringify(packageJson.scripts || {});
      if (scriptsStr.includes(relativePath) || scriptsStr.includes(fileName)) {
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  // Categorize files
  categorizeFiles() {
    const allFiles = this.getAllFiles();
    
    for (const file of allFiles) {
      const relativePath = path.relative(this.projectRoot, file);
      const ext = path.extname(file);
      const basename = path.basename(file);
      
      // Test files
      if (relativePath.includes('test') || 
          relativePath.includes('spec') ||
          basename.includes('test') ||
          basename.includes('spec') ||
          basename.includes('debug') ||
          relativePath.startsWith('tests/')) {
        this.testFiles.add(file);
      }
      
      // Config files
      else if (['.json', '.js', '.mjs', '.config.js', '.config.ts'].includes(ext) &&
               ['package.json', 'tsconfig.json', 'vite.config.ts', 'tailwind.config.js', 
                'firebase.json', 'firestore.rules', '.firebaserc'].includes(basename)) {
        this.configFiles.add(file);
      }
      
      // Build/temp files
      else if (relativePath.includes('dist/') || 
               relativePath.includes('.tsbuildinfo') ||
               relativePath.includes('cache') ||
               relativePath.includes('tmp')) {
        this.buildFiles.add(file);
      }
      
      // Check if source files are actually used
      else if (['.tsx', '.ts', '.js', '.jsx'].includes(ext) && 
               relativePath.startsWith('src/')) {
        if (!this.isFileReferenced(file)) {
          this.unusedFiles.add(file);
        } else {
          this.usedFiles.add(file);
        }
      }
      
      // Other cleanup candidates
      else if (basename.includes('backup') ||
               basename.includes('old') ||
               basename.includes('temp') ||
               basename.includes('example') ||
               ext === '.md' && !['README.md'].includes(basename)) {
        this.cleanupCandidates.add(file);
      }
    }
  }

  // Generate cleanup report
  generateReport() {
    console.log('\n🧹 PROJECT CLEANUP ANALYSIS');
    console.log('='.repeat(50));
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Used files: ${this.usedFiles.size}`);
    console.log(`   Test files: ${this.testFiles.size}`);
    console.log(`   Config files: ${this.configFiles.size}`);
    console.log(`   Build files: ${this.buildFiles.size}`);
    console.log(`   Unused files: ${this.unusedFiles.size}`);
    console.log(`   Cleanup candidates: ${this.cleanupCandidates.size}`);
    
    if (this.testFiles.size > 0) {
      console.log(`\n🧪 TEST FILES (${this.testFiles.size}):`);
      this.testFiles.forEach(file => {
        console.log(`   - ${path.relative(this.projectRoot, file)}`);
      });
    }
    
    if (this.unusedFiles.size > 0) {
      console.log(`\n🗑️  UNUSED SOURCE FILES (${this.unusedFiles.size}):`);
      this.unusedFiles.forEach(file => {
        console.log(`   - ${path.relative(this.projectRoot, file)}`);
      });
    }
    
    if (this.cleanupCandidates.size > 0) {
      console.log(`\n📋 CLEANUP CANDIDATES (${this.cleanupCandidates.size}):`);
      this.cleanupCandidates.forEach(file => {
        console.log(`   - ${path.relative(this.projectRoot, file)}`);
      });
    }
    
    console.log(`\n💡 RECOMMENDATIONS:`);
    if (this.testFiles.size > 0) {
      console.log(`   • Review test files - remove if not needed for production`);
    }
    if (this.unusedFiles.size > 0) {
      console.log(`   • Remove unused source files to reduce bundle size`);
    }
    if (this.cleanupCandidates.size > 0) {
      console.log(`   • Clean up backup/example files`);
    }
    
    return {
      testFiles: Array.from(this.testFiles),
      unusedFiles: Array.from(this.unusedFiles),
      cleanupCandidates: Array.from(this.cleanupCandidates)
    };
  }

  // Generate cleanup script
  generateCleanupScript(safeMode = true) {
    const script = [];
    script.push('#!/bin/bash');
    script.push('# Generated cleanup script');
    script.push('echo "🧹 Starting project cleanup..."');
    
    if (safeMode) {
      script.push('# SAFE MODE: Files will be moved to .cleanup-backup/');
      script.push('mkdir -p .cleanup-backup');
    }
    
    const allCleanupFiles = [
      ...this.testFiles,
      ...this.unusedFiles, 
      ...this.cleanupCandidates
    ];
    
    for (const file of allCleanupFiles) {
      const relativePath = path.relative(this.projectRoot, file);
      if (safeMode) {
        script.push(`mv "${relativePath}" .cleanup-backup/ 2>/dev/null || echo "Could not move ${relativePath}"`);
      } else {
        script.push(`rm -f "${relativePath}" 2>/dev/null || echo "Could not remove ${relativePath}"`);
      }
    }
    
    script.push('echo "✅ Cleanup complete!"');
    return script.join('\n');
  }
}

// Run analysis
const analyzer = new ProjectAnalyzer(process.cwd());
analyzer.categorizeFiles();
const report = analyzer.generateReport();

// Generate cleanup script
const cleanupScript = analyzer.generateCleanupScript(true);
fs.writeFileSync('cleanup-project.sh', cleanupScript);
fs.chmodSync('cleanup-project.sh', '755');

console.log(`\n📝 Generated cleanup-project.sh - review before running!`);
console.log(`   Run with: ./cleanup-project.sh`);
