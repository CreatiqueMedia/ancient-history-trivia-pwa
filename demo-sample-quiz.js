/**
 * Demo script to show how the sample quiz system works
 * Run this to see sample questions generated for each bundle
 */

import { QUESTION_BUNDLES } from './src/data/bundles.js';
import SampleQuizService from './src/services/SampleQuizService.js';

console.log('🎯 Ancient History PWA - Sample Quiz Demo\n');

// Get a few sample bundles to demonstrate
const sampleBundles = QUESTION_BUNDLES.slice(0, 3);

sampleBundles.forEach((bundle, index) => {
  console.log(`${index + 1}. ${bundle.name} (${bundle.version})`);
  console.log(`   Theme: ${bundle.subcategory}`);
  console.log(`   Difficulty: ${bundle.difficulty}`);
  console.log(`   Questions: ${bundle.questionCount}`);
  
  try {
    const sampleQuiz = SampleQuizService.generateSampleQuiz(bundle);
    console.log(`   ✅ Sample Quiz Generated: ${sampleQuiz.length} questions`);
    
    // Show difficulty breakdown
    const difficulties = sampleQuiz.reduce((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`   📊 Difficulty Breakdown: Easy: ${difficulties.easy || 0}, Medium: ${difficulties.medium || 0}, Hard: ${difficulties.hard || 0}`);
    
    // Show first question as example
    if (sampleQuiz.length > 0) {
      console.log(`   📝 Sample Question: "${sampleQuiz[0].question.substring(0, 60)}..."`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error generating sample quiz: ${error.message}`);
  }
  
  console.log('');
});

console.log('💡 Users can click "Take Sample Quiz" on any bundle to try 10 questions before purchasing!');
console.log('🔄 New versions will be released quarterly with fresh content.');
console.log('💰 This creates ongoing revenue opportunities while letting users try before they buy.\n');
