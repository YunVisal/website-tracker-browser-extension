import { storage } from 'wxt/utils/storage';
import type { BlockedSite } from '../components/types';
import { getHostPermissionPattern } from './blockingRules';

export const blockedSitesStorage = storage.defineItem<BlockedSite[]>('local:blocked-sites', {
    fallback: [],
});

export const pendingBlockedSiteStorage = storage.defineItem<string>('local:pending-blocked-site', {
    fallback: '',
});

export async function completePendingBlockedSite(requestedDomain?: string) {
    const pendingDomain = await pendingBlockedSiteStorage.getValue();
    const domain = requestedDomain || pendingDomain;
    if (!domain) return null;

    const permitted = await browser.permissions.contains({
        origins: [getHostPermissionPattern(domain)],
    });
    if (!permitted) return null;

    const sites = await blockedSitesStorage.getValue();
    if (!sites.some((site) => site.domain === domain)) {
        await blockedSitesStorage.setValue([{ domain, paused: false }, ...sites]);
    }
    if (pendingDomain === domain) {
        await pendingBlockedSiteStorage.setValue('');
    }
    return domain;
}