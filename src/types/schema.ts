// Core data types for GlotBase

export type PartOfSpeech =
    | 'noun'
    | 'verb'
    | 'adjective'
    | 'adverb'
    | 'pronoun'
    | 'preposition'
    | 'conjunction'
    | 'particle'
    | 'interjection'
    | 'determiner';

export type Gender = 'neutral' | 'masculine' | 'feminine' | 'divine' | 'custom';

export type AffixType = 'prefix' | 'suffix' | 'infix' | 'circumfix';

export type WordOrder = 'VSO' | 'SVO' | 'SOV' | 'VOS' | 'OVS' | 'OSV';

export interface WordEntry {
    id: string;
    nativeScript: string;       // Jawi or custom script
    romanization: string;        // Latin transliteration
    ipa: string;                // IPA pronunciation
    partOfSpeech: PartOfSpeech;
    etymology: string;
    gender: Gender;
    definition: string;
    tags: string[];
    isRoot: boolean;
    rootWordId?: string;        // If derived word
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AffixRule {
    id: string;
    name: string;
    type: AffixType;
    pattern: string;            // e.g., "$ROOT"
    replacement: string;        // e.g., "me+$ROOT"
    resultingPOS?: PartOfSpeech;
    description: string;
    example: string;
}

export interface Sentence {
    id: string;
    wordIds: string[];          // References to WordEntry IDs
    wordOrder: WordOrder;
    translation: string;
    gloss?: string;             // Interlinear gloss
    notes?: string;
    tags: string[];
    createdAt: Date;
}

export interface PhonologyInventory {
    vowels: {
        front: string[];
        central: string[];
        back: string[];
    };
    consonants: {
        plosive: string[];
        nasal: string[];
        fricative: string[];
        approximant: string[];
        affricate: string[];
    };
    syllableStructure: string;
    phonotacticRules: string[];
}

export interface GrammarRule {
    id: string;
    category: string;           // e.g., "Word Order", "Particles", "Gender System"
    title: string;
    description: string;
    examples: {
        native: string;
        romanization: string;
        gloss: string;
        translation: string;
    }[];
}

export interface CorpusEntry {
    id: string;
    title: string;
    type: 'narrative' | 'dialogue' | 'poetry' | 'technical' | 'other';
    text: {
        native: string;
        romanization: string;
        translation: string;
        gloss?: string;
    };
    tags: string[];
    createdAt: Date;
}

export interface LanguageMetadata {
    languageName: string;
    languageFamily: string;
    wordOrder: WordOrder;
    script: string;
    totalWords: number;
    lastModified: Date;
}

export interface GlotBaseData {
    lexicon: WordEntry[];
    affixRules: AffixRule[];
    phonology: PhonologyInventory;
    grammarRules: GrammarRule[];
    corpus: CorpusEntry[];
    metadata: LanguageMetadata;
}
