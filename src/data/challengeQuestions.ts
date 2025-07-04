import { ChallengeQuestion } from '../types/leaderboard';

// Challenge questions are specially curated for competitive play
// They are balanced across difficulties and designed for head-to-head competition
export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  // EASY QUESTIONS (Quick wins, confidence builders)
  {
    id: 'challenge_easy_1',
    question: 'Which ancient wonder of the world was located in Alexandria?',
    options: ['Hanging Gardens', 'Lighthouse of Alexandria', 'Colossus of Rhodes', 'Temple of Artemis'],
    correctAnswer: 1,
    explanation: 'The Lighthouse of Alexandria (Pharos) was one of the Seven Wonders of the Ancient World.',
    difficulty: 'easy',
    category: 'Ancient Wonders',
    timeLimit: 15
  },
  {
    id: 'challenge_easy_2',
    question: 'What was the primary writing material used in ancient Egypt?',
    options: ['Clay tablets', 'Papyrus', 'Parchment', 'Stone slabs'],
    correctAnswer: 1,
    explanation: 'Papyrus, made from the papyrus plant, was the primary writing material in ancient Egypt.',
    difficulty: 'easy',
    category: 'Ancient Egypt',
    timeLimit: 15
  },
  {
    id: 'challenge_easy_3',
    question: 'Which Roman emperor built a famous wall across northern Britain?',
    options: ['Julius Caesar', 'Augustus', 'Hadrian', 'Trajan'],
    correctAnswer: 2,
    explanation: "Hadrian's Wall was built by Emperor Hadrian around 122 AD to defend Roman Britain.",
    difficulty: 'easy',
    category: 'Roman Empire',
    timeLimit: 15
  },
  {
    id: 'challenge_easy_4',
    question: 'What was the main language of the Byzantine Empire?',
    options: ['Latin', 'Greek', 'Turkish', 'Arabic'],
    correctAnswer: 1,
    explanation: 'Greek was the primary language of the Byzantine Empire, though Latin was used initially.',
    difficulty: 'easy',
    category: 'Byzantine Empire',
    timeLimit: 15
  },
  {
    id: 'challenge_easy_5',
    question: 'Which ancient Greek city-state was known for its military prowess?',
    options: ['Athens', 'Sparta', 'Corinth', 'Thebes'],
    correctAnswer: 1,
    explanation: 'Sparta was renowned for its disciplined military society and warrior culture.',
    difficulty: 'easy',
    category: 'Ancient Greece',
    timeLimit: 15
  },

  // MEDIUM QUESTIONS (Competitive edge, knowledge depth)
  {
    id: 'challenge_medium_1',
    question: 'Which Mesopotamian king created the first known written code of laws?',
    options: ['Sargon of Akkad', 'Nebuchadnezzar II', 'Hammurabi', 'Gilgamesh'],
    correctAnswer: 2,
    explanation: 'Hammurabi created the Code of Hammurabi around 1750 BCE, one of the earliest legal codes.',
    difficulty: 'medium',
    category: 'Mesopotamia',
    timeLimit: 20
  },
  {
    id: 'challenge_medium_2',
    question: 'What was the primary cause of the Bronze Age Collapse around 1200 BCE?',
    options: ['Natural disasters', 'Sea Peoples invasions', 'Internal rebellions', 'Climate change'],
    correctAnswer: 1,
    explanation: 'The Sea Peoples were mysterious invaders who contributed significantly to the Bronze Age Collapse.',
    difficulty: 'medium',
    category: 'Bronze Age',
    timeLimit: 20
  },
  {
    id: 'challenge_medium_3',
    question: 'Which Chinese dynasty first unified China under a single emperor?',
    options: ['Han Dynasty', 'Qin Dynasty', 'Zhou Dynasty', 'Tang Dynasty'],
    correctAnswer: 1,
    explanation: 'The Qin Dynasty under Emperor Qin Shi Huang first unified China in 221 BCE.',
    difficulty: 'medium',
    category: 'Ancient China',
    timeLimit: 20
  },
  {
    id: 'challenge_medium_4',
    question: 'What was the name of the Aztec capital city?',
    options: ['Cusco', 'Chichen Itza', 'Tenochtitlan', 'Tikal'],
    correctAnswer: 2,
    explanation: 'Tenochtitlan was the magnificent capital of the Aztec Empire, built on Lake Texcoco.',
    difficulty: 'medium',
    category: 'Ancient Americas',
    timeLimit: 20
  },
  {
    id: 'challenge_medium_5',
    question: 'Which ancient Indian empire was ruled by Chandragupta Maurya?',
    options: ['Gupta Empire', 'Mauryan Empire', 'Mughal Empire', 'Chola Empire'],
    correctAnswer: 1,
    explanation: 'Chandragupta Maurya founded the Mauryan Empire around 321 BCE.',
    difficulty: 'medium',
    category: 'Ancient India',
    timeLimit: 20
  },
  {
    id: 'challenge_medium_6',
    question: 'What was the primary building material of Mesopotamian ziggurats?',
    options: ['Stone blocks', 'Mud bricks', 'Wooden planks', 'Metal sheets'],
    correctAnswer: 1,
    explanation: 'Ziggurats were built primarily with mud bricks due to the scarcity of stone in Mesopotamia.',
    difficulty: 'medium',
    category: 'Mesopotamia',
    timeLimit: 20
  },
  {
    id: 'challenge_medium_7',
    question: 'Which pharaoh moved Egypt\'s capital to Amarna and promoted monotheism?',
    options: ['Ramesses II', 'Tutankhamun', 'Akhenaten', 'Hatshepsut'],
    correctAnswer: 2,
    explanation: 'Akhenaten moved the capital to Amarna and promoted worship of the sun god Aten.',
    difficulty: 'medium',
    category: 'Ancient Egypt',
    timeLimit: 20
  },

  // HARD QUESTIONS (Expert level, decisive factors)
  {
    id: 'challenge_hard_1',
    question: 'Which Hittite king signed the world\'s first known peace treaty?',
    options: ['Suppiluliuma I', 'Hattusili III', 'Mursili II', 'Tudhaliya IV'],
    correctAnswer: 1,
    explanation: 'Hattusili III signed the Egyptian-Hittite peace treaty with Ramesses II around 1259 BCE.',
    difficulty: 'hard',
    category: 'Ancient Near East',
    timeLimit: 25
  },
  {
    id: 'challenge_hard_2',
    question: 'What was the name of the Spartan military formation that proved so effective?',
    options: ['Testudo', 'Phalanx', 'Wedge', 'Manipular'],
    correctAnswer: 1,
    explanation: 'The phalanx formation, with overlapping shields and long spears, was the backbone of Spartan military might.',
    difficulty: 'hard',
    category: 'Ancient Greece',
    timeLimit: 25
  },
  {
    id: 'challenge_hard_3',
    question: 'Which Roman general defeated Hannibal at the Battle of Zama?',
    options: ['Scipio Africanus', 'Fabius Maximus', 'Marcellus', 'Flamininus'],
    correctAnswer: 0,
    explanation: 'Scipio Africanus defeated Hannibal at Zama in 202 BCE, ending the Second Punic War.',
    difficulty: 'hard',
    category: 'Roman Empire',
    timeLimit: 25
  },
  {
    id: 'challenge_hard_4',
    question: 'What was the administrative system called that divided the Persian Empire?',
    options: ['Themes', 'Satrapies', 'Provinces', 'Duchies'],
    correctAnswer: 1,
    explanation: 'The Persian Empire was divided into satrapies, each governed by a satrap appointed by the king.',
    difficulty: 'hard',
    category: 'Persian Empire',
    timeLimit: 25
  },
  {
    id: 'challenge_hard_5',
    question: 'Which Mayan city-state dominated the Classic Period and had the tallest pyramid?',
    options: ['Palenque', 'Tikal', 'Copán', 'Calakmul'],
    correctAnswer: 1,
    explanation: 'Tikal was one of the most powerful Maya city-states and Temple IV is the tallest pre-Columbian structure.',
    difficulty: 'hard',
    category: 'Ancient Americas',
    timeLimit: 25
  },
  {
    id: 'challenge_hard_6',
    question: 'What was the name of the ancient Sumerian epic poem about a legendary king?',
    options: ['Enuma Elish', 'Epic of Gilgamesh', 'Atrahasis', 'Descent of Inanna'],
    correctAnswer: 1,
    explanation: 'The Epic of Gilgamesh is one of the earliest known works of literature, from ancient Sumer.',
    difficulty: 'hard',
    category: 'Mesopotamia',
    timeLimit: 25
  },
  {
    id: 'challenge_hard_7',
    question: 'Which Chinese philosophy emphasized harmony with the natural order (Dao)?',
    options: ['Confucianism', 'Legalism', 'Taoism', 'Mohism'],
    correctAnswer: 2,
    explanation: 'Taoism (Daoism) emphasized living in harmony with the Dao, the natural order of the universe.',
    difficulty: 'hard',
    category: 'Ancient China',
    timeLimit: 25
  },
  {
    id: 'challenge_hard_8',
    question: 'What was the name of the Celtic warrior queen who led a revolt against Rome?',
    options: ['Cartimandua', 'Boudica', 'Medb', 'Brigantia'],
    correctAnswer: 1,
    explanation: 'Boudica led the Iceni tribe in a major uprising against Roman rule in Britain around 60-61 CE.',
    difficulty: 'hard',
    category: 'Celtic Britain',
    timeLimit: 25
  },

  // EXPERT QUESTIONS (Tiebreakers, ultimate challenges)
  {
    id: 'challenge_expert_1',
    question: 'Which Akkadian princess was the first known author in history?',
    options: ['Enheduanna', 'Sargon\'s daughter', 'Naram-Sin\'s wife', 'Kubaba'],
    correctAnswer: 0,
    explanation: 'Enheduanna, daughter of Sargon of Akkad, is considered the first known author in world history.',
    difficulty: 'hard',
    category: 'Mesopotamia',
    timeLimit: 30
  },
  {
    id: 'challenge_expert_2',
    question: 'What was the name of the ancient Egyptian calendar system with 365 days?',
    options: ['Lunar calendar', 'Civil calendar', 'Sothic calendar', 'Coptic calendar'],
    correctAnswer: 1,
    explanation: 'The ancient Egyptian civil calendar had 365 days divided into 12 months of 30 days plus 5 extra days.',
    difficulty: 'hard',
    category: 'Ancient Egypt',
    timeLimit: 30
  },
  {
    id: 'challenge_expert_3',
    question: 'Which Indo-European migration theory explains the spread of languages?',
    options: ['Anatolian hypothesis', 'Kurgan hypothesis', 'Paleolithic continuity', 'Armenian hypothesis'],
    correctAnswer: 1,
    explanation: 'The Kurgan hypothesis suggests Indo-European languages spread from the Pontic-Caspian steppe.',
    difficulty: 'hard',
    category: 'Prehistoric',
    timeLimit: 30
  },
  {
    id: 'challenge_expert_4',
    question: 'What was the name of the Minoan writing system that remains undeciphered?',
    options: ['Linear A', 'Linear B', 'Cretan hieroglyphs', 'Phaistos Disc'],
    correctAnswer: 0,
    explanation: 'Linear A was used by the Minoans and remains undeciphered, unlike Linear B which was cracked.',
    difficulty: 'hard',
    category: 'Ancient Greece',
    timeLimit: 30
  }
];

