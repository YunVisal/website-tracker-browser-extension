import { useState, type FormEvent } from 'react';
import { normalizeDomain } from './utilities/url';
import { Text } from './Atoms';
import { BlockSiteForm } from './molecules/BlockSiteForm';
import { BrandHeader } from './molecules/BrandHeader';
import { CurrentTab } from './molecules/CurrentTab';
import { RuleSelector } from './molecules/RuleSelector';
import { ShieldSummary } from './molecules/ShieldSummary';
import { SiteListHeader } from './molecules/SiteListHeader';
import { SiteRow } from './molecules/SiteRow';
import type { RuleMode, Site, SiteRowAction } from './molecules/types';
import './App.css';

const startingSites: Site[] = [
    { domain: 'twitter.com', category: 'Social', attempts: 14, initials: 'X', tone: 'blue', paused: false },
    { domain: 'reddit.com', category: 'Forum', attempts: 22, initials: 'Rd', tone: 'rose', paused: false },
    { domain: 'youtube.com', category: 'Media', attempts: 9, initials: 'YT', tone: 'rose', paused: false },
    { domain: 'instagram.com', category: 'Social', attempts: 6, initials: 'IG', tone: 'rose', paused: false },
    { domain: 'tiktok.com', category: 'Video', attempts: 11, initials: 'TT', tone: 'mint', paused: false },
    { domain: 'netflix.com', category: 'Stream', attempts: 2, initials: 'NF', tone: 'rose', paused: false },
];

function categoryFor(domain: string) {
    if (domain.includes('youtube')) return 'Media';
    if (domain.includes('reddit')) return 'Forum';
    if (domain.includes('tiktok')) return 'Video';
    if (domain.includes('netflix')) return 'Stream';
    return 'Social';
}

function initialsFor(domain: string) {
    const known: Record<string, string> = {
        'twitter.com': 'X',
        'reddit.com': 'Rd',
        'youtube.com': 'YT',
        'instagram.com': 'IG',
        'tiktok.com': 'TT',
        'netflix.com': 'NF',
    };
    return known[domain] ?? domain.slice(0, 2).toUpperCase();
}

function App() {
    const [sites, setSites] = useState(startingSites);
    const [shieldActive, setShieldActive] = useState(true);
    const [ruleMode, setRuleMode] = useState<RuleMode>('exact');
    const [url, setUrl] = useState('');
    const [filter, setFilter] = useState('');
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [activityDomain, setActivityDomain] = useState('');

    const filteredSites = sites.filter((site) => site.domain.includes(filter.trim().toLowerCase()));

    function addSite(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setNotice('');

        try {
            const domain = normalizeDomain(url.replace(/^\*\./, ''));
            if (sites.some((site) => site.domain === domain)) {
                setError(`${domain} is already on your list.`);
                return;
            }

            setSites((current) => [
                {
                    domain,
                    category: categoryFor(domain),
                    attempts: 0,
                    initials: initialsFor(domain),
                    tone: 'mint',
                    paused: false,
                },
                ...current,
            ]);
            setUrl('');
            setNotice(`${domain} added to your blocked sites.`);
        } catch (validationError) {
            setError(validationError instanceof Error ? validationError.message : 'Enter a valid website.');
        }
    }

    function blockCurrentTab() {
        const domain = 'reddit.com';
        if (sites.some((site) => site.domain === domain)) {
            setNotice(`${domain} is already protected.`);
            return;
        }
        setSites((current) => [
            { domain, category: 'Forum', attempts: 0, initials: 'Rd', tone: 'rose', paused: false },
            ...current,
        ]);
        setNotice(`${domain} added to your blocked sites.`);
    }

    function handleRowAction(action: SiteRowAction, site: Site) {
        if (action === 'Remove site') {
            setSites((current) => current.filter((entry) => entry.domain !== site.domain));
            setNotice(`${site.domain} removed.`);
        } else if (action === 'View activity') {
            setActivityDomain((current) => current === site.domain ? '' : site.domain);
        } else {
            setSites((current) => current.map((entry) => (
                entry.domain === site.domain ? { ...entry, paused: !entry.paused } : entry
            )));
        }
    }

    return (
        <main className="dashboard">
            <BrandHeader shieldActive={shieldActive} onToggle={() => setShieldActive((active) => !active)} />
            <div className="dashboard-content">
                <section className={`shield-panel ${shieldActive ? '' : 'shield-panel--paused'}`} aria-label="Shield status">
                    <ShieldSummary active={shieldActive} />
                    <CurrentTab onBlock={blockCurrentTab} />
                </section>

                <BlockSiteForm
                    error={error}
                    notice={notice}
                    onSubmit={addSite}
                    onUrlChange={setUrl}
                    url={url}
                />
                <RuleSelector mode={ruleMode} onChange={setRuleMode} />

                <section className="sites-section" aria-labelledby="sites-heading">
                    <SiteListHeader count={sites.length} filter={filter} onFilterChange={setFilter} />
                    <div className="site-list">
                        {filteredSites.map((site) => (
                            <SiteRow
                                activityOpen={activityDomain === site.domain}
                                key={site.domain}
                                onAction={handleRowAction}
                                site={site}
                            />
                        ))}
                        {filteredSites.length === 0 && (
                            <div className="empty-state"><Text variant="muted">No matching sites</Text></div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default App;