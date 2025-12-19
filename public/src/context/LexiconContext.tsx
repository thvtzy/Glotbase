import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WordEntry } from '../types/schema';
import { Storage, STORAGE_KEYS } from '../utils/storage';

interface LexiconContextType {
    words: WordEntry[];
    addWord: (word: Omit<WordEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateWord: (id: string, updates: Partial<WordEntry>) => void;
    deleteWord: (id: string) => void;
    getWord: (id: string) => WordEntry | undefined;
    searchWords: (query: string) => WordEntry[];
    filterByTag: (tag: string) => WordEntry[];
    filterByPOS: (pos: string) => WordEntry[];
    getRootWords: () => WordEntry[];
    getDerivedWords: (rootId: string) => WordEntry[];
}

const LexiconContext = createContext<LexiconContextType | undefined>(undefined);

export function LexiconProvider({ children }: { children: ReactNode }) {
    const [words, setWords] = useState<WordEntry[]>(() =>
        Storage.get<WordEntry[]>(STORAGE_KEYS.LEXICON, [])
    );

    // Persist to localStorage whenever words change
    useEffect(() => {
        Storage.set(STORAGE_KEYS.LEXICON, words);
    }, [words]);

    const addWord = (wordData: Omit<WordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newWord: WordEntry = {
            ...wordData,
            id: `word-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setWords(prev => [...prev, newWord]);
    };

    const updateWord = (id: string, updates: Partial<WordEntry>) => {
        setWords(prev => prev.map(word =>
            word.id === id
                ? { ...word, ...updates, updatedAt: new Date() }
                : word
        ));
    };

    const deleteWord = (id: string) => {
        setWords(prev => prev.filter(word => word.id !== id));
    };

    const getWord = (id: string) => {
        return words.find(word => word.id === id);
    };

    const searchWords = (query: string) => {
        const lowerQuery = query.toLowerCase();
        return words.filter(word =>
            word.romanization.toLowerCase().includes(lowerQuery) ||
            word.nativeScript.includes(query) ||
            word.definition.toLowerCase().includes(lowerQuery) ||
            word.etymology.toLowerCase().includes(lowerQuery)
        );
    };

    const filterByTag = (tag: string) => {
        return words.filter(word => word.tags.includes(tag));
    };

    const filterByPOS = (pos: string) => {
        return words.filter(word => word.partOfSpeech === pos);
    };

    const getRootWords = () => {
        return words.filter(word => word.isRoot);
    };

    const getDerivedWords = (rootId: string) => {
        return words.filter(word => word.rootWordId === rootId);
    };

    const value: LexiconContextType = {
        words,
        addWord,
        updateWord,
        deleteWord,
        getWord,
        searchWords,
        filterByTag,
        filterByPOS,
        getRootWords,
        getDerivedWords,
    };

    return (
        <LexiconContext.Provider value={value}>
            {children}
        </LexiconContext.Provider>
    );
}

export function useLexicon() {
    const context = useContext(LexiconContext);
    if (!context) {
        throw new Error('useLexicon must be used within LexiconProvider');
    }
    return context;
}
