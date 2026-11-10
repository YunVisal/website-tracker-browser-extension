import type { BlockedSite } from '../components/types';

export type BlockingRule = {
    id: number;
    priority: number;
    action: {
        type: 'redirect';
        redirect: {
            url: string;
        };
    };
    condition: {
        requestDomains: string[];
        resourceTypes: ['main_frame'];
    };
};

export function getHostPermissionPattern(domain: string) {
    return `*://*.${domain}/*`;
}

export function siteMatchesBlockedDomain(siteDomain: string, blockedDomain: string) {
    return siteDomain === blockedDomain || siteDomain.endsWith(`.${blockedDomain}`);
}

export function createBlockingRules(
    sites: BlockedSite[],
    shieldEnabled: boolean,
    blockedPageUrl: string,
): BlockingRule[] {
    if (!shieldEnabled) return [];

    return sites
        .filter((site) => !site.paused)
        .map((site, index) => ({
            id: index + 1,
            priority: 1,
            action: {
                type: 'redirect' as const,
                redirect: {
                    url: `${blockedPageUrl}?url=${encodeURIComponent(`https://${site.domain}/`)}`,
                },
            },
            condition: {
                requestDomains: [site.domain],
                resourceTypes: ['main_frame'],
            },
        }));
}