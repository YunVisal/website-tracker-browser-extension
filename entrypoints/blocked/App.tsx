import { useEffect } from 'react';
import { BlockedContentPage } from './components/organisms/BlockedContentPage';
import { blockedSitesStorage } from '../popup/utilities/blockedSitesStorage';
import { getHostPermissionPattern, siteMatchesBlockedDomain } from '../popup/utilities/blockingRules';
import { shieldEnabledStorage } from '../popup/utilities/shieldStorage';

function getBlockedSite() {
    const rawSite = new URLSearchParams(window.location.search).get('url');
    if (!rawSite) return 'reddit.com/popular';

    try {
        const parsedSite = new URL(rawSite);
        return `${parsedSite.host}${parsedSite.pathname}`.replace(/\/$/, '');
    } catch {
        return rawSite;
    }
}

function App() {
    const version = browser.runtime.getManifest().version;

    useEffect(() => {
        let active = true;

        const restoreIfAllowed = async () => {
            const rawUrl = new URLSearchParams(window.location.search).get('url');
            if (!rawUrl) return;

            let originalUrl: URL;
            try {
                originalUrl = new URL(rawUrl);
                if (!['http:', 'https:'].includes(originalUrl.protocol)) return;
            } catch {
                return;
            }

            try {
                const [sites, shieldEnabled] = await Promise.all([
                    blockedSitesStorage.getValue(),
                    shieldEnabledStorage.getValue(),
                ]);
                if (!active) return;

                const matchingSites = shieldEnabled
                    ? sites.filter(({ domain, paused }) =>
                        !paused && siteMatchesBlockedDomain(originalUrl.hostname.toLowerCase(), domain),
                    )
                    : [];
                const permittedSites = await Promise.all(matchingSites.map(async (site) => ({
                    site,
                    permitted: await browser.permissions.contains({
                        origins: [getHostPermissionPattern(site.domain)],
                    }),
                })));

                if (active && !permittedSites.some(({ permitted }) => permitted)) {
                    window.location.replace(originalUrl.toString());
                }
            } catch (error) {
                console.warn('Unable to verify whether this site is still blocked', error);
            }
        };

        void restoreIfAllowed();
        return () => {
            active = false;
        };
    }, []);

    return (
        <BlockedContentPage
            site={getBlockedSite()}
            version={version}
            onReturn={() => window.history.back()}
        />
    );
}

export default App;