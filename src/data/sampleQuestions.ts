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
    // Easy Questions (33% - Global Bronze Age Civilizations & Culture)
    {
      id: 'bronze-easy-1',
      question: 'Which ancient Mesopotamian civilization built the first cities during the Bronze Age?',
      options: ['Babylonians', 'Sumerians', 'Assyrians', 'Persians'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Civilization',
      region: 'Mesopotamia',
      period: 'Bronze Age',
      explanation: 'The Sumerians built the first cities like Ur and Uruk around 3500-3000 BCE.',
      tags: ['sumerians', 'cities', 'mesopotamia']
    },
    {
      id: 'bronze-easy-2',
      question: 'What was the primary building material for Egyptian pyramids during the Bronze Age?',
      options: ['Brick', 'Wood', 'Stone', 'Clay'],
      correctAnswer: 2,
      difficulty: 'easy',
      category: 'Architecture',
      region: 'Egypt',
      period: 'Bronze Age',
      explanation: 'Egyptian pyramids were built primarily from limestone and granite blocks.',
      tags: ['pyramids', 'egypt', 'stone']
    },
    {
      id: 'bronze-easy-3',
      question: 'Which Bronze Age civilization developed the first known written law code?',
      options: ['Egyptians', 'Babylonians', 'Indus Valley', 'Minoans'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Law',
      region: 'Mesopotamia',
      period: 'Bronze Age',
      explanation: 'The Code of Hammurabi (c. 1750 BCE) was one of the first written legal codes.',
      tags: ['hammurabi', 'laws', 'babylon']
    },
    // Medium Questions (33% - Complex Bronze Age Societies)
    {
      id: 'bronze-medium-1',
      question: 'The Indus Valley Civilization was notable for which urban planning feature?',
      options: ['Pyramids', 'Advanced drainage systems', 'Defensive walls', 'Temples'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Urban Planning',
      region: 'India',
      period: 'Bronze Age',
      explanation: 'Harappa and Mohenjo-daro had sophisticated sewage and drainage systems.',
      tags: ['indus valley', 'drainage', 'urban planning']
    },
    {
      id: 'bronze-medium-2',
      question: 'Which Bronze Age civilization dominated trade in the Eastern Mediterranean?',
      options: ['Mycenaeans', 'Minoans', 'Hittites', 'Phoenicians'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Trade',
      region: 'Mediterranean',
      period: 'Bronze Age',
      explanation: 'The Minoans controlled maritime trade networks throughout the Eastern Mediterranean.',
      tags: ['minoans', 'trade', 'mediterranean']
    },
    {
      id: 'bronze-medium-3',
      question: 'What caused the Bronze Age Collapse around 1200 BCE?',
      options: ['Natural disasters only', 'Multiple factors including invasions', 'Climate change only', 'Disease epidemics'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Historical Events',
      region: 'Mediterranean',
      period: 'Bronze Age',
      explanation: 'The Bronze Age Collapse involved invasions by Sea Peoples, natural disasters, and internal conflicts.',
      tags: ['collapse', 'sea peoples', 'crisis']
    },
    // Hard Questions (33% - Advanced Bronze Age Knowledge)
    {
      id: 'bronze-hard-1',
      question: 'Which Chinese Bronze Age dynasty is famous for oracle bone divination?',
      options: ['Zhou Dynasty', 'Shang Dynasty', 'Xia Dynasty', 'Qin Dynasty'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Religion',
      region: 'China',
      period: 'Bronze Age',
      explanation: 'The Shang Dynasty (c. 1600-1046 BCE) used oracle bones for divination and early Chinese writing.',
      tags: ['shang', 'oracle bones', 'china']
    },
    {
      id: 'bronze-hard-2',
      question: 'The Hittites were the first civilization to extensively use which military technology?',
      options: ['Bronze weapons', 'Iron weapons', 'Horse-drawn chariots', 'Composite bows'],
      correctAnswer: 2,
      difficulty: 'hard',
      category: 'Military',
      region: 'Anatolia',
      period: 'Bronze Age',
      explanation: 'The Hittites were among the first to effectively use horse-drawn chariots in warfare.',
      tags: ['hittites', 'chariots', 'warfare']
    },
    {
      id: 'bronze-hard-3',
      question: 'Linear A script, still undeciphered, belonged to which Bronze Age civilization?',
      options: ['Mycenaeans', 'Minoans', 'Trojans', 'Cypriots'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Writing Systems',
      region: 'Crete',
      period: 'Bronze Age',
      explanation: 'Linear A was the writing system of the Minoan civilization and remains undeciphered.',
      tags: ['linear a', 'minoans', 'writing']
    },
    {
      id: 'bronze-hard-4',
      question: 'Which Bronze Age site in Turkey is considered the legendary city of Troy?',
      options: ['Çatalhöyük', 'Hisarlik', 'Gordion', 'Sardis'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Archaeology',
      region: 'Turkey',
      period: 'Bronze Age',
      explanation: 'Hisarlik (Troy) was excavated by Heinrich Schliemann and is identified with Homer\'s Troy.',
      tags: ['troy', 'hisarlik', 'archaeology']
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

  // Ancient Europe Pack
  region_pack_europe: [
    // Easy Questions (33% - Celtic, Germanic, and Norse Cultures)
    {
      id: 'europe-easy-1',
      question: 'Which ancient Celtic priests were known for their knowledge of astronomy and law?',
      options: ['Bards', 'Druids', 'Warriors', 'Chieftains'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Religion',
      region: 'Europe',
      period: 'Iron Age',
      explanation: 'Druids were Celtic priests who served as judges, teachers, and astronomers in ancient Celtic society.',
      tags: ['druids', 'celts', 'priests']
    },
    {
      id: 'europe-easy-2',
      question: 'What type of ships did the Vikings use for their voyages?',
      options: ['Galleys', 'Longships', 'Caravels', 'Triremes'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Technology',
      region: 'Scandinavia',
      period: 'Viking Age',
      explanation: 'Vikings used longships, which were fast, shallow-draft vessels perfect for both sea and river travel.',
      tags: ['vikings', 'longships', 'technology']
    },
    {
      id: 'europe-easy-3',
      question: 'Which Germanic tribe sacked Rome in 410 CE?',
      options: ['Vandals', 'Visigoths', 'Ostrogoths', 'Franks'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Military',
      region: 'Europe',
      period: 'Late Antiquity',
      explanation: 'The Visigoths under Alaric I sacked Rome in 410 CE, marking a major event in the fall of the Western Roman Empire.',
      tags: ['visigoths', 'rome', 'sack']
    },
    // Medium Questions (33% - European Civilizations and Culture)
    {
      id: 'europe-medium-1',
      question: 'The Minoan civilization flourished on which Mediterranean island?',
      options: ['Sicily', 'Sardinia', 'Crete', 'Cyprus'],
      correctAnswer: 2,
      difficulty: 'medium',
      category: 'Geography',
      region: 'Mediterranean',
      period: 'Bronze Age',
      explanation: 'The Minoan civilization was centered on the island of Crete and was one of Europe\'s first advanced civilizations.',
      tags: ['minoans', 'crete', 'bronze age']
    },
    {
      id: 'europe-medium-2',
      question: 'What was the purpose of Celtic oppida?',
      options: ['Religious ceremonies', 'Fortified settlements', 'Trade markets', 'Agricultural centers'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Architecture',
      region: 'Europe',
      period: 'Iron Age',
      explanation: 'Oppida were large fortified settlements built by Celtic tribes, serving as centers of trade and defense.',
      tags: ['oppida', 'celts', 'fortifications']
    },
    {
      id: 'europe-medium-3',
      question: 'Which ancient European civilization created the Antikythera mechanism?',
      options: ['Romans', 'Greeks', 'Celts', 'Etruscans'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Technology',
      region: 'Greece',
      period: 'Hellenistic',
      explanation: 'The Antikythera mechanism was an ancient Greek analog computer used to predict astronomical positions.',
      tags: ['antikythera', 'greeks', 'technology']
    },
    // Hard Questions (33% - Advanced European History)
    {
      id: 'europe-hard-1',
      question: 'The La Tène culture is associated with which period of Celtic civilization?',
      options: ['Early Celtic', 'Late Iron Age Celtic', 'Roman Celtic', 'Medieval Celtic'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Culture',
      region: 'Europe',
      period: 'Iron Age',
      explanation: 'La Tène culture (c. 450-50 BCE) represents the later Iron Age Celtic culture in Europe.',
      tags: ['la tene', 'celts', 'iron age']
    },
    {
      id: 'europe-hard-2',
      question: 'Which ancient Germanic confederation fought against Rome in the Teutoburg Forest?',
      options: ['Suebi', 'Cherusci', 'Cimbri', 'Alemanni'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Military',
      region: 'Germania',
      period: 'Roman',
      explanation: 'The Cherusci, led by Arminius, defeated three Roman legions in the Battle of the Teutoburg Forest in 9 CE.',
      tags: ['cherusci', 'teutoburg', 'arminius']
    },
    {
      id: 'europe-hard-3',
      question: 'What was the significance of the Sutton Hoo burial in Anglo-Saxon England?',
      options: ['First Christian burial', 'Royal ship burial', 'Peasant cemetery', 'Viking raid site'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Archaeology',
      region: 'England',
      period: 'Early Medieval',
      explanation: 'Sutton Hoo contains a magnificent Anglo-Saxon royal burial with a ship and rich grave goods.',
      tags: ['sutton hoo', 'anglo-saxon', 'burial']
    },
    {
      id: 'europe-hard-4',
      question: 'Which Thracian civilization is famous for its elaborate gold artifacts?',
      options: ['Dacians', 'Odessos', 'Getae', 'Thracian Kingdom'],
      correctAnswer: 3,
      difficulty: 'hard',
      category: 'Art',
      region: 'Thrace',
      period: 'Iron Age',
      explanation: 'The Thracian Kingdom produced elaborate gold artifacts, including the famous Panagyurishte treasure.',
      tags: ['thracians', 'gold', 'artifacts']
    }
  ],

  // Ancient Americas Pack
  region_pack_americas: [
    // Easy Questions (33% - Major Pre-Columbian Civilizations)
    {
      id: 'americas-easy-1',
      question: 'Which ancient civilization built Machu Picchu?',
      options: ['Maya', 'Aztec', 'Inca', 'Olmec'],
      correctAnswer: 2,
      difficulty: 'easy',
      category: 'Architecture',
      region: 'South America',
      period: 'Pre-Columbian',
      explanation: 'The Inca Empire built Machu Picchu, a remarkable mountain citadel in modern-day Peru.',
      tags: ['inca', 'machu picchu', 'peru']
    },
    {
      id: 'americas-easy-2',
      question: 'What type of writing system did the Maya develop?',
      options: ['Alphabetic', 'Hieroglyphic', 'Cuneiform', 'Pictographic'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Writing Systems',
      region: 'Mesoamerica',
      period: 'Pre-Columbian',
      explanation: 'The Maya developed a sophisticated hieroglyphic writing system with over 800 symbols.',
      tags: ['maya', 'hieroglyphs', 'writing']
    },
    {
      id: 'americas-easy-3',
      question: 'Which Aztec city was built on a lake?',
      options: ['Chichen Itza', 'Teotihuacan', 'Tenochtitlan', 'Copan'],
      correctAnswer: 2,
      difficulty: 'easy',
      category: 'Geography',
      region: 'Mesoamerica',
      period: 'Pre-Columbian',
      explanation: 'Tenochtitlan, the Aztec capital, was built on an island in Lake Texcoco in modern-day Mexico City.',
      tags: ['aztec', 'tenochtitlan', 'lake']
    },
    // Medium Questions (33% - Cultural and Technological Achievements)
    {
      id: 'americas-medium-1',
      question: 'Which ancient American civilization is considered the "mother culture" of Mesoamerica?',
      options: ['Maya', 'Aztec', 'Olmec', 'Zapotec'],
      correctAnswer: 2,
      difficulty: 'medium',
      category: 'Culture',
      region: 'Mesoamerica',
      period: 'Pre-Columbian',
      explanation: 'The Olmec civilization (1400-400 BCE) is considered the first major civilization in Mesoamerica.',
      tags: ['olmec', 'mother culture', 'mesoamerica']
    },
    {
      id: 'americas-medium-2',
      question: 'What agricultural technique did the Inca use on mountain slopes?',
      options: ['Slash-and-burn', 'Terracing', 'Irrigation canals', 'Crop rotation'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Agriculture',
      region: 'South America',
      period: 'Pre-Columbian',
      explanation: 'The Inca built extensive terraces on mountain slopes to create farmable land in the Andes.',
      tags: ['inca', 'terracing', 'agriculture']
    },
    {
      id: 'americas-medium-3',
      question: 'Which North American culture built large earthen mounds?',
      options: ['Pueblo', 'Mississippian', 'Iroquois', 'Apache'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Architecture',
      region: 'North America',
      period: 'Pre-Columbian',
      explanation: 'The Mississippian culture built large ceremonial and burial mounds throughout the southeastern United States.',
      tags: ['mississippian', 'mounds', 'north america']
    },
    // Hard Questions (33% - Advanced Knowledge of Americas)
    {
      id: 'americas-hard-1',
      question: 'The Nazca Lines in Peru were created by which ancient civilization?',
      options: ['Inca', 'Chavin', 'Nazca', 'Moche'],
      correctAnswer: 2,
      difficulty: 'hard',
      category: 'Art',
      region: 'South America',
      period: 'Pre-Columbian',
      explanation: 'The Nazca civilization created the famous Nazca Lines, large geoglyphs in the Peruvian desert.',
      tags: ['nazca lines', 'nazca', 'geoglyphs']
    },
    {
      id: 'americas-hard-2',
      question: 'Which Mesoamerican ball game had religious significance?',
      options: ['Tlachtli', 'Patolli', 'Chunkey', 'Lacrosse'],
      correctAnswer: 0,
      difficulty: 'hard',
      category: 'Religion',
      region: 'Mesoamerica',
      period: 'Pre-Columbian',
      explanation: 'Tlachtli was a ritual ball game played throughout Mesoamerica with deep religious and cosmological meaning.',
      tags: ['tlachtli', 'ball game', 'religion']
    },
    {
      id: 'americas-hard-3',
      question: 'The Chavin culture of Peru is known for which artistic style?',
      options: ['Geometric patterns', 'Realistic portraits', 'Supernatural beings', 'Abstract symbols'],
      correctAnswer: 2,
      difficulty: 'hard',
      category: 'Art',
      region: 'South America',
      period: 'Pre-Columbian',
      explanation: 'Chavin art featured complex supernatural beings, jaguars, and serpents in their religious iconography.',
      tags: ['chavin', 'supernatural', 'art']
    },
    {
      id: 'americas-hard-4',
      question: 'Which advanced calendar system calculated a year as 365.2420 days?',
      options: ['Aztec', 'Maya', 'Inca', 'Olmec'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Astronomy',
      region: 'Mesoamerica',
      period: 'Pre-Columbian',
      explanation: 'The Maya calculated the solar year as 365.2420 days, remarkably close to the modern calculation of 365.2422 days.',
      tags: ['maya', 'calendar', 'astronomy']
    }
  ],

  // Iron Age Pack
  age_pack_iron_age: [
    // Easy Questions (33% - Global Iron Age Civilizations)
    {
      id: 'iron-easy-1',
      question: 'Which ancient Greek city-state was known for its powerful military during the Iron Age?',
      options: ['Athens', 'Sparta', 'Corinth', 'Thebes'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Military',
      region: 'Greece',
      period: 'Iron Age',
      explanation: 'Sparta was renowned for its disciplined military society and powerful warriors.',
      tags: ['sparta', 'military', 'greece']
    },
    {
      id: 'iron-easy-2',
      question: 'What were the Celtic warriors of Iron Age Europe famous for?',
      options: ['Archery', 'Naval warfare', 'Fierce fighting', 'Siege warfare'],
      correctAnswer: 2,
      difficulty: 'easy',
      category: 'Military',
      region: 'Europe',
      period: 'Iron Age',
      explanation: 'Celtic warriors were known for their fierce fighting style and warrior culture.',
      tags: ['celts', 'warriors', 'europe']
    },
    {
      id: 'iron-easy-3',
      question: 'Which Iron Age empire conquered Babylon and freed the Jewish exiles?',
      options: ['Assyrian Empire', 'Persian Empire', 'Roman Empire', 'Greek Empire'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'History',
      region: 'Persia',
      period: 'Iron Age',
      explanation: 'Cyrus the Great of Persia conquered Babylon in 539 BCE and allowed the Jews to return to Jerusalem.',
      tags: ['persia', 'cyrus', 'babylon']
    },
    // Medium Questions (33% - Iron Age Societies & Culture)
    {
      id: 'iron-medium-1',
      question: 'The Phoenicians contributed which major innovation to world civilization?',
      options: ['Democracy', 'The alphabet', 'Mathematics', 'Philosophy'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Writing Systems',
      region: 'Levant',
      period: 'Iron Age',
      explanation: 'The Phoenician alphabet became the basis for Greek, Latin, and many modern alphabets.',
      tags: ['phoenicians', 'alphabet', 'writing']
    },
    {
      id: 'iron-medium-2',
      question: 'Which Iron Age African kingdom was famous for its wealth from gold and ivory trade?',
      options: ['Nubia', 'Kush', 'Aksum', 'Great Zimbabwe'],
      correctAnswer: 2,
      difficulty: 'medium',
      category: 'Trade',
      region: 'Africa',
      period: 'Iron Age',
      explanation: 'The Kingdom of Aksum controlled Red Sea trade routes and was known for its wealth.',
      tags: ['aksum', 'africa', 'trade']
    },
    {
      id: 'iron-medium-3',
      question: 'What form of government did Athens develop during the Iron Age?',
      options: ['Monarchy', 'Democracy', 'Oligarchy', 'Tyranny'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Government',
      region: 'Greece',
      period: 'Iron Age',
      explanation: 'Athens developed the world\'s first democracy, allowing citizens to participate in government.',
      tags: ['athens', 'democracy', 'government']
    },
    // Hard Questions (33% - Advanced Iron Age Knowledge)
    {
      id: 'iron-hard-1',
      question: 'Which Chinese philosophy emphasized harmony with nature during the Iron Age?',
      options: ['Confucianism', 'Legalism', 'Taoism', 'Buddhism'],
      correctAnswer: 2,
      difficulty: 'hard',
      category: 'Philosophy',
      region: 'China',
      period: 'Iron Age',
      explanation: 'Taoism, founded by Laozi, emphasized living in harmony with the natural order (Tao).',
      tags: ['taoism', 'china', 'philosophy']
    },
    {
      id: 'iron-hard-2',
      question: 'The La Tène culture was associated with which Iron Age people?',
      options: ['Romans', 'Celts', 'Germans', 'Scythians'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Culture',
      region: 'Europe',
      period: 'Iron Age',
      explanation: 'La Tène culture (c. 450-50 BCE) was the later Iron Age culture of the Celts in Europe.',
      tags: ['la tene', 'celts', 'culture']
    },
    {
      id: 'iron-hard-3',
      question: 'Which Iron Age Indian kingdom was ruled by Chandragupta Maurya?',
      options: ['Gupta Empire', 'Maurya Empire', 'Chola Empire', 'Mughal Empire'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Politics',
      region: 'India',
      period: 'Iron Age',
      explanation: 'Chandragupta Maurya founded the Maurya Empire, one of the largest empires in ancient India.',
      tags: ['maurya', 'chandragupta', 'india']
    },
    {
      id: 'iron-hard-4',
      question: 'Which Iron Age script was used to write the earliest Sanskrit texts in India?',
      options: ['Devanagari', 'Brahmi', 'Kharosthi', 'Tamil'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Writing Systems',
      region: 'India',
      period: 'Iron Age',
      explanation: 'Brahmi script was used for early Sanskrit inscriptions and texts during the Iron Age.',
      tags: ['brahmi', 'sanskrit', 'india']
    }
  ],

  // Prehistoric Age Pack  
  age_pack_prehistoric: [
    // Easy Questions (33% - Global Prehistoric Human Development)
    {
      id: 'prehistoric-easy-1',
      question: 'Where did modern humans (Homo sapiens) first evolve?',
      options: ['Asia', 'Europe', 'Africa', 'Australia'],
      correctAnswer: 2,
      difficulty: 'easy',
      category: 'Human Evolution',
      region: 'Africa',
      period: 'Prehistoric',
      explanation: 'Modern humans first evolved in Africa around 200,000-300,000 years ago.',
      tags: ['homo sapiens', 'africa', 'evolution']
    },
    {
      id: 'prehistoric-easy-2',
      question: 'What major discovery changed human life during the Neolithic period?',
      options: ['Fire', 'Agriculture', 'The wheel', 'Writing'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Technology',
      region: 'Global',
      period: 'Neolithic',
      explanation: 'The development of agriculture (farming) revolutionized human society during the Neolithic period.',
      tags: ['agriculture', 'neolithic', 'farming']
    },
    {
      id: 'prehistoric-easy-3',
      question: 'The famous prehistoric site Stonehenge is located in which country?',
      options: ['France', 'England', 'Germany', 'Ireland'],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'Archaeology',
      region: 'Britain',
      period: 'Neolithic',
      explanation: 'Stonehenge is a prehistoric monument located in Wiltshire, England.',
      tags: ['stonehenge', 'england', 'monument']
    },
    // Medium Questions (33% - Prehistoric Cultures & Societies)
    {
      id: 'prehistoric-medium-1',
      question: 'Which prehistoric culture created the famous cave paintings at Lascaux?',
      options: ['Neanderthals', 'Cro-Magnon people', 'Homo erectus', 'Denisovans'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Art',
      region: 'Europe',
      period: 'Paleolithic',
      explanation: 'Cro-Magnon people (early modern humans) created the Lascaux cave paintings around 20,000 years ago.',
      tags: ['lascaux', 'cro-magnon', 'cave art']
    },
    {
      id: 'prehistoric-medium-2',
      question: 'What evidence suggests that Neanderthals cared for their sick and elderly?',
      options: ['Tool making', 'Burial practices', 'Cave paintings', 'Fire use'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Social Behavior',
      region: 'Europe',
      period: 'Paleolithic',
      explanation: 'Neanderthal burial sites show evidence of caring for disabled individuals and ritual burial practices.',
      tags: ['neanderthals', 'burial', 'social care']
    },
    {
      id: 'prehistoric-medium-3',
      question: 'The first humans to reach Australia did so by what means?',
      options: ['Land bridge', 'Sea voyage', 'Ice bridge', 'Migration through Asia'],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'Migration',
      region: 'Australia',
      period: 'Paleolithic',
      explanation: 'Early humans reached Australia around 50,000 years ago by crossing water, showing advanced seafaring skills.',
      tags: ['australia', 'sea voyage', 'migration']
    },
    // Hard Questions (33% - Advanced Prehistoric Knowledge)
    {
      id: 'prehistoric-hard-1',
      question: 'Göbekli Tepe in Turkey is significant because it represents:',
      options: ['The first city', 'The oldest known temple complex', 'The first farm', 'The earliest writing'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Religion',
      region: 'Turkey',
      period: 'Neolithic',
      explanation: 'Göbekli Tepe, built around 9,000 BCE, predates Stonehenge and is the world\'s oldest known temple complex.',
      tags: ['gobekli tepe', 'temple', 'turkey']
    },
    {
      id: 'prehistoric-hard-2',
      question: 'The "Venus figurines" found across prehistoric Europe likely represented:',
      options: ['Trade goods', 'Fertility symbols', 'Children\'s toys', 'Currency'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Art',
      region: 'Europe',
      period: 'Paleolithic',
      explanation: 'Venus figurines are believed to be fertility symbols or goddess figures from the Paleolithic period.',
      tags: ['venus figurines', 'fertility', 'symbols']
    },
    {
      id: 'prehistoric-hard-3',
      question: 'The Clovis culture is associated with which prehistoric achievement?',
      options: ['First European cave art', 'Early settlement of the Americas', 'Invention of pottery', 'Development of agriculture'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Migration',
      region: 'Americas',
      period: 'Paleolithic',
      explanation: 'Clovis culture represents some of the earliest evidence of human settlement in North America.',
      tags: ['clovis', 'americas', 'settlement']
    },
    {
      id: 'prehistoric-hard-4',
      question: 'What was the main advantage of the Atlatl (spear-thrower) used by prehistoric hunters?',
      options: ['Accuracy', 'Range and power', 'Ease of use', 'Durability'],
      correctAnswer: 1,
      difficulty: 'hard',
      category: 'Technology',
      region: 'Global',
      period: 'Paleolithic',
      explanation: 'The atlatl increased the range and force of thrown spears, making hunting more effective.',
      tags: ['atlatl', 'hunting', 'technology']
    }
  ]
};

// Helper function to get sample questions for a bundle
export const getSampleQuestionsForBundle = (bundleId: string): Question[] => {
  return sampleQuestionsByBundle[bundleId] || [];
};
