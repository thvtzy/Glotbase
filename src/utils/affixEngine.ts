import { AffixRule, WordEntry } from '../types/schema';

/**
 * Apply an affix rule to a root word
 */
export function applyAffix(
    rootWord: WordEntry,
    rule: AffixRule
): Partial<WordEntry> {
    const { romanization, nativeScript } = rootWord;

    let newRomanization = romanization;
    let newNativeScript = nativeScript;

    // Apply affix based on type
    switch (rule.type) {
        case 'prefix':
            // Extract prefix from replacement (e.g., "me-$ROOT" → "me-")
            const prefix = rule.replacement.replace('$ROOT', '').replace(/-$/, '');
            newRomanization = prefix + romanization;
            // Apply same pattern to native script (simple concatenation)
            if (nativeScript) {
                newNativeScript = prefix + nativeScript;
            }
            break;

        case 'suffix':
            // Extract suffix from replacement (e.g., "$ROOT-an" → "-an")
            const suffix = rule.replacement.replace('$ROOT', '').replace(/^-/, '');
            newRomanization = romanization + suffix;
            // Apply same pattern to native script
            if (nativeScript) {
                newNativeScript = nativeScript + suffix;
            }
            break;

        case 'infix':
            // Insert in the middle (simplified - would need proper phonology rules)
            const infix = rule.replacement.replace('$ROOT', '').replace(/-/g, '');
            const mid = Math.floor(romanization.length / 2);
            newRomanization =
                romanization.slice(0, mid) +
                infix +
                romanization.slice(mid);
            // Apply to native script
            if (nativeScript) {
                const scriptMid = Math.floor(nativeScript.length / 2);
                newNativeScript =
                    nativeScript.slice(0, scriptMid) +
                    infix +
                    nativeScript.slice(scriptMid);
            }
            break;

        case 'circumfix':
            // Add both prefix and suffix (e.g., "ke-$ROOT-an")
            const parts = rule.replacement.split('$ROOT');
            const circPrefix = parts[0]?.replace(/-$/, '') || '';
            const circSuffix = parts[1]?.replace(/^-/, '') || '';
            newRomanization = circPrefix + romanization + circSuffix;
            // Apply to native script
            if (nativeScript) {
                newNativeScript = circPrefix + nativeScript + circSuffix;
            }
            break;
    }

    return {
        romanization: newRomanization,
        nativeScript: newNativeScript,
        partOfSpeech: rule.resultingPOS || rootWord.partOfSpeech,
        isRoot: false,
        rootWordId: rootWord.id,
    };
}

/**
 * Generate all possible derived words from a root word using available rules
 */
export function generateDerivedWords(
    rootWord: WordEntry,
    rules: AffixRule[]
): Partial<WordEntry>[] {
    return rules.map(rule => applyAffix(rootWord, rule));
}

/**
 * Get all derived words for a specific root word
 */
export function getDerivedWords(
    rootWordId: string,
    allWords: WordEntry[]
): WordEntry[] {
    return allWords.filter(word => word.rootWordId === rootWordId);
}
