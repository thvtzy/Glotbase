import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { SmartLexicon } from './components/SmartLexicon';
import { ExportImport } from './components/ExportImport';
import { AffixCalculator } from './components/AffixCalculator';
import { SentenceBuilder } from './components/SentenceBuilder';
import { LexiconProvider } from './context/LexiconContext';
import { AffixProvider } from './context/AffixContext';
import './index.css';
import './App.css';

type View = 'dashboard' | 'lexicon' | 'export' | 'affix' | 'sentence';

function App() {
    const [currentView, setCurrentView] = useState<View>('dashboard');

    return (
        <LexiconProvider>
            <AffixProvider>
                <div className="app">
                    <nav className="sidebar">
                        <div className="logo">
                            <h2>🌐 GlotBase</h2>
                            <p className="tagline">Conlang Builder</p>
                        </div>

                        <div className="nav-menu">
                            <button
                                className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                                onClick={() => setCurrentView('dashboard')}
                            >
                                <span className="nav-icon">📊</span>
                                <span>Dashboard</span>
                            </button>

                            <button
                                className={`nav-item ${currentView === 'lexicon' ? 'active' : ''}`}
                                onClick={() => setCurrentView('lexicon')}
                            >
                                <span className="nav-icon">📖</span>
                                <span>Lexicon</span>
                            </button>

                            <button
                                className={`nav-item ${currentView === 'export' ? 'active' : ''}`}
                                onClick={() => setCurrentView('export')}
                            >
                                <span className="nav-icon">💾</span>
                                <span>Export/Import</span>
                            </button>

                            <button
                                className={`nav-item ${currentView === 'affix' ? 'active' : ''}`}
                                onClick={() => setCurrentView('affix')}
                            >
                                <span className="nav-icon">⚙️</span>
                                <span>Affix Calculator</span>
                            </button>

                            <button
                                className={`nav-item ${currentView === 'sentence' ? 'active' : ''}`}
                                onClick={() => setCurrentView('sentence')}
                            >
                                <span className="nav-icon">✍️</span>
                                <span>Sentence Builder</span>
                            </button>
                        </div>

                        <div className="sidebar-footer">
                            <p>Built with 💜 for conlangers</p>
                        </div>
                    </nav>

                    <main className="main-content">
                        <div className="container">
                            {currentView === 'dashboard' && <Dashboard />}
                            {currentView === 'lexicon' && <SmartLexicon />}
                            {currentView === 'export' && <ExportImport />}
                            {currentView === 'affix' && <AffixCalculator />}
                            {currentView === 'sentence' && <SentenceBuilder />}
                        </div>
                    </main>
                </div>
            </AffixProvider>
        </LexiconProvider>
    );
}

export default App;
