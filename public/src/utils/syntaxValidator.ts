import { WordEntry, WordOrder } from '../types/schema';

export interface ValidationResult {
    isValid: boolean;
    message?: string;
    expectedOrder?: string;
    actualOrder?: string;
    pattern: string[];
    suggestions: string[];
}

/**
 * Validate VSO (Verb-Subject-Object) word order
 */
export function validateVSO(words: WordEntry[]): ValidationResult {
    if (words.length === 0) {
        return {
            isValid: false,
            pattern: [],
            suggestions: ['Add at least one word to validate'],
        };
    }

    const pattern = words.map(word => {
        const pos = word.partOfSpeech;
        if (pos === 'verb') return 'V';
        if (pos === 'noun' || pos === 'pronoun') return 'S/O';
        return pos.toUpperCase().charAt(0);
    });

    const suggestions: string[] = [];
    let isValid = true;

    // Check minimum length for VSO
    if (words.length < 2) {
        suggestions.push('VSO order requires at least a verb and one noun/pronoun');
        isValid = false;
    }

    // Check if first word is a verb
    if (words.length > 0 && words[0].partOfSpeech !== 'verb') {
        suggestions.push('VSO order should start with a verb (V)');
        isValid = false;
    }

    // Check if we have nouns/pronouns after verb
    if (words.length >= 2) {
        const hasNounAfterVerb = words.slice(1).some(
            w => w.partOfSpeech === 'noun' || w.partOfSpeech === 'pronoun'
        );
        if (!hasNounAfterVerb) {
            suggestions.push('Add a subject (noun/pronoun) after the verb');
            isValid = false;
        }
    }

    // Ideal VSO pattern: V + S/O + S/O (or more)
    if (words.length >= 3 && words[0].partOfSpeech === 'verb') {
        const afterVerb = words.slice(1);
        const nounCount = afterVerb.filter(
            w => w.partOfSpeech === 'noun' || w.partOfSpeech === 'pronoun'
        ).length;

        if (nounCount >= 2) {
            suggestions.push('✓ Perfect VSO structure: Verb + Subject + Object');
        } else if (nounCount === 1) {
            suggestions.push('Good start! Add another noun/pronoun for object');
        }
    }

    // If valid and no issues found
    if (isValid && suggestions.length === 0) {
        suggestions.push('✓ Valid VSO word order');
    }

    return {
        isValid,
        pattern,
        suggestions,
    };
}

/**
 * Validate word order in a sentence for any pattern
 */
export function validateWordOrder(
    words: WordEntry[],
    expectedOrder: WordOrder
): ValidationResult {
    if (words.length === 0) {
        return {
            isValid: false,
            pattern: [],
            suggestions: ['Add at least one word to validate'],
        };
    }

    // Map words to their roles
    const pattern = words.map(word => {
        const pos = word.partOfSpeech;
        if (pos === 'verb') return 'V';
        if (pos === 'noun' || pos === 'pronoun') return 'S/O';
        return pos.toUpperCase().charAt(0);
    });

    const suggestions: string[] = [];
    let isValid = true;

    // Count components
    const hasVerb = words.some(w => w.partOfSpeech === 'verb');
    const nouns = words.filter(w => w.partOfSpeech === 'noun' || w.partOfSpeech === 'pronoun');

    // Minimum validation
    if (!hasVerb) {
        suggestions.push('Add a verb to your sentence');
        isValid = false;
    }

    if (nouns.length < 2) {
        suggestions.push('Add at least 2 nouns/pronouns (subject and object)');
        isValid = false;
    }

    // If we have minimum components, validate order
    if (hasVerb && nouns.length >= 2) {
        const verbIndex = words.findIndex(w => w.partOfSpeech === 'verb');
        const firstNounIndex = words.findIndex(w => w.partOfSpeech === 'noun' || w.partOfSpeech === 'pronoun');
        const secondNounIndex = words.findIndex((w, i) =>
            i > firstNounIndex && (w.partOfSpeech === 'noun' || w.partOfSpeech === 'pronoun')
        );

        // Check pattern
        let expectedPattern: string;
        let patternValid = false;

        switch (expectedOrder) {
            case 'VSO':
                expectedPattern = 'Verb → Subject → Object';
                patternValid = verbIndex < firstNounIndex && firstNounIndex < secondNounIndex;
                break;
            case 'SVO':
                expectedPattern = 'Subject → Verb → Object';
                patternValid = firstNounIndex < verbIndex && verbIndex < secondNounIndex;
                break;
            case 'SOV':
                expectedPattern = 'Subject → Object → Verb';
                patternValid = firstNounIndex < secondNounIndex && secondNounIndex < verbIndex;
                break;
            case 'VOS':
                expectedPattern = 'Verb → Object → Subject';
                patternValid = verbIndex < firstNounIndex && firstNounIndex < secondNounIndex;
                break;
            case 'OVS':
                expectedPattern = 'Object → Verb → Subject';
                patternValid = firstNounIndex < verbIndex && verbIndex < secondNounIndex;
                break;
            case 'OSV':
                expectedPattern = 'Object → Subject → Verb';
                patternValid = firstNounIndex < secondNounIndex && secondNounIndex < verbIndex;
                break;
            default:
                expectedPattern = expectedOrder;
                patternValid = false;
        }

        if (!patternValid) {
            suggestions.push(`Expected ${expectedPattern} word order`);
            isValid = false;
        } else {
            suggestions.push(`✓ Perfect ${expectedOrder} structure!`);
        }
    }

    return {
        isValid,
        pattern,
        suggestions,
        expectedOrder,
    };
}

/**
 * Get visual indicator for word order
 */
export function getWordOrderIndicator(word: WordEntry): string {
    const posMap: { [key: string]: string } = {
        'verb': 'V',
        'noun': 'S/O',
        'pronoun': 'S/O',
    };

    return posMap[word.partOfSpeech] || '';
}
