import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader, CurrentTabPanel, DomainEntryForm, BlockedSitesToolbar } from './components/molecules';
import { BlockedSitesList } from './components/organisms/BlockedSitesList';
import type { BlockedSite } from './components/types';
import { checkDuplicate } from './utilities/storage';
import { normalizeDomain } from './utilities/url';
import './App.css';

function App() {
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string>();
  const [shieldEnabled, setShieldEnabled] = useState(true);

  useEffect(() => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(([tab]) => setCurrentUrl(tab?.url ?? ''))
      .catch(() => setCurrentUrl(''));
  }, []);

  const currentDomain = useMemo(() => {
    if (!currentUrl) return '';
    try {
      return normalizeDomain(currentUrl);
    } catch {
      return '';
    }
  }, [currentUrl]);

  const filteredSites = blockedSites.filter(({ domain }) =>
    domain.includes(filter.trim().toLowerCase()),
  );

  const addDomain = (value: string) => {
    try {
      const domain = normalizeDomain(value);
      const duplicate = checkDuplicate(domain, blockedSites.map((site) => site.domain));
      if (!duplicate.ok) {
        setError(duplicate.error);
        return;
      }

      setBlockedSites((sites) => [...sites, { domain, paused: false, attempts: 0 }]);
      setDomainInput('');
      setError(undefined);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to add this website');
    }
  };

  const togglePaused = (domain: string) => {
    setBlockedSites((sites) =>
      sites.map((site) => site.domain === domain ? { ...site, paused: !site.paused } : site),
    );
  };

  return (
    <main className="popup-shell">
      <DashboardHeader shieldEnabled={shieldEnabled} onShieldChange={setShieldEnabled} />
      <CurrentTabPanel
        shieldEnabled={shieldEnabled}
        domain={currentDomain}
        onBlock={() => addDomain(currentDomain)}
      />
      <DomainEntryForm
        value={domainInput}
        error={error}
        onValueChange={(value) => {
          setDomainInput(value);
          if (error) setError(undefined);
        }}
        onSubmit={() => addDomain(domainInput)}
      />

      <section className="sites-section" aria-labelledby="blocked-sites-heading">
        <BlockedSitesToolbar
          count={blockedSites.length}
          filter={filter}
          onFilterChange={setFilter}
        />
        <BlockedSitesList
          sites={filteredSites}
          filter={filter}
          onPauseToggle={togglePaused}
          onFilter={setFilter}
          onRemove={(domain) => setBlockedSites((sites) => sites.filter((site) => site.domain !== domain))}
        />
      </section>
    </main>
  );
}

export default App;