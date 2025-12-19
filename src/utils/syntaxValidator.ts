import { WordEntry, WordOrder } from '../types/schema';

export interface ValidationResult {
    isValid: boolean;
    message?: string;
    expectedOrder?: string;
    actualOrder?: string;
}

/**
 * Validate word order in a sentence
 */
export function validateWordOrder(
    words: WordEntry[],
    expectedOrder: WordOrder
): ValidationResult {
    if (words.length < 2) {
        return { isValid: true }; // Not enough words to validate
    }

    // Find V, S, O positions
    const positions: { [key: string]: number } = {};

    words.forEach((word, index) => {
        if (word.partOfSpeech === 'verb') {
            positions.V = index;
        } else if (word.partOfSpeech === 'noun' || word.partOfSpeech === 'pronoun') {
            // First noun/pronoun is subject, second is object
            if (!positions.S) {
                positions.S = index;
            } else if (!positions.O) {
                positions.O = index;
            }
        }
    });

    // Determine actual order
    let actualOrder = '';
    const sortedPositions = Object.entries(positions).sort((a, b) => a[1] - b[1]);
    actualOrder = sortedPositions.map(([key]) => key).join('');

    // Check if it matches expected
    const isValid = actualOrder === expectedOrder || actualOrder.length < 2;

    if (!isValid) {
        return {
            isValid: false,
            message: `Expected ${expectedOrder} word order, but found ${actualOrder || 'incomplete sentence'}`,
            expectedOrder,
            actualOrder,
        };
    }

    return { isValid: true };
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
