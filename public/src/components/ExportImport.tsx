import React, { useRef } from 'react';
import { useLexicon } from '../context/LexiconContext';
import { exportToJSON, exportToCSV, importFromJSON, getTimestampedFilename } from '../utils/exportImport';
import './ExportImport.css';

export function ExportImport() {
    const { words, addWord } = useLexicon();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportJSON = () => {
        const filename = getTimestampedFilename('glotbase-lexicon', 'json');
        exportToJSON(words, filename);
    };

    const handleExportCSV = () => {
        const filename = getTimestampedFilename('glotbase-lexicon', 'csv');
        exportToCSV(words, filename);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const importedWords = await importFromJSON(file);

            // Ask for confirmation
            const confirmMessage = `Import ${importedWords.length} words?\n\nThis will ADD to your existing ${words.length} words (not replace).`;
            if (!confirm(confirmMessage)) return;

            // Add all imported words
            importedWords.forEach(word => {
                const { id, createdAt, updatedAt, ...wordData } = word;
                addWord(wordData);
            });

            alert(`✅ Successfully imported ${importedWords.length} words!`);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            alert(`❌ Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="export-import">
            <div className="export-import-header">
                <h2>💾 Export & Import</h2>
                <p className="subtitle">Backup your lexicon or import from file</p>
            </div>

            <div className="export-import-grid">
                {/* Export Section */}
                <div className="card export-section">
                    <h3>📤 Export Lexicon</h3>
                    <p className="description">Download your lexicon as a backup file</p>

                    <div className="export-stats">
                        <div className="stat">
                            <span className="stat-value">{words.length}</span>
                            <span className="stat-label">Words to export</span>
                        </div>
                    </div>

                    <div className="button-group">
                        <button onClick={handleExportJSON} disabled={words.length === 0} className="primary">
                            <span className="icon">📄</span>
                            Export as JSON
                        </button>
                        <button onClick={handleExportCSV} disabled={words.length === 0} className="secondary">
                            <span className="icon">📊</span>
                            Export as CSV
                        </button>
                    </div>

                    {words.length === 0 && (
                        <p className="empty-state">No words to export yet. Add some words first!</p>
                    )}
                </div>

                {/* Import Section */}
                <div className="card import-section">
                    <h3>📥 Import Lexicon</h3>
                    <p className="description">Restore from a backup file (JSON only)</p>

                    <div className="import-dropzone">
                        <div className="dropzone-icon">📁</div>
                        <p className="dropzone-text">Click to select JSON file</p>
                        <button onClick={handleImportClick} className="primary">
                            Choose File
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div className="import-info">
                        <p><strong>⚠️ Note:</strong></p>
                        <ul>
                            <li>Only JSON files are supported for import</li>
                            <li>Imported words will be <strong>added</strong> to existing lexicon</li>
                            <li>Duplicate words may be created</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Format Info */}
            <div className="card format-info">
                <h3>📋 File Formats</h3>
                <div className="format-grid">
                    <div className="format-item">
                        <h4>JSON Format</h4>
                        <p><strong>Best for:</strong> Backup & restore</p>
                        <p><strong>Features:</strong> Preserves all data including IDs, dates, and metadata</p>
                        <p><strong>Use case:</strong> Full backup, switching devices, sharing entire lexicon</p>
                    </div>
                    <div className="format-item">
                        <h4>CSV Format</h4>
                        <p><strong>Best for:</strong> Spreadsheet editing</p>
                        <p><strong>Features:</strong> Can be opened in Excel, Google Sheets</p>
                        <p><strong>Use case:</strong> Bulk editing, printing, analysis (export only)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
