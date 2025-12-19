import React, { useState } from 'react';
import { useLexicon } from '../context/LexiconContext';
import { PartOfSpeech, Gender } from '../types/schema';
import './SmartLexicon.css';

export function SmartLexicon() {
    const { words, addWord, updateWord, deleteWord, searchWords } = useLexicon();
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        nativeScript: '',
        romanization: '',
        ipa: '',
        partOfSpeech: 'noun' as PartOfSpeech,
        etymology: '',
        gender: 'neutral' as Gender,
        customGender: '', // Added customGender field
        definition: '',
        tags: '',
        isRoot: true,
    });

    const displayWords = searchQuery ? searchWords(searchQuery) : words;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const wordData = {
            ...formData,
            gender: formData.gender === 'custom' && formData.customGender
                ? formData.customGender as Gender
                : formData.gender,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        };

        if (editingId) {
            updateWord(editingId, wordData);
            setEditingId(null);
        } else {
            addWord(wordData);
        }

        // Reset form
        setFormData({
            nativeScript: '',
            romanization: '',
            ipa: '',
            partOfSpeech: 'noun',
            etymology: '',
            gender: 'neutral',
            customGender: '',
            definition: '',
            tags: '',
            isRoot: true,
        });
        setShowForm(false);
    };

    const handleEdit = (id: string) => {
        const word = words.find(w => w.id === id);
        if (word) {
            const isCustomGender = !['neutral', 'masculine', 'feminine', 'divine', 'custom'].includes(word.gender);
            setFormData({
                nativeScript: word.nativeScript,
                romanization: word.romanization,
                ipa: word.ipa,
                partOfSpeech: word.partOfSpeech,
                etymology: word.etymology,
                gender: isCustomGender ? 'custom' : word.gender,
                customGender: isCustomGender ? word.gender : '',
                definition: word.definition,
                tags: word.tags.join(', '),
                isRoot: word.isRoot,
            });
            setEditingId(id);
            setShowForm(true);
        }
    };

    return (
        <div className="smart-lexicon">
            <div className="lexicon-header">
                <h1>📖 Smart Lexicon</h1>
                <div className="header-actions">
                    <input
                        type="text"
                        placeholder="Search words..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? '✕ Cancel' : '+ Add Word'}
                    </button>
                </div>
            </div>

            {showForm && (
                <form className="word-form card" onSubmit={handleSubmit}>
                    <h3>{editingId ? 'Edit Word' : 'Add New Word'}</h3>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Native Script</label>
                            <input
                                type="text"
                                value={formData.nativeScript}
                                onChange={(e) => setFormData({ ...formData, nativeScript: e.target.value })}
                                className="rtl"
                                placeholder="Jawi, Arabic, Tengwar, custom script, etc."
                                required
                            />
                            <small className="help-text">Enter in your conlang's native writing system</small>
                        </div>

                        <div className="form-group">
                            <label>Romanization</label>
                            <input
                                type="text"
                                value={formData.romanization}
                                onChange={(e) => setFormData({ ...formData, romanization: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>IPA</label>
                            <input
                                type="text"
                                value={formData.ipa}
                                onChange={(e) => setFormData({ ...formData, ipa: e.target.value })}
                                placeholder="International Phonetic Alphabet"
                            />
                        </div>

                        <div className="form-group">
                            <label>Part of Speech</label>
                            <select
                                value={formData.partOfSpeech}
                                onChange={(e) => setFormData({ ...formData, partOfSpeech: e.target.value as PartOfSpeech })}
                                required
                            >
                                <option value="noun">Noun</option>
                                <option value="verb">Verb</option>
                                <option value="adjective">Adjective</option>
                                <option value="adverb">Adverb</option>
                                <option value="pronoun">Pronoun</option>
                                <option value="preposition">Preposition</option>
                                <option value="conjunction">Conjunction</option>
                                <option value="particle">Particle</option>
                                <option value="interjection">Interjection</option>
                                <option value="determiner">Determiner</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                                required
                            >
                                <option value="neutral">Neutral</option>
                                <option value="masculine">Masculine</option>
                                <option value="feminine">Feminine</option>
                                <option value="divine">Divine</option>
                                <option value="custom">Custom (specify below)</option>
                            </select>
                            {formData.gender === 'custom' && (
                                <input
                                    type="text"
                                    value={formData.customGender}
                                    onChange={(e) => setFormData({ ...formData, customGender: e.target.value })}
                                    placeholder="Enter custom gender name (e.g., animate, inanimate, celestial)"
                                    required
                                    className="mt-2"
                                />
                            )}
                            <small className="help-text">
                                {formData.gender === 'custom'
                                    ? 'Define your own gender category'
                                    : 'Choose or create a custom gender system'}
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Etymology</label>
                            <input
                                type="text"
                                value={formData.etymology}
                                onChange={(e) => setFormData({ ...formData, etymology: e.target.value })}
                                placeholder="e.g., From Arabic root k-t-b"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Definition</label>
                            <textarea
                                value={formData.definition}
                                onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                                placeholder="Definition of the word"
                                required
                                rows={3}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="e.g., basic, nature, divine"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.isRoot}
                                    onChange={(e) => setFormData({ ...formData, isRoot: e.target.checked })}
                                />
                                <span>This is a root word</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="primary">
                            {editingId ? 'Update Word' : 'Add Word'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="word-list">
                {displayWords.length === 0 ? (
                    <div className="empty-state card">
                        <p>📚 No words yet. Start building your lexicon!</p>
                    </div>
                ) : (
                    displayWords.map(word => (
                        <div key={word.id} className="word-card card">
                            <div className="word-header">
                                <div className="word-main">
                                    <div className="native-script rtl">{word.nativeScript}</div>
                                    <div className="romanization">{word.romanization}</div>
                                    {word.ipa && <div className="ipa">/{word.ipa}/</div>}
                                </div>
                                <div className="word-actions">
                                    <button onClick={() => handleEdit(word.id)} className="icon-btn">✏️</button>
                                    <button onClick={() => deleteWord(word.id)} className="icon-btn">🗑️</button>
                                </div>
                            </div>

                            <div className="word-meta">
                                <span className="tag">{word.partOfSpeech}</span>
                                <span className="tag">{word.gender}</span>
                                {word.isRoot && <span className="tag root-tag">Root</span>}
                            </div>

                            <div className="word-definition">{word.definition}</div>

                            {word.etymology && (
                                <div className="word-etymology">
                                    <strong>Etymology:</strong> {word.etymology}
                                </div>
                            )}

                            {word.tags.length > 0 && (
                                <div className="word-tags">
                                    {word.tags.map(tag => (
                                        <span key={tag} className="tag small">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
