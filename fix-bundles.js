const fs = require('fs');

let content = fs.readFileSync('./src/data/bundles.ts', 'utf8');

// Define patterns to match and their replacements
const replacements = [
  // Iron Age
  {
    search: "difficulty: 'hard',\n    format: 'Mixed',\n    historicalAge: 'Iron Age',",
    replace: "difficulty: 'hard',\n    difficultyBreakdown: {\n      easy: 15,\n      medium: 35,\n      hard: 50\n    },\n    format: 'Mixed',\n    historicalAge: 'Iron Age',"
  },
  // Prehistoric
  {
    search: "difficulty: 'hard',\n    format: 'Mixed',\n    historicalAge: 'Prehistoric',",
    replace: "difficulty: 'hard',\n    difficultyBreakdown: {\n      easy: 25,\n      medium: 35,\n      hard: 40\n    },\n    format: 'Mixed',\n    historicalAge: 'Prehistoric',"
  },
  // Multiple Choice format pack
  {
    search: "difficulty: 'medium',\n    format: 'Multiple Choice',",
    replace: "difficulty: 'medium',\n    difficultyBreakdown: {\n      easy: 30,\n      medium: 50,\n      hard: 20\n    },\n    format: 'Multiple Choice',"
  },
  // True/False format pack
  {
    search: "difficulty: 'easy',\n    format: 'True/False',",
    replace: "difficulty: 'easy',\n    difficultyBreakdown: {\n      easy: 60,\n      medium: 30,\n      hard: 10\n    },\n    format: 'True/False',"
  },
  // Beginner difficulty pack
  {
    search: "difficulty: 'easy',\n    format: 'Mixed',\n    releaseDate: '2025-05-02',\n    version: 'v1',\n    bpType: 'DifficultyPackType',",
    replace: "difficulty: 'easy',\n    difficultyBreakdown: {\n      easy: 70,\n      medium: 25,\n      hard: 5\n    },\n    format: 'Mixed',\n    releaseDate: '2025-05-02',\n    version: 'v1',\n    bpType: 'DifficultyPackType',"
  },
  // Advanced difficulty pack
  {
    search: "difficulty: 'hard',\n    format: 'Mixed',\n    releaseDate: '2025-05-02',\n    version: 'v1',\n    bpType: 'DifficultyPackType',",
    replace: "difficulty: 'hard',\n    difficultyBreakdown: {\n      easy: 5,\n      medium: 25,\n      hard: 70\n    },\n    format: 'Mixed',\n    releaseDate: '2025-05-02',\n    version: 'v1',\n    bpType: 'DifficultyPackType',"
  }
];

// Apply all replacements
for (const replacement of replacements) {
  content = content.replace(replacement.search, replacement.replace);
}

fs.writeFileSync('./src/data/bundles.ts', content);
console.log('Successfully updated bundles.ts with difficulty breakdowns');
