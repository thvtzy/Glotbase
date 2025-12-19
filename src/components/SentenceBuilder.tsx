import { useState } from 'react';
import { useLexicon } from '../context/LexiconContext';
import { validateWordOrder, ValidationResult } from '../utils/syntaxValidator';
import { WordEntry, PartOfSpeech, WordOrder } from '../types/schema';
import './SentenceBuilder.css';

interface WordSlot {
    id: string;
    word: WordEntry | null;
    expectedType?: PartOfSpeech;
}

export function SentenceBuilder() {
    const { words } = useLexicon();
    const [selectedOrder, setSelectedOrder] = useState<WordOrder>('VSO');
    const [slots, setSlots] = useState<WordSlot[]>([
        { id: '1', word: null },
        { id: '2', word: null },
        { id: '3', word: null },
    ]);
    const [validation, setValidation] = useState<ValidationResult | null>(null);
    const [sentenceHistory, setSentenceHistory] = useState<string[]>([]);

    const addSlot = () => {
        setSlots([...slots, { id: Date.now().toString(), word: null }]);
    };

    const removeSlot = (id: string) => {
        if (slots.length > 1) {
            const newSlots = slots.filter(slot => slot.id !== id);
            setSlots(newSlots);
            validateSentence(newSlots);
        }
    };

    const setWordInSlot = (slotId: string, wordId: string) => {
        const word = words.find(w => w.id === wordId);
        const newSlots = slots.map(slot =>
            slot.id === slotId ? { ...slot, word: word || null } : slot
        );
        setSlots(newSlots);
        validateSentence(newSlots);
    };

    const clearSlot = (slotId: string) => {
        const newSlots = slots.map(slot =>
            slot.id === slotId ? { ...slot, word: null } : slot
        );
        setSlots(newSlots);
        validateSentence(newSlots);
    };

    const validateSentence = (currentSlots: WordSlot[]) => {
        const filledWords = currentSlots
            .map(slot => slot.word)
            .filter((word): word is WordEntry => word !== null);

        if (filledWords.length === 0) {
            setValidation(null);
            return;
        }

        const result = validateWordOrder(filledWords, selectedOrder);
        setValidation(result);
    };

    const handleOrderChange = (newOrder: WordOrder) => {
        setSelectedOrder(newOrder);
        // Re-validate with new order
        const filledWords = slots
            .map(slot => slot.word)
            .filter((word): word is WordEntry => word !== null);
        if (filledWords.length > 0) {
            const result = validateWordOrder(filledWords, newOrder);
            setValidation(result);
        }
    };

    const saveSentence = () => {
        const sentence = slots
            .map(slot => slot.word?.romanization || '')
            .filter(Boolean)
            .join(' ');

        if (sentence && validation?.isValid) {
            setSentenceHistory([`[${selectedOrder}] ${sentence}`, ...sentenceHistory.slice(0, 9)]);
            // Clear slots
            setSlots([
                { id: '1', word: null },
                { id: '2', word: null },
                { id: '3', word: null },
            ]);
            setValidation(null);
        }
    };

    const clearAll = () => {
        setSlots([
            { id: '1', word: null },
            { id: '2', word: null },
            { id: '3', word: null },
        ]);
        setValidation(null);
    };

    // Group words by part of speech for easier selection
    const verbWords = words.filter(w => w.partOfSpeech === 'verb');
    const nounWords = words.filter(w => w.partOfSpeech === 'noun' || w.partOfSpeech === 'pronoun');
    const otherWords = words.filter(w => !['verb', 'noun', 'pronoun'].includes(w.partOfSpeech));

    // Word order info
    const orderInfo: Record<WordOrder, { pattern: string[]; example: string; languages: string }> = {
        'VSO': {
            pattern: ['V', 'S', 'O'],
            example: 'Ate the cat the fish',
            languages: 'Welsh, Irish, Classical Arabic'
        },
        'SVO': {
            pattern: ['S', 'V', 'O'],
            example: 'The cat ate the fish',
            languages: 'English, Mandarin, French, Spanish'
        },
        'SOV': {
            pattern: ['S', 'O', 'V'],
            example: 'The cat the fish ate',
            languages: 'Japanese, Korean, Turkish, Hindi'
        },
        'VOS': {
            pattern: ['V', 'O', 'S'],
            example: 'Ate the fish the cat',
            languages: 'Malagasy, Fijian'
        },
        'OVS': {
            pattern: ['O', 'V', 'S'],
            example: 'The fish ate the cat',
            languages: 'Hixkaryana (rare)'
        },
        'OSV': {
            pattern: ['O', 'S', 'V'],
            example: 'The fish the cat ate',
            languages: 'Warao (rare)'
        }
    };

    const currentOrderInfo = orderInfo[selectedOrder];

    return (
        <div className="sentence-builder">
            <div className="builder-header">
                <h1>✍️ Sentence Builder</h1>
                <p className="subtitle">Test word order patterns with visual validation</p>
            </div>

            {/* Word Order Selector */}
            <div className="card pattern-info">
                <h3>📐 Word Order Pattern</h3>

                <div className="pattern-selector">
                    <label htmlFor="word-order">Select Word Order:</label>
                    <select
                        id="word-order"
                        value={selectedOrder}
                        onChange={(e) => handleOrderChange(e.target.value as WordOrder)}
                        className="order-select"
                    >
                        <option value="VSO">VSO - Verb Subject Object</option>
                        <option value="SVO">SVO - Subject Verb Object</option>
                        <option value="SOV">SOV - Subject Object Verb</option>
                        <option value="VOS">VOS - Verb Object Subject</option>
                        <option value="OVS">OVS - Object Verb Subject</option>
                        <option value="OSV">OSV - Object Subject Verb</option>
                    </select>
                </div>

                <div className="pattern-visual">
                    {currentOrderInfo.pattern.map((part, idx) => (
                        <span key={idx} className="pattern-display">
                            <span className={`pattern-part ${part === 'V' ? 'verb-label' : part === 'S' ? 'subject-label' : 'object-label'}`}>
                                {part}
                            </span>
                            {idx < currentOrderInfo.pattern.length - 1 && <span className="arrow">→</span>}
                        </span>
                    ))}
                </div>

                <p className="example">
                    <strong>Example:</strong> <em>{currentOrderInfo.example}</em>
                    <br /><small>Used in: {currentOrderInfo.languages}</small>
                </p>
            </div>

            <div className="builder-grid">
                {/* Sentence Constructor */}
                <div className="card constructor-section">
                    <div className="section-header">
                        <h3>🔨 Build Sentence</h3>
                        <div className="button-group-inline">
                            <button onClick={addSlot} className="small">+ Add Word</button>
                            <button onClick={clearAll} className="small secondary">Clear All</button>
                        </div>
                    </div>

                    {/* Word Slots */}
                    <div className="word-slots">
                        {slots.map((slot, index) => (
                            <div key={slot.id} className="word-slot-container">
                                <div className="slot-number">{index + 1}</div>
                                <div className={`word-slot ${slot.word ? 'filled' : 'empty'}`}>
                                    {slot.word ? (
                                        <div className="selected-word">
                                            <div className="word-content">
                                                <span className="native-text rtl">{slot.word.nativeScript}</span>
                                                <span className="romanization">{slot.word.romanization}</span>
                                                <span className={`pos-tag ${slot.word.partOfSpeech}`}>
                                                    {slot.word.partOfSpeech}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => clearSlot(slot.id)}
                                                className="clear-slot-btn"
                                                title="Remove word"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            onChange={(e) => setWordInSlot(slot.id, e.target.value)}
                                            value=""
                                            className="word-select"
                                        >
                                            <option value="">Select a word...</option>
                                            {verbWords.length > 0 && (
                                                <optgroup label="Verbs">
                                                    {verbWords.map(word => (
                                                        <option key={word.id} value={word.id}>
                                                            {word.romanization} - {word.definition}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            )}
                                            {nounWords.length > 0 && (
                                                <optgroup label="Nouns/Pronouns">
                                                    {nounWords.map(word => (
                                                        <option key={word.id} value={word.id}>
                                                            {word.romanization} - {word.definition}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            )}
                                            {otherWords.length > 0 && (
                                                <optgroup label="Other">
                                                    {otherWords.map(word => (
                                                        <option key={word.id} value={word.id}>
                                                            {word.romanization} ({word.partOfSpeech}) - {word.definition}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            )}
                                        </select>
                                    )}
                                </div>
                                {slots.length > 1 && (
                                    <button
                                        onClick={() => removeSlot(slot.id)}
                                        className="remove-slot-btn"
                                        title="Remove slot"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Validation Result */}
                    {validation && (
                        <div className={`validation-result ${validation.isValid ? 'valid' : 'invalid'}`}>
                            <div className="validation-header">
                                <span className="validation-icon">
                                    {validation.isValid ? '✅' : '⚠️'}
                                </span>
                                <span className="validation-status">
                                    {validation.isValid ? `Valid ${selectedOrder} Structure` : 'Invalid Word Order'}
                                </span>
                            </div>

                            {validation.pattern && (
                                <div className="pattern-visualization">
                                    <strong>Pattern:</strong>{' '}
                                    {validation.pattern.map((type: string, idx: number) => (
                                        <span key={idx} className={`pattern-item ${type.toLowerCase()}-label`}>
                                            {type}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {validation.suggestions.length > 0 && (
                                <div className="suggestions">
                                    <strong>Suggestions:</strong>
                                    <ul>
                                        {validation.suggestions.map((suggestion: string, idx: number) => (
                                            <li key={idx}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {validation.isValid && (
                                <button onClick={saveSentence} className="primary save-btn">
                                    💾 Save to History
                                </button>
                            )}
                        </div>
                    )}

                    {words.length === 0 && (
                        <p className="empty-state">No words in lexicon. Add words first to build sentences!</p>
                    )}
                </div>

                {/* Sentence History */}
                <div className="card history-section">
                    <h3>📜 Sentence History</h3>
                    {sentenceHistory.length === 0 ? (
                        <p className="empty-state">No saved sentences yet. Build and save valid sentences!</p>
                    ) : (
                        <div className="history-list">
                            {sentenceHistory.map((sentence, idx) => (
                                <div key={idx} className="history-item">
                                    <span className="history-number">{idx + 1}</span>
                                    <span className="history-sentence">{sentence}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quick Reference */}
                    <div className="quick-reference">
                        <h4>Word Order Types</h4>
                        <div className="ref-text">
                            <p><strong>VSO</strong> - Verb Subject Object (Welsh, Arabic)</p>
                            <p><strong>SVO</strong> - Subject Verb Object (English, French)</p>
                            <p><strong>SOV</strong> - Subject Object Verb (Japanese, Korean)</p>
                            <p><strong>VOS/OVS/OSV</strong> - Rare patterns</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
