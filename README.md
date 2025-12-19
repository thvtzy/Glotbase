# GlotBase - Conlang Archive & Builder

**GlotBase** adalah aplikasi web modern untuk membangun dan mengarsipkan *constructed languages* (conlang). Dirancang khusus untuk mengakomodasi sistem bahasa kompleks dengan berbagai aksara, word order, dan sistem gender.

![GlotBase Screenshot](https://img.shields.io/badge/Status-MVP_Complete-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)

---

## ✨ Features

### 📊 Dashboard
- **Real-time Statistics** - Total words, root vs derived words, affix rules count
- **Progress Tracking** - Visual progress bar untuk lexicon completion
- **Analytics** - Parts of speech distribution, tag analysis
- **Recent Activity** - Daftar kata terakhir yang ditambahkan

### 📖 Smart Lexicon
- **Multi-Script Support** - Jawi, Arabic, Tengwar, atau aksara custom apapun
- **RTL Support** - Right-to-left rendering untuk Arabic scripts
- **Comprehensive Word Data**:
  - Native Script (any writing system)
  - Romanization (Latin transliteration)
  - IPA (International Phonetic Alphabet)
  - Part of Speech (10 categories)
  - Gender System (Neutral, Masculine, Feminine, Divine, or Custom)
  - Etymology tracking
  - Tag system untuk kategorisasi
  - Root word indicator
- **CRUD Operations** - Create, Read, Update, Delete
- **Search Functionality** - Cari berdasarkan romanization, definition, native script

### 🎨 Modern Design
- **Dark Theme** - Premium dark mode dengan glassmorphism
- **Responsive** - Mobile, tablet, desktop friendly
- **Smooth Animations** - Hover effects dan transitions
- **Premium Typography** - Inter untuk UI, Scheherazade New untuk Arabic/Jawi

### 💾 Data Persistence
- **LocalStorage** - Data tersimpan otomatis di browser
- **Type-Safe** - TypeScript untuk data integrity
- **Real-time Updates** - Statistics update otomatis

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

```bash
# Clone atau navigate ke project directory
cd d:/linguist

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
http://localhost:5173
```

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

---

## 📚 Usage Guide

### Adding Your First Word

1. Navigate to **Lexicon** in sidebar
2. Click **+ Add Word**
3. Fill in the form:
   - **Native Script**: Enter in your conlang's writing system (Jawi, Tengwar, etc.)
   - **Romanization**: Latin transliteration
   - **IPA**: Phonetic transcription
   - **Part of Speech**: Select from dropdown (noun, verb, etc.)
   - **Gender**: Choose Neutral, Masculine, Feminine, Divine, or Custom
   - **Etymology**: Track word origins
   - **Definition**: Meaning of the word
   - **Tags**: Categorize (e.g., basic, nature, political)
4. Click **Add Word**

### Custom Gender System

If your conlang has unique genders (e.g., animate/inanimate, celestial/terrestrial):
1. Select **Gender** → **Custom (specify below)**
2. Enter your custom gender name (e.g., "animate", "celestial")
3. The custom gender will be saved with the word

### Searching Words

Use the search bar to find words by:
- Native script
- Romanization
- Definition
- Etymology

---

## 🏗️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Vanilla CSS with CSS Custom Properties
- **State Management**: React Context API
- **Data Storage**: LocalStorage (browser-based)

---

## 📁 Project Structure

```
d:/linguist/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Statistics dashboard
│   │   ├── Dashboard.css
│   │   ├── SmartLexicon.tsx       # Main lexicon manager
│   │   └── SmartLexicon.css
│   ├── context/
│   │   ├── LexiconContext.tsx     # Word management state
│   │   └── AffixContext.tsx       # Affix rules state
│   ├── types/
│   │   └── schema.ts              # TypeScript definitions
│   ├── utils/
│   │   ├── storage.ts             # LocalStorage wrapper
│   │   ├── affixEngine.ts         # Morphology engine
│   │   ├── syntaxValidator.ts     # Word order validation
│   │   └── ipaHelper.ts           # IPA utilities
│   ├── App.tsx                    # Main app component
│   ├── App.css
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🎯 Gender System Options

GlotBase supports flexible gender systems:

| Gender | Description | Use Case |
|--------|-------------|----------|
| **Neutral** | No gender distinction | English-like systems |
| **Masculine** | Masculine gender | Romance, Germanic languages |
| **Feminine** | Feminine gender | Romance, Germanic languages |
| **Divine** | Sacred/holy entities | Religious or mythological terms |
| **Custom** | User-defined | Animate/inanimate, celestial/terrestrial, etc. |

---

## 🌍 Supported Writing Systems

GlotBase is **script-agnostic** and supports any writing system:

- ✅ **Jawi** (Arabic script for Malay)
- ✅ **Arabic** 
- ✅ **Tengwar** (Tolkien's Elvish)
- ✅ **Hangul** (Korean)
- ✅ **Katakana/Hiragana** (Japanese)
- ✅ **Cyrillic**
- ✅ **Custom scripts** (your invented writing systems)

All scripts with RTL direction are automatically supported.

---

## 🔮 Planned Features

### Phase 2: Advanced Tools
- [ ] **Affix Calculator** - Auto-generate derived words
- [ ] **Sentence Builder** - VSO/SVO/SOV word order testing
- [ ] **IPA Keyboard** - Virtual keyboard untuk IPA symbols

### Phase 3: Documentation
- [ ] **Phonology Editor** - Vowel/consonant inventory management
- [ ] **Grammar Wiki** - Document grammar rules with markdown
- [ ] **Corpus Manager** - Store example sentences and texts

### Phase 4: Export/Import
- [ ] **JSON Export** - Backup your entire lexicon
- [ ] **CSV Export** - For spreadsheet compatibility
- [ ] **PDF Generation** - Print-ready dictionary

---

## 💡 Tips for Conlangers

### Starting Your Conlang
1. **Begin with root words** - Mark them as "root" in the form
2. **Use consistent tagging** - Create categories (basic, nature, political, divine)
3. **Track etymology** - Document word evolution and borrowings
4. **Use IPA** - Ensure consistent pronunciation

### For Austronesian-Inspired Languages
- Perfect for **VSO word order** (Sentence Builder coming soon)
- **Divine gender** untuk sacred/holy terminology
- **Jawi/Arabic script** fully supported with RTL

### Data Management
- Data tersimpan di LocalStorage browser
- **Backup recommended**: Clear browser data akan menghapus lexicon
- Export feature akan tersedia di update mendatang

---

## 🤝 Contributing

Future enhancements welcome! Areas for contribution:
- Additional Part of Speech categories
- More phonology tools
- Grammar documentation templates
- Export/import formats

---

## 📄 License

This project is for personal or educational use. Feel free to fork and customize for your conlang needs!

---

## 🙏 Acknowledgments

Built with 💜 for conlangers worldwide

**Fonts:**
- Inter by Rasmus Andersson
- Scheherazade New by SIL International

---

## 📞 Support

For issues or questions about using GlotBase for your constructed language, feel free to open an issue or discussion.

**Happy Conlanging!** 🌐✨
