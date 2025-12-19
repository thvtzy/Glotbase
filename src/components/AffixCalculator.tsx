import { useState } from 'react';
import { useLexicon } from '../context/LexiconContext';
import { useAffix } from '../context/AffixContext';
import { applyAffix } from '../utils/affixEngine';
import { AffixType, PartOfSpeech } from '../types/schema';
import './AffixCalculator.css';

export function AffixCalculator() {
    const { words, getRootWords, addWord } = useLexicon();
    const { rules, addRule, deleteRule } = useAffix();

    const [showRuleForm, setShowRuleForm] = useState(false);
    const [selectedRootId, setSelectedRootId] = useState<string>('');
    const [selectedRules, setSelectedRules] = useState<string[]>([]);

    const [ruleFormData, setRuleFormData] = useState({
        name: '',
        type: 'prefix' as AffixType,
        pattern: '$ROOT',
        replacement: '',
        resultingPOS: '' as PartOfSpeech | '',
        description: '',
        example: '',
    });

    const rootWords = getRootWords();
    const selectedRoot = words.find(w => w.id === selectedRootId);

    const handleAddRule = (e: React.FormEvent) => {
        e.preventDefault();
        addRule({
            ...ruleFormData,
            resultingPOS: ruleFormData.resultingPOS || undefined,
        });
        setRuleFormData({
            name: '',
            type: 'prefix',
            pattern: '$ROOT',
            replacement: '',
            resultingPOS: '',
            description: '',
            example: '',
        });
        setShowRuleForm(false);
    };

    const handleGenerateWords = () => {
        if (!selectedRoot || selectedRules.length === 0) {
            alert('Please select a root word and at least one affix rule');
            return;
        }

        const rulesToApply = rules.filter(r => selectedRules.includes(r.id));
        let generatedCount = 0;

        rulesToApply.forEach(rule => {
            const derived = applyAffix(selectedRoot, rule);

            // Create new word
            addWord({
                nativeScript: derived.nativeScript || selectedRoot.nativeScript,
                romanization: derived.romanization || selectedRoot.romanization,
                ipa: derived.ipa || selectedRoot.ipa,
                partOfSpeech: derived.partOfSpeech || selectedRoot.partOfSpeech,
                etymology: `Derived from "${selectedRoot.romanization}" using ${rule.name}`,
                gender: selectedRoot.gender,
                definition: `${rule.description || rule.name} form of: ${selectedRoot.definition}`,
                tags: [...selectedRoot.tags, 'derived'],
                isRoot: false,
                rootWordId: selectedRoot.id,
            });

            generatedCount++;
        });

        alert(`✅ Generated ${generatedCount} derived word(s)!`);
        setSelectedRules([]);
    };

    const getPreview = () => {
        if (!selectedRoot || selectedRules.length === 0) return [];

        return selectedRules.map(ruleId => {
            const rule = rules.find(r => r.id === ruleId);
            if (!rule) return null;

            const derived = applyAffix(selectedRoot, rule);
            return {
                rule: rule.name,
                original: selectedRoot.romanization,
                derived: derived.romanization || selectedRoot.romanization,
            };
        }).filter(Boolean);
    };

    const previews = getPreview();

    return (
        <div className="affix-calculator">
            <div className="affix-header">
                <h1>⚙️ Affix Calculator</h1>
                <p className="subtitle">Auto-generate derived words from root words</p>
            </div>

            <div className="affix-grid">
                {/* Affix Rules Manager */}
                <div className="card rules-section">
                    <div className="section-header">
                        <h3>📝 Affix Rules</h3>
                        <button onClick={() => setShowRuleForm(!showRuleForm)} className="small">
                            {showRuleForm ? '✕ Cancel' : '+ Add Rule'}
                        </button>
                    </div>

                    {showRuleForm && (
                        <form className="rule-form" onSubmit={handleAddRule}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Rule Name</label>
                                    <input
                                        type="text"
                                        value={ruleFormData.name}
                                        onChange={(e) => setRuleFormData({ ...ruleFormData, name: e.target.value })}
                                        placeholder="e.g., Nominalizer -an"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Type</label>
                                    <select
                                        value={ruleFormData.type}
                                        onChange={(e) => setRuleFormData({ ...ruleFormData, type: e.target.value as AffixType })}
                                        required
                                    >
                                        <option value="prefix">Prefix</option>
                                        <option value="suffix">Suffix</option>
                                        <option value="infix">Infix</option>
                                        <option value="circumfix">Circumfix</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Replacement Pattern</label>
                                <input
                                    type="text"
                                    value={ruleFormData.replacement}
                                    onChange={(e) => setRuleFormData({ ...ruleFormData, replacement: e.target.value })}
                                    placeholder="e.g., me-$ROOT (for prefix) or $ROOT-an (for suffix)"
                                    required
                                />
                                <small className="help-text">Use $ROOT as placeholder for root word</small>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Resulting POS (optional)</label>
                                    <select
                                        value={ruleFormData.resultingPOS}
                                        onChange={(e) => setRuleFormData({ ...ruleFormData, resultingPOS: e.target.value as PartOfSpeech })}
                                    >
                                        <option value="">Same as root</option>
                                        <option value="noun">Noun</option>
                                        <option value="verb">Verb</option>
                                        <option value="adjective">Adjective</option>
                                        <option value="adverb">Adverb</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Example</label>
                                    <input
                                        type="text"
                                        value={ruleFormData.example}
                                        onChange={(e) => setRuleFormData({ ...ruleFormData, example: e.target.value })}
                                        placeholder="e.g., makan → makanan"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={ruleFormData.description}
                                    onChange={(e) => setRuleFormData({ ...ruleFormData, description: e.target.value })}
                                    placeholder="e.g., Creates noun from verb"
                                />
                            </div>

                            <button type="submit" className="primary">Add Rule</button>
                        </form>
                    )}

                    {/* Rules List */}
                    <div className="rules-list">
                        {rules.length === 0 ? (
                            <p className="empty-state">No affix rules yet. Create your first rule!</p>
                        ) : (
                            rules.map(rule => (
                                <div key={rule.id} className="rule-card">
                                    <div className="rule-header">
                                        <div>
                                            <h4>{rule.name}</h4>
                                            <span className="rule-type tag">{rule.type}</span>
                                        </div>
                                        <button onClick={() => deleteRule(rule.id)} className="delete-btn">🗑️</button>
                                    </div>
                                    <div className="rule-pattern">
                                        Pattern: <code>{rule.replacement}</code>
                                    </div>
                                    {rule.example && (
                                        <div className="rule-example">Example: {rule.example}</div>
                                    )}
                                    {rule.description && (
                                        <div className="rule-description">{rule.description}</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Word Generator */}
                <div className="card generator-section">
                    <h3>🌱 Generate Derived Words</h3>

                    <div className="form-group">
                        <label>Select Root Word</label>
                        <select
                            value={selectedRootId}
                            onChange={(e) => setSelectedRootId(e.target.value)}
                            disabled={rootWords.length === 0}
                        >
                            <option value="">Choose a root word...</option>
                            {rootWords.map(word => (
                                <option key={word.id} value={word.id}>
                                    {word.romanization} - {word.definition}
                                </option>
                            ))}
                        </select>
                        {rootWords.length === 0 && (
                            <small className="help-text status-warning">No root words available. Add root words in Lexicon first.</small>
                        )}
                    </div>

                    {selectedRoot && (
                        <div className="selected-word">
                            <div className="word-display">
                                <span className="native-text rtl">{selectedRoot.nativeScript}</span>
                                <span className="romanization">{selectedRoot.romanization}</span>
                            </div>
                            <p className="word-definition">{selectedRoot.definition}</p>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Select Affix Rules to Apply</label>
                        {rules.length === 0 ? (
                            <p className="empty-state">Create affix rules first</p>
                        ) : (
                            <div className="checkbox-list">
                                {rules.map(rule => (
                                    <label key={rule.id} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedRules.includes(rule.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRules([...selectedRules, rule.id]);
                                                } else {
                                                    setSelectedRules(selectedRules.filter(id => id !== rule.id));
                                                }
                                            }}
                                        />
                                        <span>{rule.name} ({rule.type})</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Preview */}
                    {previews.length > 0 && (
                        <div className="preview-section">
                            <h4>Preview</h4>
                            <div className="preview-list">
                                {previews.map((preview, idx) => (
                                    <div key={idx} className="preview-item">
                                        <span className="preview-original">{preview?.original}</span>
                                        <span className="preview-arrow">→</span>
                                        <span className="preview-derived">{preview?.derived}</span>
                                        <span className="preview-rule tag">{preview?.rule}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleGenerateWords}
                        disabled={!selectedRoot || selectedRules.length === 0}
                        className="primary generate-btn"
                    >
                        ✨ Generate {selectedRules.length} Word(s)
                    </button>
                </div>
            </div>
        </div>
    );
}
