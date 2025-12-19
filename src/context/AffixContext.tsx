import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AffixRule } from '../types/schema';
import { Storage, STORAGE_KEYS } from '../utils/storage';

interface AffixContextType {
    rules: AffixRule[];
    addRule: (rule: Omit<AffixRule, 'id'>) => void;
    updateRule: (id: string, updates: Partial<AffixRule>) => void;
    deleteRule: (id: string) => void;
    getRule: (id: string) => AffixRule | undefined;
}

const AffixContext = createContext<AffixContextType | undefined>(undefined);

export function AffixProvider({ children }: { children: ReactNode }) {
    const [rules, setRules] = useState<AffixRule[]>(() =>
        Storage.get<AffixRule[]>(STORAGE_KEYS.AFFIX_RULES, [])
    );

    useEffect(() => {
        Storage.set(STORAGE_KEYS.AFFIX_RULES, rules);
    }, [rules]);

    const addRule = (ruleData: Omit<AffixRule, 'id'>) => {
        const newRule: AffixRule = {
            ...ruleData,
            id: `affix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        setRules(prev => [...prev, newRule]);
    };

    const updateRule = (id: string, updates: Partial<AffixRule>) => {
        setRules(prev => prev.map(rule =>
            rule.id === id ? { ...rule, ...updates } : rule
        ));
    };

    const deleteRule = (id: string) => {
        setRules(prev => prev.filter(rule => rule.id !== id));
    };

    const getRule = (id: string) => {
        return rules.find(rule => rule.id === id);
    };

    const value: AffixContextType = {
        rules,
        addRule,
        updateRule,
        deleteRule,
        getRule,
    };

    return (
        <AffixContext.Provider value={value}>
            {children}
        </AffixContext.Provider>
    );
}

export function useAffix() {
    const context = useContext(AffixContext);
    if (!context) {
        throw new Error('useAffix must be used within AffixProvider');
    }
    return context;
}
