export type Site = {
    domain: string;
    category: string;
    attempts: number;
    initials: string;
    tone: 'mint' | 'rose' | 'blue' | 'gold';
    paused: boolean;
};

export type RuleMode = 'exact' | 'wildcard' | 'strict';
export type SiteRowAction = 'View activity' | 'Pause or resume blocking' | 'Remove site';