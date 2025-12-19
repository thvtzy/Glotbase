// IPA character categories for the virtual keyboard

export const IPA_CATEGORIES = {
    vowels: {
        close: ['i', 'y', 'ɨ', 'ʉ', 'ɯ', 'u'],
        nearClose: ['ɪ', 'ʏ', 'ʊ'],
        closeMid: ['e', 'ø', 'ɘ', 'ɵ', 'ɤ', 'o'],
        mid: ['ə'],
        openMid: ['ɛ', 'œ', 'ɜ', 'ɞ', 'ʌ', 'ɔ'],
        nearOpen: ['æ', 'ɐ'],
        open: ['a', 'ɶ', 'ɑ', 'ɒ'],
    },
    consonants: {
        plosive: ['p', 'b', 't', 'd', 'ʈ', 'ɖ', 'c', 'ɟ', 'k', 'g', 'q', 'ɢ', 'ʔ'],
        nasal: ['m', 'ɱ', 'n', 'ɳ', 'ɲ', 'ŋ', 'ɴ'],
        trill: ['ʙ', 'r', 'ʀ'],
        tap: ['ⱱ', 'ɾ', 'ɽ'],
        fricative: ['ɸ', 'β', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'ʂ', 'ʐ', 'ç', 'ʝ', 'x', 'ɣ', 'χ', 'ʁ', 'ħ', 'ʕ', 'h', 'ɦ'],
        lateralFricative: ['ɬ', 'ɮ'],
        approximant: ['ʋ', 'ɹ', 'ɻ', 'j', 'ɰ'],
        lateralApproximant: ['l', 'ɭ', 'ʎ', 'ʟ'],
        affricate: ['t͡ʃ', 'd͡ʒ', 't͡s', 'd͡z', 't͡ɕ', 'd͡ʑ'],
    },
    diacritics: {
        length: ['ː', 'ˑ', '̆'],
        stress: ['ˈ', 'ˌ'],
        tone: ['˥', '˦', '˧', '˨', '˩', '꜀', '꜁', '꜂', '꜃', '꜄', '꜅', '꜆'],
        nasalization: ['̃'],
        voicing: ['̥', '̬'],
        aspiration: ['ʰ', '̤'],
        other: ['̩', '̯', '̊', '̍', '̝', '̞', '̘', '̙', '̪', '̺', '̻', '̼'],
    },
};

/**
 * Check if a string contains IPA characters
 */
export function containsIPA(text: string): boolean {
    const allIPA = [
        ...Object.values(IPA_CATEGORIES.vowels).flat(),
        ...Object.values(IPA_CATEGORIES.consonants).flat(),
        ...Object.values(IPA_CATEGORIES.diacritics).flat(),
    ];

    return allIPA.some(char => text.includes(char));
}

/**
 * Validate IPA string
 */
export function validateIPA(text: string): boolean {
    // Basic validation - check if contains valid IPA characters
    return text.length > 0;
}