// Function to get random challenge questions
export const getRandomChallengeQuestions = (
  count: number = 20,
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed'
): ChallengeQuestion[] => {
  let availableQuestions = [...CHALLENGE_QUESTIONS];
  
  if (difficulty && difficulty !== 'mixed') {
    availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
  }
  
  // For mixed difficulty, ensure balanced distribution
  if (difficulty === 'mixed' || !difficulty) {
    const easyQuestions = availableQuestions.filter(q => q.difficulty === 'easy');
    const mediumQuestions = availableQuestions.filter(q => q.difficulty === 'medium');
    const hardQuestions = availableQuestions.filter(q => q.difficulty === 'hard');
    
    // Balanced distribution: 40% easy, 40% medium, 20% hard
    const easyCount = Math.floor(count * 0.4);
    const mediumCount = Math.floor(count * 0.4);
    const hardCount = count - easyCount - mediumCount;
    
    const selectedQuestions = [
      ...getRandomFromArray(easyQuestions, easyCount),
      ...getRandomFromArray(mediumQuestions, mediumCount),
      ...getRandomFromArray(hardQuestions, hardCount)
    ];
    
    // Shuffle the final array
    return shuffleArray(selectedQuestions);
  }
  
  return getRandomFromArray(availableQuestions, count);
};

// Helper function to get random items from array
const getRandomFromArray = <T>(array: T[], count: number): T[] => {
  const shuffled = shuffleArray([...array]);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Helper function to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get questions by category for themed challenges
export const getChallengeQuestionsByCategory = (
  category: string,
  count: number = 20
): ChallengeQuestion[] => {
  const categoryQuestions = CHALLENGE_QUESTIONS.filter(q => 
    q.category.toLowerCase().includes(category.toLowerCase())
  );
  return getRandomFromArray(categoryQuestions, count);
};

// Get questions by difficulty for skill-matched challenges
export const getChallengeQuestionsByDifficulty = (
  difficulty: 'easy' | 'medium' | 'hard',
  count: number = 20
): ChallengeQuestion[] => {
  const difficultyQuestions = CHALLENGE_QUESTIONS.filter(q => q.difficulty === difficulty);
  return getRandomFromArray(difficultyQuestions, count);
};
