# Question Generation Formula & Difficulty Distribution

## 🎯 **CORE FORMULA SUMMARY**

**Standard Bundles (All except Difficulty Packs):**
- **33 Easy + 33 Medium + 34 Hard = 100 Questions Total**

**Difficulty Packs (Easy/Medium/Hard):**  
- **Easy Pack: 100 Easy Questions (Elementary School Level)**
- **Medium Pack: 100 Medium Questions (Middle School Level)**
- **Hard Pack: 100 Hard Questions (High School Level)**

---

## 📊 **Difficulty Distribution Formula**

### **Standard Bundles (Regional & Time Period Packs)**
All bundles except Difficulty Packs follow the **33/33/34 Formula**:

- **33 Easy Questions** (Elementary School Level)
- **33 Medium Questions** (Middle School Level) 
- **34 Hard Questions** (High School Level) *(34 to reach 100 total)*

### **Difficulty Packs**
Difficulty-specific packs generate **100% of their specified level**:

- **Easy Pack**: 100% Easy Questions (Elementary School Level)
- **Medium Pack**: 100% Medium Questions (Middle School Level)
- **Hard Pack**: 100% Hard Questions (High School Level)

*Alternative naming also supported:*
- **Elementary Pack** = Easy Pack (100% Easy)
- **Middle School Pack** = Medium Pack (100% Medium)  
- **High School Pack** = Hard Pack (100% Hard)
- **Beginner Pack** = Easy Pack (100% Easy)
- **Intermediate Pack** = Medium Pack (100% Medium)
- **Advanced Pack** = Hard Pack (100% Hard)

## 🎯 **Difficulty Level Definitions**

### **Easy (Elementary School Level)**
- **Complexity**: Simple identification and basic knowledge
- **Content**: Basic facts and simple concepts
- **Example**: "What is Ancient Egypt most famous for?"
- **Options**: Simple factual answers
- **Explanation**: Basic facts about the civilization

### **Medium (Middle School Level)**
- **Complexity**: Understanding relationships and context
- **Content**: Connections and analysis
- **Example**: "How did religion influence Ancient Egypt society?"
- **Options**: Detailed explanations with context
- **Explanation**: Evidence-based analysis with historical connections

### **Hard (High School Level)**
- **Complexity**: Advanced analysis and evaluation
- **Content**: Critical thinking and synthesis
- **Example**: "Analyze the complex relationship between religion and social hierarchy in Ancient Egypt."
- **Options**: Sophisticated theoretical frameworks
- **Explanation**: Scholarly analysis with multiple sources and perspectives

## 📦 **Bundle Examples**

### **Bronze Age Pack** (Standard Bundle)
```
Total: 100 Questions
├── 33 Easy Questions (Elementary Level)
├── 33 Medium Questions (Middle School Level)  
└── 34 Hard Questions (High School Level)
```

### **Elementary Pack** (Difficulty Pack)
```
Total: 100 Questions
└── 100 Easy Questions (Elementary Level)
```

### **Medium Pack** (Difficulty Pack)  
```
Total: 100 Questions
└── 100 Medium Questions (Middle School Level)
```

### **Hard Pack** (Difficulty Pack)
```
Total: 100 Questions
└── 100 Hard Questions (High School Level)
```

## 🔄 **Generation Process**

## 🔄 **Generation Process**

### **When User Purchases Bronze Age Pack (Standard Bundle):**

1. **System detects**: Standard bundle (not difficulty pack)
2. **Applies 33/33/34 formula**:
   - Generates 33 easy questions about Bronze Age
   - Generates 33 medium questions about Bronze Age
   - Generates 34 hard questions about Bronze Age
3. **Shuffles questions** to mix difficulty levels
4. **Delivers 100 questions** with proper distribution

### **When User Purchases Easy Pack (Difficulty Pack):**

1. **System detects**: Difficulty pack (not standard bundle)
2. **Applies 100% single difficulty**:
   - Generates 100 easy questions (Elementary School Level)
3. **No mixing** - all questions at same difficulty
4. **Delivers 100 questions** all at Easy level

### **When User Purchases Medium Pack (Difficulty Pack):**

1. **System detects**: Difficulty pack (not standard bundle)  
2. **Applies 100% single difficulty**:
   - Generates 100 medium questions (Middle School Level)
3. **No mixing** - all questions at same difficulty
4. **Delivers 100 questions** all at Medium level

### **When User Purchases Hard Pack (Difficulty Pack):**

1. **System detects**: Difficulty pack (not standard bundle)
2. **Applies 100% single difficulty**:
   - Generates 100 hard questions (High School Level)  
3. **No mixing** - all questions at same difficulty
4. **Delivers 100 questions** all at Hard level

### **Question Themes per Bundle:**
Each bundle uses relevant themes:

- **Egypt Pack**: Pharaohs, Pyramids, Religion, Daily Life, Art, Politics
- **Rome Pack**: Empire, Military, Politics, Culture, Engineering, Religion
- **Greece Pack**: Philosophy, Democracy, Art, Olympics, War, Science
- **Bronze Age Pack**: Technology, Trade, Warfare, Society, Religion, Culture

## 🏷️ **Question Tagging System**

Each generated question includes:
- **Bundle ID**: `bronze_age_pack`
- **Difficulty**: `easy`, `medium`, or `hard`
- **Education Level**: `Elementary School`, `Middle School`, `High School`
- **Theme**: `Technology`, `Trade`, `Society`, etc.
- **Time Period**: `3300-1200 BCE`
- **Tags**: Bundle-specific tags for filtering

## ✅ **Quality Assurance**

- **Consistent Distribution**: Every standard bundle has exactly 33/33/34 split
- **Educational Alignment**: Difficulty levels match appropriate grade levels
- **Content Relevance**: All questions relate to bundle's historical focus
- **Comprehensive Coverage**: Multiple themes ensure broad knowledge testing

## 🔧 **Implementation**

The formula is implemented in `PurchaseContentDeliveryService.ts`:
- `generateStandardBundleQuestions()` - Handles 33/33/34 distribution
- `generateDifficultyPackQuestions()` - Handles 100% single difficulty
- `generateQuestionByDifficulty()` - Creates questions at specific levels

This ensures every user receives exactly 100 properly distributed questions immediately upon purchase completion!

## ❓ **FAQ: Why 33/33/34 and not 33/33/33?**

**Q:** Why do hard questions get 34 instead of 33?
**A:** To reach exactly 100 questions total. Since 33 + 33 + 33 = 99, we add one extra hard question to reach 100.

**Q:** Why hard questions and not easy or medium?
**A:** Hard questions provide the most educational value for advanced learners, so the extra question goes to the hardest difficulty level.

**Q:** Is this distribution fixed?
**A:** Yes, for standard bundles. Only difficulty packs (Elementary, Advanced, etc.) use 100% single difficulty.
