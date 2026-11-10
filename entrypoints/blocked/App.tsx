import { BlockedContentPage } from './components/organisms/BlockedContentPage';

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

    return (
        <BlockedContentPage
            site={getBlockedSite()}
            version={version}
            onReturn={() => window.history.back()}
        />
    );
}

export default App;