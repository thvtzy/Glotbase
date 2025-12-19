import { WordEntry } from '../types/schema';

/**
 * Export words to JSON file
 */
export function exportToJSON(words: WordEntry[], filename: string = 'glotbase-lexicon.json'): void {
    const dataStr = JSON.stringify(words, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}

/**
 * Export words to CSV file
 */
export function exportToCSV(words: WordEntry[], filename: string = 'glotbase-lexicon.csv'): void {
    // CSV headers
    const headers = [
        'Native Script',
        'Romanization',
        'IPA',
        'Part of Speech',
        'Gender',
        'Definition',
        'Etymology',
        'Tags',
        'Is Root',
        'Created At',
    ];

    // Convert words to CSV rows
    const rows = words.map(word => [
        `"${word.nativeScript.replace(/"/g, '""')}"`,
        `"${word.romanization.replace(/"/g, '""')}"`,
        `"${word.ipa.replace(/"/g, '""')}"`,
        word.partOfSpeech,
        word.gender,
        `"${word.definition.replace(/"/g, '""')}"`,
        `"${word.etymology.replace(/"/g, '""')}"`,
        `"${word.tags.join(', ')}"`,
        word.isRoot ? 'Yes' : 'No',
        word.createdAt.toISOString(),
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
    ].join('\n');

    // Create and download file
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}

/**
 * Import words from JSON file
 */
export function importFromJSON(file: File): Promise<WordEntry[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                // Validate and convert dates
                const words: WordEntry[] = Array.isArray(data) ? data : [];
                const validatedWords = words.map(word => ({
                    ...word,
                    createdAt: new Date(word.createdAt),
                    updatedAt: new Date(word.updatedAt),
                }));

                resolve(validatedWords);
            } catch (error) {
                reject(new Error('Invalid JSON file format'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
}

/**
 * Get timestamp for filename
 */
export function getTimestampedFilename(basename: string, extension: string): string {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    return `${basename}-${timestamp}.${extension}`;
}
