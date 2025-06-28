import { Question, QuestionBundle } from '../types';
import { QUESTION_BUNDLES } from './bundles';

// AP-Level HARD Ancient History Questions - Free Quiz to Hook Users on Deep Learning
export const sampleQuestions: Question[] = [
  // Multiple Choice Questions (11 questions - 33%)
  {
    id: 'ap-hard-001',
    question: 'The Athenian practice of ostracism was primarily designed to prevent which political phenomenon?',
    options: ['Foreign invasion', 'Tyranny and concentration of power', 'Economic inequality', 'Religious persecution'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Politics',
    region: 'Greece',
    period: 'Classical',
    explanation: 'Ostracism allowed Athenian citizens to exile prominent politicians for 10 years without trial, preventing any individual from accumulating too much power and potentially becoming a tyrant.',
    tags: ['ostracism', 'athens', 'democracy', 'tyranny']
  },
  {
    id: 'ap-hard-002',
    question: 'Which factor most directly contributed to the collapse of the Late Bronze Age civilizations around 1200 BCE?',
    options: ['Climate change alone', 'Invasions by the Sea Peoples', 'Economic systems collapse and multiple invasions', 'Volcanic eruptions'],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'Historical Analysis',
    region: 'Mediterranean',
    period: 'Bronze Age',
    explanation: 'The Late Bronze Age Collapse was caused by multiple interconnected factors: invasions by Sea Peoples, internal conflicts, economic system failures, and possible climate change, creating a cascade of civilizational collapse.',
    tags: ['bronze age collapse', 'sea peoples', 'systems collapse']
  },
  {
    id: 'ap-hard-003',
    question: 'The Roman Principate established by Augustus represented which form of government?',
    options: ['Constitutional monarchy', 'Military dictatorship', 'Disguised autocracy with republican facade', 'Democratic republic'],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'Politics',
    region: 'Rome',
    period: 'Early Empire',
    explanation: 'The Principate maintained the outward forms and institutions of the Republic while concentrating real power in the hands of the emperor, creating a system that appeared republican but functioned as an autocracy.',
    tags: ['principate', 'augustus', 'roman government', 'autocracy']
  },
  {
    id: 'ap-hard-004',
    question: 'Which philosophical school\'s emphasis on virtue ethics most directly influenced Roman Stoic political thought?',
    options: ['Platonic idealism', 'Aristotelian ethics', 'Epicurean materialism', 'Cynic asceticism'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Philosophy',
    region: 'Greece',
    period: 'Classical',
    explanation: 'Aristotelian virtue ethics, particularly the concept of practical wisdom (phronesis) and the golden mean, provided the foundation for Roman Stoic political philosophy as developed by figures like Cicero and Marcus Aurelius.',
    tags: ['aristotle', 'virtue ethics', 'stoicism', 'roman philosophy']
  },
  {
    id: 'ap-hard-005',
    question: 'The Amarna Period in Egyptian history is most significant for representing what type of historical change?',
    options: ['Military expansion', 'Religious revolution and artistic transformation', 'Economic modernization', 'Democratic reforms'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Religion',
    region: 'Egypt',
    period: 'New Kingdom',
    explanation: 'Akhenaten\'s reign brought revolutionary changes: monotheistic worship of Aten, radical artistic styles showing naturalism, and temporary abandonment of traditional Egyptian religious practices.',
    tags: ['amarna period', 'akhenaten', 'aten', 'religious revolution']
  },
  {
    id: 'ap-hard-006',
    question: 'Which aspect of Mesopotamian law codes like Hammurabi\'s most influenced later legal traditions?',
    options: ['Democratic participation', 'Proportional justice and precedent', 'Religious authority', 'Economic regulation'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Law',
    region: 'Mesopotamia',
    period: 'Bronze Age',
    explanation: 'The principle of proportional justice (lex talionis) and the establishment of written legal precedents in Mesopotamian codes influenced legal systems throughout the ancient world and beyond.',
    tags: ['hammurabi', 'lex talionis', 'legal precedent', 'proportional justice']
  },
  {
    id: 'ap-hard-007',
    question: 'The Chinese Mandate of Heaven concept most directly challenged which aspect of traditional monarchy?',
    options: ['Hereditary succession', 'Divine right as permanent and unconditional', 'Military authority', 'Economic control'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Politics',
    region: 'China',
    period: 'Imperial',
    explanation: 'Unlike Western divine right theory, the Mandate of Heaven made royal authority conditional on virtuous rule, allowing for legitimate rebellion against corrupt rulers and dynastic change.',
    tags: ['mandate of heaven', 'chinese politics', 'conditional authority', 'dynastic change']
  },
  {
    id: 'ap-hard-008',
    question: 'Which factor most explains the rapid expansion of Alexander\'s empire compared to previous Greek military campaigns?',
    options: ['Superior numbers', 'Combined arms tactics and cultural integration', 'Naval supremacy', 'Economic resources'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Military',
    region: 'Macedonia',
    period: 'Hellenistic',
    explanation: 'Alexander\'s success came from innovative combined arms tactics (cavalry, infantry, siege engines) and his policy of cultural integration, adopting local customs and incorporating conquered peoples into his administration.',
    tags: ['alexander', 'combined arms', 'cultural integration', 'hellenistic expansion']
  },
  {
    id: 'ap-hard-009',
    question: 'The Indus Valley Civilization\'s urban planning suggests which level of social organization?',
    options: ['Tribal confederations', 'Centralized state with sophisticated administration', 'City-state system', 'Nomadic settlements'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Urban Planning',
    region: 'India',
    period: 'Bronze Age',
    explanation: 'The standardized weights, measures, brick sizes, and sophisticated drainage systems across Indus Valley cities indicate a highly centralized state with advanced administrative capabilities.',
    tags: ['indus valley', 'urban planning', 'centralized state', 'administration']
  },
  {
    id: 'ap-hard-010',
    question: 'Which characteristic of Persian imperial administration most contributed to its longevity?',
    options: ['Military force', 'Cultural tolerance and local autonomy', 'Economic exploitation', 'Religious conversion'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Administration',
    region: 'Persia',
    period: 'Classical',
    explanation: 'Persian success came from respecting local customs, religions, and administrative practices while maintaining overall imperial unity, as seen in Cyrus\'s policies toward conquered peoples.',
    tags: ['persian empire', 'cultural tolerance', 'imperial administration', 'cyrus']
  },
  {
    id: 'ap-hard-011',
    question: 'The Maya Long Count calendar system demonstrates which level of mathematical and astronomical knowledge?',
    options: ['Basic arithmetic', 'Advanced positional notation and astronomical calculation', 'Simple seasonal tracking', 'Religious symbolism only'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Astronomy',
    region: 'Mesoamerica',
    period: 'Classical',
    explanation: 'The Maya developed sophisticated positional notation with zero, calculated planetary cycles with remarkable accuracy, and created a calendar system more precise than the Julian calendar.',
    tags: ['maya', 'long count', 'positional notation', 'astronomical calculation']
  },

  // True/False Questions (11 questions - 33%)
  {
    id: 'ap-hard-tf-001',
    question: 'The Roman Republic\'s system of checks and balances was primarily designed to prevent any single individual from gaining absolute power.',
    options: ['True', 'False'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Politics',
    region: 'Rome',
    period: 'Republic',
    explanation: 'True. The Roman Republic featured multiple consuls, tribunes with veto power, term limits, and the Senate to create a complex system of checks and balances specifically designed to prevent tyranny.',
    tags: ['roman republic', 'checks and balances', 'tyranny prevention']
  },
  {
    id: 'ap-hard-tf-002',
    question: 'The Phoenician alphabet was the direct ancestor of both the Greek and Latin alphabets.',
    options: ['True', 'False'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Writing Systems',
    region: 'Mediterranean',
    period: 'Iron Age',
    explanation: 'True. The Phoenician alphabet provided the foundation for the Greek alphabet (which added vowels), and the Greek alphabet in turn influenced the Etruscan and Latin alphabets.',
    tags: ['phoenician alphabet', 'greek alphabet', 'latin alphabet', 'writing evolution']
  },
  {
    id: 'ap-hard-tf-003',
    question: 'The Egyptian pharaoh Akhenaten successfully established permanent monotheistic worship in Egypt.',
    options: ['True', 'False'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Religion',
    region: 'Egypt',
    period: 'New Kingdom',
    explanation: 'False. While Akhenaten temporarily established Aten worship, traditional polytheistic religion was restored immediately after his death by Tutankhamun and subsequent pharaohs.',
    tags: ['akhenaten', 'aten', 'monotheism', 'religious restoration']
  },
  {
    id: 'ap-hard-tf-004',
    question: 'The Spartan agoge education system was available to all male children regardless of social class.',
    options: ['True', 'False'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Education',
    region: 'Greece',
    period: 'Classical',
    explanation: 'False. The agoge was only for Spartan citizens (Spartiates). Helots and perioeci were excluded from this military education system.',
    tags: ['spartan agoge', 'spartan society', 'social classes', 'military education']
  },
  {
    id: 'ap-hard-tf-005',
    question: 'The Chinese concept of the Mandate of Heaven allowed for legitimate rebellion against corrupt rulers.',
    options: ['True', 'False'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Politics',
    region: 'China',
    period: 'Imperial',
    explanation: 'True. The Mandate of Heaven made imperial authority conditional on virtuous rule, meaning that natural disasters or social chaos could indicate loss of the mandate, justifying rebellion.',
    tags: ['mandate of heaven', 'legitimate rebellion', 'conditional authority']
  },
  {
    id: 'ap-hard-tf-006',
    question: 'The Minoan civilization of Crete was conquered and destroyed by the Mycenaean Greeks.',
    options: ['True', 'False'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Historical Events',
    region: 'Mediterranean',
    period: 'Bronze Age',
    explanation: 'False. While Mycenaeans may have taken control of Crete later, the Minoan civilization appears to have declined due to natural disasters (possibly volcanic eruption at Thera) and internal factors.',
    tags: ['minoans', 'mycenaeans', 'bronze age collapse', 'natural disasters']
  },
  {
    id: 'ap-hard-tf-007',
    question: 'The Persian Empire under Cyrus the Great practiced religious tolerance as a deliberate policy of imperial administration.',
    options: ['True', 'False'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Administration',
    region: 'Persia',
    period: 'Classical',
    explanation: 'True. Cyrus\'s Cylinder and other evidence show that religious tolerance was a conscious policy designed to maintain stability and loyalty among diverse conquered peoples.',
    tags: ['cyrus cylinder', 'religious tolerance', 'persian administration']
  },
  {
    id: 'ap-hard-tf-008',
    question: 'The Roman Colosseum was built primarily for gladiatorial games and had no other significant functions.',
    options: ['True', 'False'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Architecture',
    region: 'Rome',
    period: 'Empire',
    explanation: 'False. While famous for gladiatorial games, the Colosseum also hosted naval battles (naumachiae), animal hunts (venationes), public executions, and religious ceremonies.',
    tags: ['colosseum', 'gladiatorial games', 'naumachiae', 'roman entertainment']
  },
  {
    id: 'ap-hard-tf-009',
    question: 'The Sumerian invention of the wheel was primarily motivated by transportation needs.',
    options: ['True', 'False'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Technology',
    region: 'Mesopotamia',
    period: 'Bronze Age',
    explanation: 'False. The earliest wheels were potter\'s wheels for ceramic production. Wheeled vehicles for transportation came later, showing how technological innovation often has unexpected applications.',
    tags: ['sumerian wheel', 'pottery', 'technological innovation', 'transportation']
  },
  {
    id: 'ap-hard-tf-010',
    question: 'The Maya civilization developed a sophisticated understanding of zero independently of other world cultures.',
    options: ['True', 'False'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Mathematics',
    region: 'Mesoamerica',
    period: 'Classical',
    explanation: 'True. The Maya developed the concept of zero for their mathematical and calendrical calculations independently of developments in India and other regions.',
    tags: ['maya mathematics', 'zero concept', 'independent development', 'calendrical calculation']
  },
  {
    id: 'ap-hard-tf-011',
    question: 'The decline of the Western Roman Empire was primarily caused by barbarian invasions rather than internal factors.',
    options: ['True', 'False'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Historical Analysis',
    region: 'Rome',
    period: 'Late Empire',
    explanation: 'False. Modern scholarship emphasizes internal factors: economic crisis, political instability, military problems, and administrative challenges. "Barbarian" groups were often foederati (allies) who filled power vacuums.',
    tags: ['roman decline', 'internal factors', 'foederati', 'historical analysis']
  },

  // Fill-in-the-Blank Questions (11 questions - 33%)
  {
    id: 'ap-hard-fib-001',
    question: 'The Athenian statesman _____ implemented democratic reforms including the creation of the Council of 500 and the practice of ostracism.',
    options: ['Cleisthenes', 'Solon', 'Pericles', 'Draco'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Politics',
    region: 'Greece',
    period: 'Classical',
    explanation: 'Cleisthenes (c. 570-508 BCE) is known as the "father of democracy" for his reforms that established the democratic system in Athens, including the Council of 500 and ostracism.',
    tags: ['cleisthenes', 'athenian democracy', 'council of 500', 'democratic reforms']
  },
  {
    id: 'ap-hard-fib-002',
    question: 'The Roman historian _____ wrote "Germania," providing crucial ethnographic information about Germanic tribes.',
    options: ['Tacitus', 'Livy', 'Suetonius', 'Plutarch'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Literature',
    region: 'Rome',
    period: 'Empire',
    explanation: 'Tacitus wrote "Germania" (98 CE), which remains one of our most important sources for understanding Germanic tribal culture and society in the early imperial period.',
    tags: ['tacitus', 'germania', 'ethnography', 'germanic tribes']
  },
  {
    id: 'ap-hard-fib-003',
    question: 'The Egyptian queen _____ ruled as pharaoh for approximately 22 years and commissioned extensive building projects including her mortuary temple at Deir el-Bahari.',
    options: ['Hatshepsut', 'Nefertiti', 'Cleopatra', 'Ankhesenamun'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Politics',
    region: 'Egypt',
    period: 'New Kingdom',
    explanation: 'Hatshepsut (r. 1479-1458 BCE) was one of the most successful female pharaohs, known for her peaceful reign, extensive trade expeditions, and architectural achievements.',
    tags: ['hatshepsut', 'female pharaoh', 'deir el-bahari', 'new kingdom']
  },
  {
    id: 'ap-hard-fib-004',
    question: 'The Chinese philosophy of _____ emphasized wu wei (non-action) and harmony with the natural order of the universe.',
    options: ['Taoism', 'Confucianism', 'Legalism', 'Buddhism'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Philosophy',
    region: 'China',
    period: 'Classical',
    explanation: 'Taoism, founded by Laozi, emphasized wu wei (effortless action) and living in harmony with the Tao (the Way), contrasting with Confucian emphasis on social order.',
    tags: ['taoism', 'wu wei', 'laozi', 'natural harmony']
  },
  {
    id: 'ap-hard-fib-005',
    question: 'The Mesopotamian epic of _____ contains one of the earliest known flood narratives and explores themes of mortality and friendship.',
    options: ['Gilgamesh', 'Enuma Elish', 'Atrahasis', 'Inanna'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Literature',
    region: 'Mesopotamia',
    period: 'Bronze Age',
    explanation: 'The Epic of Gilgamesh, one of the world\'s earliest literary works, includes the flood story told by Utnapishtim and explores the friendship between Gilgamesh and Enkidu.',
    tags: ['gilgamesh', 'flood narrative', 'mesopotamian literature', 'mortality themes']
  },
  {
    id: 'ap-hard-fib-006',
    question: 'The Indian emperor _____ converted to Buddhism after the bloody Kalinga War and promoted Buddhist values throughout his empire.',
    options: ['Ashoka', 'Chandragupta', 'Harsha', 'Samudragupta'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Religion',
    region: 'India',
    period: 'Mauryan',
    explanation: 'Ashoka the Great (r. 268-232 BCE) converted to Buddhism after witnessing the carnage of the Kalinga War and subsequently promoted Buddhist principles of non-violence and dharma.',
    tags: ['ashoka', 'kalinga war', 'buddhist conversion', 'mauryan empire']
  },
  {
    id: 'ap-hard-fib-007',
    question: 'The Persian king _____ established the first organized postal system and divided his empire into satrapies for administrative efficiency.',
    options: ['Darius I', 'Cyrus', 'Xerxes', 'Cambyses'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Administration',
    region: 'Persia',
    period: 'Classical',
    explanation: 'Darius I (r. 522-486 BCE) organized the Persian Empire into satrapies, built the Royal Road, and established an efficient postal system that enabled rapid communication across the empire.',
    tags: ['darius', 'satrapies', 'royal road', 'persian administration']
  },
  {
    id: 'ap-hard-fib-008',
    question: 'The Maya city of _____ was one of the largest urban centers in the ancient Americas and featured sophisticated astronomical observatories.',
    options: ['Tikal', 'Chichen Itza', 'Palenque', 'Copan'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Architecture',
    region: 'Mesoamerica',
    period: 'Classical',
    explanation: 'Tikal was one of the largest Maya cities, with a population possibly exceeding 100,000, and featured impressive pyramids and astronomical observation platforms.',
    tags: ['tikal', 'maya urbanism', 'astronomical observatories', 'mesoamerican cities']
  },
  {
    id: 'ap-hard-fib-009',
    question: 'The Roman legal principle of _____ established that an accused person is innocent until proven guilty.',
    options: ['presumption of innocence', 'habeas corpus', 'due process', 'burden of proof'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Law',
    region: 'Rome',
    period: 'Empire',
    explanation: 'The presumption of innocence (presumptio innocentiae) was a fundamental principle in Roman law that influenced legal systems throughout the Western world.',
    tags: ['roman law', 'presumption of innocence', 'legal principles', 'jurisprudence']
  },
  {
    id: 'ap-hard-fib-010',
    question: 'The ancient library of _____ in Mesopotamia contained over 30,000 cuneiform tablets and preserved much of ancient Near Eastern literature.',
    options: ['Nineveh', 'Babylon', 'Ur', 'Mari'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Culture',
    region: 'Mesopotamia',
    period: 'Iron Age',
    explanation: 'The Library of Ashurbanipal at Nineveh (7th century BCE) was one of the world\'s first organized libraries, preserving thousands of cuneiform tablets including the Epic of Gilgamesh.',
    tags: ['library of ashurbanipal', 'nineveh', 'cuneiform tablets', 'ancient libraries']
  },
  {
    id: 'ap-hard-fib-011',
    question: 'The Greek historian _____ is considered the "Father of History" for his systematic investigation of the Persian Wars.',
    options: ['Herodotus', 'Thucydides', 'Xenophon', 'Polybius'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Literature',
    region: 'Greece',
    period: 'Classical',
    explanation: 'Herodotus (c. 484-425 BCE) earned the title "Father of History" for his systematic investigation and recording of the Persian Wars and his ethnographic observations.',
    tags: ['herodotus', 'father of history', 'persian wars', 'historical methodology']
  }
];

// Sample Question Bundles
export const questionBundles: QuestionBundle[] = [
  {
    id: 'ancient-egypt',
    name: 'Ancient Egypt',
    description: 'Explore the mysteries of pharaohs, pyramids, and the Nile civilization',
    questions: sampleQuestions.filter(q => q.region === 'Egypt'),
    difficulty: 'medium',
    category: 'Civilization',
    region: 'Egypt',
    period: 'All Periods',
    isPremium: false,
    icon: '🏺'
  },
  {
    id: 'roman-empire',
    name: 'Roman Empire',
    description: 'From Republic to Empire - the rise and fall of Rome',
    questions: sampleQuestions.filter(q => q.region === 'Rome'),
    difficulty: 'medium',
    category: 'Civilization',
    region: 'Rome',
    period: 'Classical',
    isPremium: false,
    icon: '🏛️'
  },
  {
    id: 'ancient-greece',
    name: 'Ancient Greece',
    description: 'Philosophy, democracy, and the birthplace of Western civilization',
    questions: sampleQuestions.filter(q => q.region === 'Greece'),
    difficulty: 'easy',
    category: 'Civilization',
    region: 'Greece',
    period: 'Classical',
    isPremium: false,
    icon: '⚱️'
  },
  {
    id: 'world-civilizations',
    name: 'World Civilizations Mix',
    description: 'A comprehensive mix of questions from civilizations around the world',
    questions: sampleQuestions,
    difficulty: 'medium',
    category: 'Mixed',
    region: 'Global',
    period: 'All Periods',
    isPremium: false,
    icon: '🌍'
  },
  {
    id: 'premium-masters',
    name: 'Masters Collection',
    description: 'Advanced questions for true history scholars',
    questions: sampleQuestions.filter(q => q.difficulty === 'hard'),
    difficulty: 'hard',
    category: 'Advanced',
    region: 'Global',
    period: 'All Periods',
    isPremium: true,
    price: 4.99,
    icon: '👑'
  }
];

// Utility functions
export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Question[] => {
  return sampleQuestions.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByRegion = (region: string): Question[] => {
  return sampleQuestions.filter(q => q.region.toLowerCase() === region.toLowerCase());
};

export const getQuestionsByCategory = (category: string): Question[] => {
  return sampleQuestions.filter(q => q.category.toLowerCase() === category.toLowerCase());
};

export const getRandomQuestions = (count: number): Question[] => {
  // Import EnhancedQuizService for better question distribution
  // For now, maintain backward compatibility with simple random selection
  const shuffled = [...sampleQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Enhanced random questions with proper distribution
export const getEnhancedRandomQuestions = (count: number = 10): Question[] => {
  // This will be used by the Enhanced Quiz Service
  // 33% Easy, 33% Medium, 33% Hard distribution
  const easyCount = Math.floor(count * 0.33);
  const mediumCount = Math.floor(count * 0.33);
  const hardCount = count - easyCount - mediumCount;
  
  const easyQuestions = sampleQuestions.filter(q => q.difficulty === 'easy');
  const mediumQuestions = sampleQuestions.filter(q => q.difficulty === 'medium');
  const hardQuestions = sampleQuestions.filter(q => q.difficulty === 'hard');
  
  const selectedQuestions: Question[] = [];
  
  // Shuffle and select from each difficulty
  const shuffledEasy = [...easyQuestions].sort(() => 0.5 - Math.random());
  const shuffledMedium = [...mediumQuestions].sort(() => 0.5 - Math.random());
  const shuffledHard = [...hardQuestions].sort(() => 0.5 - Math.random());
  
  selectedQuestions.push(...shuffledEasy.slice(0, easyCount));
  selectedQuestions.push(...shuffledMedium.slice(0, mediumCount));
  selectedQuestions.push(...shuffledHard.slice(0, hardCount));
  
  // Final shuffle to mix difficulties
  return selectedQuestions.sort(() => 0.5 - Math.random());
};

export const getBundleById = (id: string): QuestionBundle | undefined => {
  const enhancedBundle = QUESTION_BUNDLES.find(bundle => bundle.id === id);
  if (!enhancedBundle) return undefined;
  
  // Convert enhanced bundle to legacy format for compatibility
  return {
    id: enhancedBundle.id,
    name: enhancedBundle.name,
    description: enhancedBundle.description,
    questions: getQuestionsForBundle(id),
    difficulty: enhancedBundle.difficulty,
    category: enhancedBundle.subcategory,
    region: enhancedBundle.subcategory,
    period: enhancedBundle.historicalAge || 'Ancient',
    isPremium: enhancedBundle.isPremium,
    price: enhancedBundle.price,
    icon: '🏛️'
  };
};

export const getQuestionsForBundle = (bundleId: string): Question[] => {
  const bundle = QUESTION_BUNDLES.find(b => b.id === bundleId);
  if (!bundle) return [];
  
  // For now, return random questions filtered by bundle properties
  // In a real app, you would use bundle.questions array to get specific question IDs
  const filteredQuestions = sampleQuestions.filter(q => {
    // Match questions based on bundle category and subcategory
    switch (bundle.category) {
      case 'region':
        return q.region.toLowerCase() === bundle.subcategory.toLowerCase();
      case 'historical_age':
        return q.period.toLowerCase().includes(bundle.subcategory.toLowerCase());
      case 'difficulty':
        return q.difficulty === bundle.difficulty;
      default:
        return true;
    }
  });
  
  // Return up to the bundle's question count
  return filteredQuestions.slice(0, bundle.questionCount);
};
