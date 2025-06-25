// Export all non-format bundles with 100 mixed questions each to a versioned JSON file
import fs from 'fs';
import path from 'path';
import { QUESTION_BUNDLES } from '../src/data/bundles';
import { getQuestionsForBundle } from '../src/data/questions';
const sampleQuestionsByBundle = require('../src/data/sampleQuestions').sampleQuestionsByBundle;

// Helper to determine if a bundle is a format pack
function isFormatPack(bundle: any) {
  return bundle.category === 'format';
}

// Helper to split questions by type
function splitByType(questions: any[]) {
  const trueFalse = questions.filter(q => q.format === 'True/False');
  const fillBlank = questions.filter(q => q.format === 'Fill-in-the-Blank');
  const multipleChoice = questions.filter(q => q.format === 'Multiple Choice');
  return { trueFalse, fillBlank, multipleChoice };
}

// Use the sampleQuestionsByBundle mapping for format packs
function getFormatPackQuestions(bundle: any) {
  return (sampleQuestionsByBundle[bundle.id] || []).slice(0, 100);
}

// Main export logic
const exportBundles = () => {
  const exportData: any[] = [];
  QUESTION_BUNDLES.forEach(bundle => {
    if (isFormatPack(bundle)) {
      // Format Bundle Pack: Use all questions from the corresponding array
      const selected = getFormatPackQuestions(bundle);
      exportData.push({
        ...bundle,
        questions: selected
      });
      return;
    }
    // Regular bundle: Balanced mix
    const allQuestions = getQuestionsForBundle(bundle.id);
    const { trueFalse, fillBlank, multipleChoice } = splitByType(allQuestions);
    const countPerType = Math.floor(100 / 3);
    const selected = [
      ...trueFalse.slice(0, countPerType),
      ...fillBlank.slice(0, countPerType),
      ...multipleChoice.slice(0, 100 - 2 * countPerType)
    ];
    // Shuffle for randomness
    for (let i = selected.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }
    exportData.push({
      ...bundle,
      questions: selected
    });
  });
  const outPath = path.join(__dirname, `../public/trivia-bundles-2025-Q3.json`);
  fs.writeFileSync(outPath, JSON.stringify(exportData, null, 2));
  console.log(`Exported ${exportData.length} bundles to ${outPath}`);
};

exportBundles();
