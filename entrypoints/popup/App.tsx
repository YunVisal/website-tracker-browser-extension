import { useEffect, useMemo, useRef, useState } from 'react';
import { DashboardHeader, CurrentTabPanel, DomainEntryForm, BlockedSitesToolbar } from './components/molecules';
import { BlockedSitesList } from './components/organisms/BlockedSitesList';
import type { BlockedSite } from './components/types';
import { blockedSitesStorage } from './utilities/blockedSitesStorage';
import {
  checkDuplicate,
  removeBlockedSite,
  toggleBlockedSitePaused,
} from './utilities/storage';
import { normalizeDomain } from './utilities/url';
import './App.css';

function App() {
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string>();
  const [shieldEnabled, setShieldEnabled] = useState(true);
  const [storageReady, setStorageReady] = useState(false);
  const blockedSitesRef = useRef<BlockedSite[]>([]);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    let storageChanged = false;
    const unwatch = blockedSitesStorage.watch((sites) => {
      if (!active) return;
      storageChanged = true;
      blockedSitesRef.current = sites;
      setBlockedSites(sites);
      setStorageReady(true);
    });

    blockedSitesStorage.getValue()
      .then((sites) => {
        if (!active || storageChanged) return;
        blockedSitesRef.current = sites;
        setBlockedSites(sites);
        setStorageReady(true);
      })
      .catch(() => {
        if (active) setError('Unable to load blocked websites');
      });

    return () => {
      active = false;
      unwatch();
    };
  }, []);

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

  const saveBlockedSites = (sites: BlockedSite[]) => {
    blockedSitesRef.current = sites;
    setBlockedSites(sites);
    saveQueueRef.current = saveQueueRef.current
      .then(() => blockedSitesStorage.setValue(sites))
      .catch(() => setError('Unable to save blocked websites'));
  };

  const addDomain = (value: string) => {
    if (!storageReady) return;

    try {
      const domain = normalizeDomain(value);
      const currentSites = blockedSitesRef.current;
      const duplicate = checkDuplicate(domain, currentSites.map((site) => site.domain));
      if (!duplicate.ok) {
        setError(duplicate.error);
        return;
      }

      saveBlockedSites([...currentSites, { domain, paused: false }]);
      setDomainInput('');
      setError(undefined);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to add this website');
    }
  };

  const togglePaused = (domain: string) => {
    if (!storageReady) return;
    saveBlockedSites(toggleBlockedSitePaused(blockedSitesRef.current, domain));
  };

  return (
    <main className="popup-shell">
      <DashboardHeader shieldEnabled={shieldEnabled} onShieldChange={setShieldEnabled} />
      <CurrentTabPanel
        shieldEnabled={shieldEnabled}
        domain={currentDomain}
        disabled={!storageReady}
        onBlock={() => addDomain(currentDomain)}
      />
      <DomainEntryForm
        value={domainInput}
        error={error}
        disabled={!storageReady}
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
          onRemove={(domain) => {
            if (storageReady) saveBlockedSites(removeBlockedSite(blockedSitesRef.current, domain));
          }}
        />
      </section>
    </main>
  );
}

export default App;