// LocalStorage wrapper with TypeScript type safety

const STORAGE_KEYS = {
    LEXICON: 'glotbase_lexicon',
    AFFIX_RULES: 'glotbase_affixes',
    PHONOLOGY: 'glotbase_phonology',
    GRAMMAR: 'glotbase_grammar',
    CORPUS: 'glotbase_corpus',
    METADATA: 'glotbase_metadata',
} as const;

export class Storage {
    static get<T>(key: string, defaultValue: T): T {
        try {
            const item = localStorage.getItem(key);
            if (!item) return defaultValue;
            return JSON.parse(item, (key, value) => {
                // Revive Date objects
                if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
                    return new Date(value);
                }
                return value;
            });
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return defaultValue;
        }
    }

    static set<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error);
        }
    }

    static remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
        }
    }

    static clear(): void {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
}

export { STORAGE_KEYS };
