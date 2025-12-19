import React from 'react';
import { useLexicon } from '../context/LexiconContext';
import { useAffix } from '../context/AffixContext';
import './Dashboard.css';

export function Dashboard() {
    const { words, getRootWords } = useLexicon();
    const { rules } = useAffix();

    const rootWords = getRootWords();
    const derivedWords = words.filter(w => !w.isRoot);

    // Get tag distribution
    const tagCounts: { [key: string]: number } = {};
    words.forEach(word => {
        word.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Get POS distribution
    const posCounts: { [key: string]: number } = {};
    words.forEach(word => {
        posCounts[word.partOfSpeech] = (posCounts[word.partOfSpeech] || 0) + 1;
    });

    const completionPercentage = Math.min((words.length / 100) * 100, 100);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>📊 Dashboard</h1>
                <p className="dashboard-subtitle">Overview of your constructed language</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <div className="stat-value">{words.length}</div>
                        <div className="stat-label">Total Words</div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon">🌱</div>
                    <div className="stat-content">
                        <div className="stat-value">{rootWords.length}</div>
                        <div className="stat-label">Root Words</div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon">🌳</div>
                    <div className="stat-content">
                        <div className="stat-value">{derivedWords.length}</div>
                        <div className="stat-label">Derived Words</div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon">⚙️</div>
                    <div className="stat-content">
                        <div className="stat-value">{rules.length}</div>
                        <div className="stat-label">Affix Rules</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="completion-section card">
                    <h3>Lexicon Progress</h3>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                    <p className="progress-text">
                        {completionPercentage.toFixed(0)}% complete (Goal: 100 words minimum)
                    </p>
                </div>

                <div className="two-column-grid">
                    <div className="card">
                        <h3>🏷️ Top Tags</h3>
                        {topTags.length > 0 ? (
                            <div className="tag-list">
                                {topTags.map(([tag, count]) => (
                                    <div key={tag} className="tag-item">
                                        <span className="tag">{tag}</span>
                                        <span className="tag-count">{count} words</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-state">No tags yet. Start adding words!</p>
                        )}
                    </div>

                    <div className="card">
                        <h3>📝 Parts of Speech</h3>
                        {Object.keys(posCounts).length > 0 ? (
                            <div className="pos-list">
                                {Object.entries(posCounts).map(([pos, count]) => (
                                    <div key={pos} className="pos-item">
                                        <span className="pos-name">{pos}</span>
                                        <div className="pos-bar-container">
                                            <div
                                                className="pos-bar"
                                                style={{ width: `${(count / words.length) * 100}%` }}
                                            />
                                        </div>
                                        <span className="pos-count">{count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-state">No words yet. Start building your lexicon!</p>
                        )}
                    </div>
                </div>

                {words.length > 0 && (
                    <div className="card">
                        <h3>🆕 Recent Additions</h3>
                        <div className="recent-words">
                            {words
                                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                                .slice(0, 5)
                                .map(word => (
                                    <div key={word.id} className="recent-word-item">
                                        <div className="word-scripts">
                                            <span className="native-text rtl">{word.nativeScript}</span>
                                            <span className="romanization">{word.romanization}</span>
                                        </div>
                                        <span className="word-pos tag">{word.partOfSpeech}</span>
                                        <span className="word-definition">{word.definition}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
