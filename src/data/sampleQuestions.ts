import { Question } from '../types';

// Sample questions organized by bundle with proper difficulty distribution
// 33% Easy (Elementary Level), 33% Medium (Middle School), 33% Hard (High School)

export const sampleQuestionsByBundle: { [bundleId: string]: Question[] } = {
  // Ancient Rome Pack
  region_pack_rome: [
    // Easy Questions (Elementary Level)
    {
      id: 'rome-easy-1',
      question: 'What was the capital city of the Roman Empire?',
      options: ['Athens', 'Rome', 'Alexandria', 'Constantinople'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Geography',
      region: 'Rome',
      period: 'Empire',
      explanation: 'Rome was the capital and largest city of the Roman Empire.',
      tags: ['capital', 'city', 'empire']
    },
    {
      id: 'rome-easy-2',
      question: 'Roman soldiers were called:',
      options: ['Knights', 'Legionnaires', 'Warriors', 'Guards'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Military',
      region: 'Rome',
      period: 'Empire',
      explanation: 'Roman soldiers were organized into legions and called legionnaires.',
      tags: ['soldiers', 'military', 'legions']
    },
    {
      id: 'rome-easy-3',
      question: 'What did Romans build to carry water to their cities?',
      options: ['Bridges', 'Aqueducts', 'Roads', 'Walls'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Engineering',
      region: 'Rome',
      period: 'Empire',
      explanation: 'Aqueducts were engineering marvels that transported water across long distances.',
      tags: ['water', 'engineering', 'aqueducts']
    },
    // Medium Questions (Middle School Level)
    {
      id: 'rome-medium-1',
      question: 'Which Roman leader was assassinated on the Ides of March?',
      options: ['Augustus', 'Julius Caesar', 'Mark Antony', 'Pompey'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Politics',
      region: 'Rome',
      period: 'Late Republic',
      explanation: 'Julius Caesar was assassinated on March 15, 44 BCE by a group of senators.',
      tags: ['caesar', 'assassination', 'ides']
    },
    {
      id: 'rome-medium-2',
      question: 'What was the name of the Roman amphitheater where gladiator fights took place?',
      options: ['Circus Maximus', 'Colosseum', 'Pantheon', 'Forum'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Architecture',
      region: 'Rome',
      period: 'Empire',
      explanation: 'The Colosseum was the largest amphitheater ever built and hosted gladiatorial contests.',
      tags: ['colosseum', 'gladiators', 'amphitheater']
    },
    {
      id: 'rome-medium-3',
      question: 'Who was the first Roman Emperor?',
      options: ['Julius Caesar', 'Augustus', 'Nero', 'Trajan'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Politics',
      region: 'Rome',
      period: 'Early Empire',
      explanation: 'Augustus (originally Octavian) became the first Roman Emperor in 27 BCE.',
      tags: ['augustus', 'emperor', 'empire']
    },
    // Hard Questions (High School Level)
    {
      id: 'rome-hard-1',
      question: 'Which Roman historian wrote "The Annals" chronicling the early Roman Empire?',
      options: ['Livy', 'Tacitus', 'Suetonius', 'Plutarch'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Literature',
      region: 'Rome',
      period: 'Empire',
      explanation: 'Tacitus wrote "The Annals," covering the reigns of emperors from Tiberius to Nero.',
      tags: ['tacitus', 'annals', 'historian']
    },
    {
      id: 'rome-hard-2',
      question: 'What was the significance of the Battle of Teutoburg Forest in 9 CE?',
      options: ['Roman victory in Gaul', 'Germanic tribes defeated three Roman legions', 'Expansion into Britain', 'End of civil war'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Military',
      region: 'Rome',
      period: 'Early Empire',
      explanation: 'The battle halted Roman expansion into Germania and resulted in the loss of three legions.',
      tags: ['teutoburg', 'germania', 'arminius']
    },
    {
      id: 'rome-hard-3',
      question: 'Which economic crisis contributed to the fall of the Western Roman Empire?',
      options: ['Inflation and debasement of currency', 'Loss of trade routes', 'Agricultural collapse', 'All of the above'],
      correctAnswer: 3,
      difficulty: 'hard',
      category: 'Economics',
      region: 'Rome',
      period: 'Late Empire',
      explanation: 'Multiple economic factors including currency debasement, trade disruption, and agricultural issues contributed to the fall.',
      tags: ['economics', 'decline', 'inflation']
    },
    {
      id: 'rome-hard-4',
      question: 'What was the Antonine Plague and when did it occur?',
      options: ['Political crisis, 180 CE', 'Pandemic disease, 165-180 CE', 'Military revolt, 193 CE', 'Economic collapse, 235 CE'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Society',
      region: 'Rome',
      period: 'Empire',
      explanation: 'The Antonine Plague was a pandemic, possibly smallpox, that devastated the Roman Empire from 165-180 CE.',
      tags: ['plague', 'pandemic', 'antonine']
    }
  ],

  // Ancient Egypt Pack
  region_pack_egypt: [
    // Easy Questions
    {
      id: 'egypt-easy-1',
      question: 'What river was most important to ancient Egypt?',
      options: ['Tigris', 'Euphrates', 'Nile', 'Jordan'],
      correctAnswer: 2,
      difficulty: 'easy',
      category: 'Geography',
      region: 'Egypt',
      period: 'All Periods',
      explanation: 'The Nile River was the lifeblood of ancient Egypt, providing water and fertile soil.',
      tags: ['nile', 'river', 'geography']
    },
    {
      id: 'egypt-easy-2',
      question: 'What were Egyptian kings called?',
      options: ['Emperors', 'Pharaohs', 'Kings', 'Sultans'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Politics',
      region: 'Egypt',
      period: 'All Periods',
      explanation: 'Egyptian rulers were called pharaohs, meaning "great house."',
      tags: ['pharaoh', 'ruler', 'king']
    },
    {
      id: 'egypt-easy-3',
      question: 'What are the famous monuments at Giza?',
      options: ['Temples', 'Pyramids', 'Palaces', 'Tombs'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Architecture',
      region: 'Egypt',
      period: 'Old Kingdom',
      explanation: 'The Great Pyramids of Giza are among the most famous ancient monuments.',
      tags: ['pyramids', 'giza', 'monuments']
    },
    // Medium Questions
    {
      id: 'egypt-medium-1',
      question: 'Which pharaoh built the Great Pyramid?',
      options: ['Tutankhamun', 'Khufu', 'Ramesses II', 'Cleopatra'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Architecture',
      region: 'Egypt',
      period: 'Old Kingdom',
      explanation: 'Khufu (also known as Cheops) commissioned the Great Pyramid around 2580 BCE.',
      tags: ['khufu', 'pyramid', 'builder']
    },
    {
      id: 'egypt-medium-2',
      question: 'What was the process of preserving dead bodies called?',
      options: ['Embalming', 'Mummification', 'Preservation', 'Burial'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Religion',
      region: 'Egypt',
      period: 'All Periods',
      explanation: 'Mummification was the elaborate process of preserving bodies for the afterlife.',
      tags: ['mummification', 'afterlife', 'preservation']
    },
    {
      id: 'egypt-medium-3',
      question: 'Who was the boy king who ruled Egypt?',
      options: ['Ramesses II', 'Akhenaten', 'Tutankhamun', 'Thutmose III'],
      correctAnswer: 2,
      difficulty: 'medium',
      category: 'Politics',
      region: 'Egypt',
      period: 'New Kingdom',
      explanation: 'Tutankhamun became pharaoh at age 9 and died at 19, famous for his intact tomb.',
      tags: ['tutankhamun', 'boy king', 'tomb']
    },
    // Hard Questions
    {
      id: 'egypt-hard-1',
      question: 'During which period did Akhenaten attempt religious reform?',
      options: ['Old Kingdom', 'Middle Kingdom', 'New Kingdom', 'Late Period'],
      correctAnswer: 2,
      difficulty: 'hard',
      category: 'Religion',
      region: 'Egypt',
      period: 'New Kingdom',
      explanation: 'Akhenaten attempted to establish monotheistic worship of Aten during the 18th Dynasty.',
      tags: ['akhenaten', 'aten', 'monotheism']
    },
    {
      id: 'egypt-hard-2',
      question: 'What was the significance of the Rosetta Stone?',
      options: ['Religious text', 'Decoded hieroglyphs', 'Legal code', 'Historical chronicle'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Language',
      region: 'Egypt',
      period: 'Ptolemaic',
      explanation: 'The Rosetta Stone provided the key to deciphering Egyptian hieroglyphs.',
      tags: ['rosetta', 'hieroglyphs', 'champollion']
    },
    {
      id: 'egypt-hard-3',
      question: 'Which Egyptian queen allied with Julius Caesar and later Mark Antony?',
      options: ['Nefertiti', 'Hatshepsut', 'Cleopatra VII', 'Ankhesenamun'],
      correctAnswer: 2,
      difficulty: 'hard',
      category: 'Politics',
      region: 'Egypt',
      period: 'Ptolemaic',
      explanation: 'Cleopatra VII was the last pharaoh of Egypt and had relationships with both Roman leaders.',
      tags: ['cleopatra', 'caesar', 'antony']
    },
    {
      id: 'egypt-hard-4',
      question: 'What administrative system did the Egyptians use for record-keeping?',
      options: ['Cuneiform tablets', 'Papyrus scrolls', 'Stone inscriptions', 'Oral tradition'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Administration',
      region: 'Egypt',
      period: 'All Periods',
      explanation: 'Egyptians developed papyrus as a writing material and maintained extensive records.',
      tags: ['papyrus', 'records', 'administration']
    }
  ],

  // Ancient Greece Pack
  region_pack_greece: [
    // Easy Questions
    {
      id: 'greece-easy-1',
      question: 'What city-state was known for its warriors?',
      options: ['Athens', 'Sparta', 'Corinth', 'Thebes'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Military',
      region: 'Greece',
      period: 'Classical',
      explanation: 'Sparta was famous for its military culture and warrior society.',
      tags: ['sparta', 'warriors', 'military']
    },
    {
      id: 'greece-easy-2',
      question: 'Who was the teacher of Alexander the Great?',
      options: ['Socrates', 'Plato', 'Aristotle', 'Homer'],
      correctAnswer: 2,
      difficulty: 'easy',
      category: 'Philosophy',
      region: 'Greece',
      period: 'Classical',
      explanation: 'Aristotle tutored young Alexander in Macedonia.',
      tags: ['aristotle', 'alexander', 'tutor']
    },
    {
      id: 'greece-easy-3',
      question: 'What type of government did Athens have?',
      options: ['Monarchy', 'Democracy', 'Dictatorship', 'Empire'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Politics',
      region: 'Greece',
      period: 'Classical',
      explanation: 'Athens is credited with developing the first democracy.',
      tags: ['athens', 'democracy', 'government']
    },
    // Medium Questions
    {
      id: 'greece-medium-1',
      question: 'What was the name of the marketplace in ancient Greek cities?',
      options: ['Acropolis', 'Agora', 'Theater', 'Stadium'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Society',
      region: 'Greece',
      period: 'Classical',
      explanation: 'The agora was the central marketplace and gathering place in Greek cities.',
      tags: ['agora', 'marketplace', 'society']
    },
    {
      id: 'greece-medium-2',
      question: 'Which war was fought between Athens and Sparta?',
      options: ['Persian Wars', 'Peloponnesian War', 'Trojan War', 'Macedonian War'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Military',
      region: 'Greece',
      period: 'Classical',
      explanation: 'The Peloponnesian War (431-404 BCE) was the great conflict between Athens and Sparta.',
      tags: ['peloponnesian', 'athens', 'sparta']
    },
    {
      id: 'greece-medium-3',
      question: 'Who wrote the Iliad and the Odyssey?',
      options: ['Sophocles', 'Euripides', 'Homer', 'Aeschylus'],
      correctAnswer: 2,
      difficulty: 'medium',
      category: 'Literature',
      region: 'Greece',
      period: 'Archaic',
      explanation: 'Homer is traditionally credited with composing these epic poems.',
      tags: ['homer', 'iliad', 'odyssey']
    },
    // Hard Questions
    {
      id: 'greece-hard-1',
      question: 'What philosophical method did Socrates use to examine ideas?',
      options: ['Dialectical method', 'Empirical observation', 'Mathematical proof', 'Rhetorical persuasion'],
      correctAnswer: 0,
      difficulty: 'hard',
      category: 'Philosophy',
      region: 'Greece',
      period: 'Classical',
      explanation: 'The Socratic method uses questions to examine and test ideas.',
      tags: ['socrates', 'dialectical', 'method']
    },
    {
      id: 'greece-hard-2',
      question: 'Which battle marked the end of the Persian Wars?',
      options: ['Marathon', 'Thermopylae', 'Salamis', 'Plataea'],
      correctAnswer: 3,
      difficulty: 'hard',
      category: 'Military',
      region: 'Greece',
      period: 'Classical',
      explanation: 'The Battle of Plataea in 479 BCE was the final land battle of the Persian Wars.',
      tags: ['plataea', 'persian wars', 'victory']
    },
    {
      id: 'greece-hard-3',
      question: 'What was the primary function of Greek mystery religions?',
      options: ['Political control', 'Military training', 'Spiritual transformation', 'Economic regulation'],
      correctAnswer: 2,
      difficulty: 'hard',
      category: 'Religion',
      region: 'Greece',
      period: 'Classical',
      explanation: 'Mystery religions like the Eleusinian Mysteries promised spiritual rebirth and salvation.',
      tags: ['mysteries', 'religion', 'transformation']
    },
    {
      id: 'greece-hard-4',
      question: 'Which pre-Socratic philosopher believed "everything flows"?',
      options: ['Thales', 'Heraclitus', 'Parmenides', 'Democritus'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Philosophy',
      region: 'Greece',
      period: 'Archaic',
      explanation: 'Heraclitus taught that change is the fundamental essence of the universe.',
      tags: ['heraclitus', 'change', 'philosophy']
    }
  ],

  // Ancient Mesopotamia Pack
  region_pack_mesopotamia: [
    // Easy Questions
    {
      id: 'mesopotamia-easy-1',
      question: 'Mesopotamia was located between which two rivers?',
      options: ['Nile and Jordan', 'Tigris and Euphrates', 'Indus and Ganges', 'Yellow and Yangtze'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Geography',
      region: 'Mesopotamia',
      period: 'Bronze Age',
      explanation: 'Mesopotamia means "between rivers" and refers to the land between the Tigris and Euphrates.',
      tags: ['tigris', 'euphrates', 'rivers']
    },
    {
      id: 'mesopotamia-easy-2',
      question: 'What was the first form of writing called?',
      options: ['Hieroglyphs', 'Cuneiform', 'Alphabet', 'Pictographs'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Culture',
      region: 'Mesopotamia',
      period: 'Bronze Age',
      explanation: 'Cuneiform was the earliest known writing system, developed by the Sumerians.',
      tags: ['cuneiform', 'writing', 'sumerians']
    },
    {
      id: 'mesopotamia-easy-3',
      question: 'What were Mesopotamian temples called?',
      options: ['Pyramids', 'Ziggurats', 'Palaces', 'Tombs'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Architecture',
      region: 'Mesopotamia',
      period: 'Bronze Age',
      explanation: 'Ziggurats were massive stepped temple towers built in Mesopotamian cities.',
      tags: ['ziggurats', 'temples', 'architecture']
    },
    // Medium Questions
    {
      id: 'mesopotamia-medium-1',
      question: 'Which king created the first known law code?',
      options: ['Sargon', 'Hammurabi', 'Nebuchadnezzar', 'Gilgamesh'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Law',
      region: 'Mesopotamia',
      period: 'Bronze Age',
      explanation: 'The Code of Hammurabi is one of the earliest and most complete legal documents.',
      tags: ['hammurabi', 'law code', 'justice']
    },
    {
      id: 'mesopotamia-medium-2',
      question: 'What epic poem tells the story of a Mesopotamian hero?',
      options: ['Iliad', 'Epic of Gilgamesh', 'Odyssey', 'Aeneid'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Literature',
      region: 'Mesopotamia',
      period: 'Bronze Age',
      explanation: 'The Epic of Gilgamesh is one of the earliest known works of literature.',
      tags: ['gilgamesh', 'epic', 'literature']
    },
    {
      id: 'mesopotamia-medium-3',
      question: 'Which civilization conquered most of Mesopotamia around 2334 BCE?',
      options: ['Sumerians', 'Akkadians', 'Babylonians', 'Assyrians'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Politics',
      region: 'Mesopotamia',
      period: 'Bronze Age',
      explanation: 'Sargon of Akkad created the first multi-ethnic empire in Mesopotamia.',
      tags: ['akkad', 'sargon', 'empire']
    },
    // Hard Questions
    {
      id: 'mesopotamia-hard-1',
      question: 'What mathematical concept did the Babylonians develop?',
      options: ['Decimal system', 'Positional notation', 'Geometric proofs', 'Algebraic equations'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Mathematics',
      region: 'Mesopotamia',
      period: 'Bronze Age',
      explanation: 'Babylonians developed the first positional number system using base 60.',
      tags: ['mathematics', 'positional', 'babylonian']
    },
    {
      id: 'mesopotamia-hard-2',
      question: 'Which Assyrian library preserved thousands of cuneiform tablets?',
      options: ['Library of Babylon', 'Library of Ashurbanipal', 'Library of Ur', 'Library of Mari'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Culture',
      region: 'Mesopotamia',
      period: 'Iron Age',
      explanation: 'Ashurbanipal\'s library at Nineveh contained over 30,000 cuneiform tablets.',
      tags: ['ashurbanipal', 'library', 'tablets']
    },
    {
      id: 'mesopotamia-hard-3',
      question: 'What agricultural innovation allowed Mesopotamian civilization to flourish?',
      options: ['Crop rotation', 'Irrigation systems', 'Steel plows', 'Fertilizers'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Technology',
      region: 'Mesopotamia',
      period: 'Bronze Age',
      explanation: 'Complex irrigation systems allowed agriculture in the arid region between the rivers.',
      tags: ['irrigation', 'agriculture', 'technology']
    },
    {
      id: 'mesopotamia-hard-4',
      question: 'Which Neo-Babylonian king built the Hanging Gardens?',
      options: ['Hammurabi', 'Nebuchadnezzar II', 'Cyrus', 'Darius'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Architecture',
      region: 'Mesopotamia',
      period: 'Iron Age',
      explanation: 'Nebuchadnezzar II allegedly built the Hanging Gardens, one of the Seven Wonders.',
      tags: ['nebuchadnezzar', 'gardens', 'wonders']
    }
  ],

  // Bronze Age Pack
  age_pack_bronze_age: [
    // Easy Questions
    {
      id: 'bronze-easy-1',
      question: 'What metal combination makes bronze?',
      options: ['Iron and carbon', 'Copper and tin', 'Gold and silver', 'Lead and zinc'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Technology',
      region: 'Global',
      period: 'Bronze Age',
      explanation: 'Bronze is an alloy made by combining copper with tin.',
      tags: ['bronze', 'copper', 'tin']
    },
    {
      id: 'bronze-easy-2',
      question: 'Bronze tools were stronger than tools made of what earlier material?',
      options: ['Iron', 'Stone', 'Wood', 'Bone'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Technology',
      region: 'Global',
      period: 'Bronze Age',
      explanation: 'Bronze tools replaced stone tools because bronze was harder and more durable.',
      tags: ['tools', 'stone', 'technology']
    },
    {
      id: 'bronze-easy-3',
      question: 'The Bronze Age came after which period?',
      options: ['Iron Age', 'Stone Age', 'Modern Age', 'Classical Age'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Chronology',
      region: 'Global',
      period: 'Bronze Age',
      explanation: 'The Bronze Age followed the Stone Age in human technological development.',
      tags: ['chronology', 'periods', 'development']
    },
    // Medium Questions
    {
      id: 'bronze-medium-1',
      question: 'Which civilization is considered to have begun the Bronze Age?',
      options: ['Egyptians', 'Sumerians', 'Greeks', 'Chinese'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Civilization',
      region: 'Mesopotamia',
      period: 'Bronze Age',
      explanation: 'The Sumerians were among the first to develop bronze-working technology around 3500 BCE.',
      tags: ['sumerians', 'first', 'technology']
    },
    {
      id: 'bronze-medium-2',
      question: 'What major trade networks developed during the Bronze Age?',
      options: ['Silk Road', 'Maritime trading routes', 'Overland caravan routes', 'All of the above'],
      correctAnswer: 3,
      difficulty: 'medium',
      category: 'Trade',
      region: 'Global',
      period: 'Bronze Age',
      explanation: 'The Bronze Age saw the development of extensive trade networks to obtain tin for bronze-making.',
      tags: ['trade', 'networks', 'tin']
    },
    {
      id: 'bronze-medium-3',
      question: 'Which Bronze Age civilization built the first cities in Europe?',
      options: ['Minoans', 'Mycenaeans', 'Celts', 'Romans'],
      correctAnswer: 0,
      difficulty: 'medium',
      category: 'Civilization',
      region: 'Europe',
      period: 'Bronze Age',
      explanation: 'The Minoan civilization on Crete built the first urban centers in Europe.',
      tags: ['minoans', 'cities', 'europe']
    },
    // Hard Questions
    {
      id: 'bronze-hard-1',
      question: 'What caused the Late Bronze Age collapse around 1200 BCE?',
      options: ['Single cause: invasion', 'Multiple factors including climate change', 'Natural disasters only', 'Economic collapse only'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'History',
      region: 'Mediterranean',
      period: 'Bronze Age',
      explanation: 'The Bronze Age collapse was likely caused by multiple factors including climate change, invasions, and internal conflicts.',
      tags: ['collapse', 'multiple factors', 'crisis']
    },
    {
      id: 'bronze-hard-2',
      question: 'Which Bronze Age civilization used Linear B script?',
      options: ['Minoans', 'Mycenaeans', 'Hittites', 'Egyptians'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Language',
      region: 'Greece',
      period: 'Bronze Age',
      explanation: 'Linear B was used by the Mycenaeans and was deciphered as an early form of Greek.',
      tags: ['linear b', 'mycenaeans', 'script']
    },
    {
      id: 'bronze-hard-3',
      question: 'What was the primary source of tin for Mediterranean Bronze Age civilizations?',
      options: ['Local mines', 'Afghanistan and Britain', 'Africa', 'China'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Trade',
      region: 'Mediterranean',
      period: 'Bronze Age',
      explanation: 'Tin was rare in the Mediterranean and had to be imported from distant sources like Afghanistan and Britain.',
      tags: ['tin', 'trade', 'sources']
    },
    {
      id: 'bronze-hard-4',
      question: 'Which Bronze Age technology led to more efficient warfare?',
      options: ['Bronze swords', 'Horse-drawn chariots', 'Composite bows', 'All of the above'],
      correctAnswer: 3,
      difficulty: 'hard',
      category: 'Military',
      region: 'Global',
      period: 'Bronze Age',
      explanation: 'The Bronze Age saw innovations in weapons, chariots, and archery that revolutionized warfare.',
      tags: ['warfare', 'technology', 'innovation']
    }
  ],

  // Ancient China Pack
  region_pack_china: [
    // Easy Questions
    {
      id: 'china-easy-1',
      question: 'What famous structure was built to protect China from invaders?',
      options: ['Forbidden City', 'Great Wall', 'Terracotta Army', 'Summer Palace'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Architecture',
      region: 'China',
      period: 'Imperial',
      explanation: 'The Great Wall of China was built to protect against northern invasions.',
      tags: ['great wall', 'defense', 'protection']
    },
    {
      id: 'china-easy-2',
      question: 'What did ancient Chinese invent that we still use for writing?',
      options: ['Pencils', 'Paper', 'Ink pens', 'Typewriters'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Technology',
      region: 'China',
      period: 'Imperial',
      explanation: 'Paper was invented in ancient China around 105 CE.',
      tags: ['paper', 'invention', 'writing']
    },
    {
      id: 'china-easy-3',
      question: 'What is the Chinese philosophy that emphasizes harmony and balance?',
      options: ['Buddhism', 'Confucianism', 'Taoism', 'Legalism'],
      correctAnswer: 2,
      difficulty: 'easy',
      category: 'Philosophy',
      region: 'China',
      period: 'Imperial',
      explanation: 'Taoism emphasizes living in harmony with the Tao (the Way).',
      tags: ['taoism', 'harmony', 'philosophy']
    },
    // Medium Questions
    {
      id: 'china-medium-1',
      question: 'Which dynasty unified China for the first time?',
      options: ['Han Dynasty', 'Qin Dynasty', 'Tang Dynasty', 'Ming Dynasty'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Politics',
      region: 'China',
      period: 'Imperial',
      explanation: 'The Qin Dynasty under Emperor Qin Shi Huang first unified China in 221 BCE.',
      tags: ['qin', 'unification', 'dynasty']
    },
    {
      id: 'china-medium-2',
      question: 'What was the Mandate of Heaven?',
      options: ['A religious text', 'Divine right to rule', 'A military strategy', 'A trade agreement'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Politics',
      region: 'China',
      period: 'Imperial',
      explanation: 'The Mandate of Heaven was the belief that emperors ruled with divine approval.',
      tags: ['mandate', 'heaven', 'divine right']
    },
    {
      id: 'china-medium-3',
      question: 'Which Chinese invention helped with navigation?',
      options: ['Telescope', 'Compass', 'Astrolabe', 'Sextant'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Technology',
      region: 'China',
      period: 'Imperial',
      explanation: 'The magnetic compass was invented in China and revolutionized navigation.',
      tags: ['compass', 'navigation', 'invention']
    },
    // Hard Questions
    {
      id: 'china-hard-1',
      question: 'Which period is considered the golden age of Chinese poetry?',
      options: ['Qin Dynasty', 'Han Dynasty', 'Tang Dynasty', 'Song Dynasty'],
      correctAnswer: 2,
      difficulty: 'hard',
      category: 'Literature',
      region: 'China',
      period: 'Imperial',
      explanation: 'The Tang Dynasty (618-907 CE) produced the greatest Chinese poets like Li Bai and Du Fu.',
      tags: ['tang', 'poetry', 'golden age']
    },
    {
      id: 'china-hard-2',
      question: 'What was the purpose of the Chinese examination system?',
      options: ['Military recruitment', 'Religious ordination', 'Civil service selection', 'Trade licensing'],
      correctAnswer: 2,
      difficulty: 'hard',
      category: 'Administration',
      region: 'China',
      period: 'Imperial',
      explanation: 'The examination system selected government officials based on merit and Confucian learning.',
      tags: ['examination', 'civil service', 'meritocracy']
    },
    {
      id: 'china-hard-3',
      question: 'Which Chinese innovation preceded Gutenberg\'s printing press by centuries?',
      options: ['Movable type', 'Woodblock printing', 'Paper making', 'Ink development'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Technology',
      region: 'China',
      period: 'Imperial',
      explanation: 'Bi Sheng invented movable type printing in China around 1040 CE.',
      tags: ['printing', 'movable type', 'innovation']
    },
    {
      id: 'china-hard-4',
      question: 'What was the primary cause of the fall of the Han Dynasty?',
      options: ['Foreign invasion', 'Natural disasters', 'Internal rebellion and corruption', 'Economic collapse'],
      correctAnswer: 2,
      difficulty: 'hard',
      category: 'Politics',
      region: 'China',
      period: 'Imperial',
      explanation: 'The Han Dynasty fell due to internal rebellions, corruption, and the Yellow Turban Rebellion.',
      tags: ['han', 'fall', 'rebellion']
    }
  ],

  // Ancient India Pack
  region_pack_india: [
    // Easy Questions
    {
      id: 'india-easy-1',
      question: 'Which river was most important to ancient Indian civilization?',
      options: ['Ganges', 'Indus', 'Brahmaputra', 'Yamuna'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Geography',
      region: 'India',
      period: 'Ancient',
      explanation: 'The Indus River gave its name to the Indus Valley Civilization.',
      tags: ['indus', 'river', 'civilization']
    },
    {
      id: 'india-easy-2',
      question: 'What religion was founded by Siddhartha Gautama?',
      options: ['Hinduism', 'Buddhism', 'Jainism', 'Sikhism'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Religion',
      region: 'India',
      period: 'Ancient',
      explanation: 'Siddhartha Gautama became the Buddha and founded Buddhism.',
      tags: ['buddha', 'buddhism', 'siddhartha']
    },
    {
      id: 'india-easy-3',
      question: 'What is the sacred text of Hinduism?',
      options: ['Bible', 'Quran', 'Vedas', 'Torah'],
      correctAnswer: 2,
      difficulty: 'easy',
      category: 'Religion',
      region: 'India',
      period: 'Ancient',
      explanation: 'The Vedas are the oldest sacred texts of Hinduism.',
      tags: ['vedas', 'hinduism', 'sacred']
    },
    // Medium Questions
    {
      id: 'india-medium-1',
      question: 'Which emperor spread Buddhism throughout his empire?',
      options: ['Chandragupta', 'Ashoka', 'Harsha', 'Samudragupta'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Religion',
      region: 'India',
      period: 'Mauryan',
      explanation: 'Emperor Ashoka converted to Buddhism and spread it throughout his empire.',
      tags: ['ashoka', 'buddhism', 'mauryan']
    },
    {
      id: 'india-medium-2',
      question: 'What was the ancient Indian numbering system that included zero?',
      options: ['Roman numerals', 'Arabic numerals', 'Decimal system', 'Binary system'],
      correctAnswer: 2,
      difficulty: 'medium',
      category: 'Mathematics',
      region: 'India',
      period: 'Ancient',
      explanation: 'Ancient Indians developed the decimal system with the concept of zero.',
      tags: ['decimal', 'zero', 'mathematics']
    },
    {
      id: 'india-medium-3',
      question: 'Which period is called the Golden Age of India?',
      options: ['Mauryan Period', 'Gupta Period', 'Mughal Period', 'Vedic Period'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'History',
      region: 'India',
      period: 'Gupta',
      explanation: 'The Gupta Period (320-550 CE) is considered the Golden Age of Indian culture.',
      tags: ['gupta', 'golden age', 'culture']
    },
    // Hard Questions
    {
      id: 'india-hard-1',
      question: 'What was the main feature of Indus Valley city planning?',
      options: ['Circular layout', 'Grid system with drainage', 'Pyramid centers', 'Fortified walls only'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Architecture',
      region: 'India',
      period: 'Indus Valley',
      explanation: 'Indus Valley cities like Harappa had sophisticated grid layouts with advanced drainage systems.',
      tags: ['indus valley', 'planning', 'drainage']
    },
    {
      id: 'india-hard-2',
      question: 'Which ancient Indian text contains early concepts of surgery?',
      options: ['Rig Veda', 'Sushruta Samhita', 'Mahabharata', 'Arthashastra'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Medicine',
      region: 'India',
      period: 'Ancient',
      explanation: 'The Sushruta Samhita contains detailed descriptions of surgical procedures.',
      tags: ['sushruta', 'surgery', 'medicine']
    },
    {
      id: 'india-hard-3',
      question: 'What was Kautilya\'s contribution to ancient Indian political thought?',
      options: ['Religious reforms', 'Arthashastra (statecraft)', 'Military tactics', 'Trade regulations'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Politics',
      region: 'India',
      period: 'Mauryan',
      explanation: 'Kautilya wrote the Arthashastra, an ancient treatise on statecraft and economics.',
      tags: ['kautilya', 'arthashastra', 'statecraft']
    },
    {
      id: 'india-hard-4',
      question: 'Which university was a major center of learning in ancient India?',
      options: ['Takshashila', 'Nalanda', 'Vikramashila', 'All of the above'],
      correctAnswer: 3,
      difficulty: 'hard',
      category: 'Education',
      region: 'India',
      period: 'Ancient',
      explanation: 'Ancient India had several renowned universities that attracted students from across Asia.',
      tags: ['universities', 'learning', 'education']
    }
  ],

  // Iron Age Pack
  age_pack_iron_age: [
    // Easy Questions
    {
      id: 'iron-easy-1',
      question: 'Iron tools were stronger than tools made of what metal?',
      options: ['Steel', 'Bronze', 'Gold', 'Silver'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Technology',
      region: 'Global',
      period: 'Iron Age',
      explanation: 'Iron was harder and more durable than bronze, leading to better tools and weapons.',
      tags: ['iron', 'bronze', 'tools']
    },
    {
      id: 'iron-easy-2',
      question: 'The Iron Age came after which period?',
      options: ['Stone Age', 'Bronze Age', 'Modern Age', 'Classical Age'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Chronology',
      region: 'Global',
      period: 'Iron Age',
      explanation: 'The Iron Age followed the Bronze Age in technological development.',
      tags: ['chronology', 'bronze age', 'sequence']
    },
    {
      id: 'iron-easy-3',
      question: 'What do you need to make iron from iron ore?',
      options: ['Water', 'Very hot fire', 'Cold temperatures', 'Salt'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Technology',
      region: 'Global',
      period: 'Iron Age',
      explanation: 'High temperatures are needed to smelt iron ore and extract pure iron.',
      tags: ['smelting', 'fire', 'iron ore']
    },
    // Medium Questions
    {
      id: 'iron-medium-1',
      question: 'Which people were among the first to master iron working?',
      options: ['Egyptians', 'Hittites', 'Greeks', 'Romans'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Technology',
      region: 'Anatolia',
      period: 'Iron Age',
      explanation: 'The Hittites were among the first to develop iron-working technology around 1500 BCE.',
      tags: ['hittites', 'iron working', 'technology']
    },
    {
      id: 'iron-medium-2',
      question: 'What advantage did iron weapons give in warfare?',
      options: ['Lighter weight', 'Better durability', 'Easier to make', 'All of the above'],
      correctAnswer: 3,
      difficulty: 'medium',
      category: 'Military',
      region: 'Global',
      period: 'Iron Age',
      explanation: 'Iron weapons were more durable, could be mass-produced, and gave military advantages.',
      tags: ['weapons', 'warfare', 'advantages']
    },
    {
      id: 'iron-medium-3',
      question: 'Which Iron Age culture built impressive hill forts in Europe?',
      options: ['Romans', 'Celts', 'Vikings', 'Saxons'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Architecture',
      region: 'Europe',
      period: 'Iron Age',
      explanation: 'Celtic tribes built fortified settlements called oppida on hilltops.',
      tags: ['celts', 'hill forts', 'oppida']
    },
    // Hard Questions
    {
      id: 'iron-hard-1',
      question: 'What was the main challenge in early iron working?',
      options: ['Finding iron ore', 'Achieving high enough temperatures', 'Lack of tools', 'Transportation'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Technology',
      region: 'Global',
      period: 'Iron Age',
      explanation: 'Iron requires much higher temperatures than bronze, making it technically challenging.',
      tags: ['temperature', 'smelting', 'challenges']
    },
    {
      id: 'iron-hard-2',
      question: 'Which Iron Age kingdom dominated the ancient Near East?',
      options: ['Babylon', 'Assyria', 'Persia', 'Egypt'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Politics',
      region: 'Mesopotamia',
      period: 'Iron Age',
      explanation: 'The Assyrian Empire used iron weapons to dominate the region from 900-600 BCE.',
      tags: ['assyria', 'empire', 'dominance']
    },
    {
      id: 'iron-hard-3',
      question: 'What was the significance of the Phoenicians during the Iron Age?',
      options: ['Military conquest', 'Maritime trade networks', 'Religious influence', 'Agricultural innovations'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Trade',
      region: 'Mediterranean',
      period: 'Iron Age',
      explanation: 'Phoenicians established extensive trade networks across the Mediterranean.',
      tags: ['phoenicians', 'trade', 'maritime']
    },
    {
      id: 'iron-hard-4',
      question: 'Which innovation accompanied the spread of iron technology?',
      options: ['Alphabetic writing', 'Coinage', 'Urban planning', 'All of the above'],
      correctAnswer: 3,
      difficulty: 'hard',
      category: 'Culture',
      region: 'Global',
      period: 'Iron Age',
      explanation: 'The Iron Age saw multiple innovations including writing systems, currency, and urban development.',
      tags: ['innovations', 'writing', 'coinage']
    }
  ],

  // Prehistoric Age Pack  
  age_pack_prehistoric: [
    // Easy Questions
    {
      id: 'prehistoric-easy-1',
      question: 'What was the first tool material used by early humans?',
      options: ['Bronze', 'Iron', 'Stone', 'Wood'],
      correctAnswer: 2,
      difficulty: 'easy',
      category: 'Technology',
      region: 'Global',
      period: 'Stone Age',
      explanation: 'The Stone Age is named for the use of stone tools by early humans.',
      tags: ['stone', 'tools', 'early humans']
    },
    {
      id: 'prehistoric-easy-2',
      question: 'What did early humans live in before building houses?',
      options: ['Caves', 'Trees', 'Tents', 'Underground'],
      correctAnswer: 0,
      difficulty: 'easy',
      category: 'Society',
      region: 'Global',
      period: 'Stone Age',
      explanation: 'Early humans often used natural caves for shelter.',
      tags: ['caves', 'shelter', 'housing']
    },
    {
      id: 'prehistoric-easy-3',
      question: 'How did early humans get their food?',
      options: ['Farming', 'Hunting and gathering', 'Trading', 'Buying'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Society',
      region: 'Global',
      period: 'Stone Age',
      explanation: 'Before agriculture, humans were hunter-gatherers.',
      tags: ['hunting', 'gathering', 'food']
    },
    // Medium Questions
    {
      id: 'prehistoric-medium-1',
      question: 'What major change marked the Neolithic Revolution?',
      options: ['Use of fire', 'Development of agriculture', 'Making tools', 'Language development'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Technology',
      region: 'Global',
      period: 'Neolithic',
      explanation: 'The Neolithic Revolution was the transition from hunting-gathering to agriculture.',
      tags: ['neolithic', 'agriculture', 'revolution']
    },
    {
      id: 'prehistoric-medium-2',
      question: 'Where were some of the earliest cave paintings found?',
      options: ['Egypt', 'France and Spain', 'China', 'Australia'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Art',
      region: 'Europe',
      period: 'Paleolithic',
      explanation: 'Famous cave paintings were discovered at Lascaux (France) and Altamira (Spain).',
      tags: ['cave paintings', 'lascaux', 'art']
    },
    {
      id: 'prehistoric-medium-3',
      question: 'What was Lucy, discovered in Africa?',
      options: ['Early human tools', 'Cave paintings', 'Early human fossil', 'Ancient settlement'],
      correctAnswer: 2,
      difficulty: 'medium',
      category: 'Evolution',
      region: 'Africa',
      period: 'Prehistoric',
      explanation: 'Lucy is a famous early human ancestor fossil found in Ethiopia.',
      tags: ['lucy', 'fossil', 'evolution']
    },
    // Hard Questions
    {
      id: 'prehistoric-hard-1',
      question: 'Which species is considered the first to use fire systematically?',
      options: ['Homo sapiens', 'Homo erectus', 'Neanderthals', 'Homo habilis'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Evolution',
      region: 'Global',
      period: 'Prehistoric',
      explanation: 'Homo erectus was likely the first human ancestor to control and use fire regularly.',
      tags: ['homo erectus', 'fire', 'evolution']
    },
    {
      id: 'prehistoric-hard-2',
      question: 'What does the term "Clovis culture" refer to?',
      options: ['European cave painters', 'Early American hunter-gatherers', 'African tool makers', 'Asian farmers'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Culture',
      region: 'Americas',
      period: 'Paleolithic',
      explanation: 'Clovis culture refers to early Native American people known for distinctive spear points.',
      tags: ['clovis', 'americas', 'hunters']
    },
    {
      id: 'prehistoric-hard-3',
      question: 'What was the significance of Göbekli Tepe?',
      options: ['Earliest city', 'Oldest known temple complex', 'First farm', 'Ancient burial site'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Architecture',
      region: 'Turkey',
      period: 'Neolithic',
      explanation: 'Göbekli Tepe in Turkey is considered the world\'s oldest temple complex.',
      tags: ['gobekli tepe', 'temple', 'oldest']
    },
    {
      id: 'prehistoric-hard-4',
      question: 'What evidence suggests Neanderthals had symbolic behavior?',
      options: ['Tool use only', 'Burial practices and art', 'Fire control', 'Hunting techniques'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Culture',
      region: 'Europe',
      period: 'Paleolithic',
      explanation: 'Neanderthal burial sites and cave art suggest symbolic thinking and culture.',
      tags: ['neanderthals', 'burial', 'symbolism']
    }
  ]
};

// Helper function to get sample questions for a bundle
export const getSampleQuestionsForBundle = (bundleId: string): Question[] => {
  return sampleQuestionsByBundle[bundleId] || [];
};
