import { BlockedPageHeader, RestrictionMessage, ReturnToSafeZoneAction } from '../molecules';
import { VersionLabel } from '../atoms';

type BlockedContentPageProps = {
    site: string;
    version: string;
    onReturn: () => void;
};

export function BlockedContentPage({ site, version, onReturn }: BlockedContentPageProps) {
    return (
        <div className="blocked-page">
            <BlockedPageHeader />
            <main className="blocked-main">
                <div className="blocked-content">
                    <RestrictionMessage site={site} />
                    <ReturnToSafeZoneAction onReturn={onReturn} />
                </div>
            </main>
            <footer className="blocked-footer">
                <VersionLabel version={version} />
            </footer>
        </div>
    );
}