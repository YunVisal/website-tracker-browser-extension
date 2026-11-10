import { describe, expect, it } from 'vitest';
import {
    createBlockingRules,
    getHostPermissionPattern,
    siteMatchesBlockedDomain,
} from '../../utilities/blockingRules';

describe('createBlockingRules', () => {
    const sites = [
        { domain: 'example.com', paused: false },
        { domain: 'paused.example', paused: true },
    ];

    it('creates main-frame redirects for active sites only', () => {
        expect(createBlockingRules(sites, true, 'chrome-extension://extension-id/blocked.html')).toEqual([
            {
                id: 1,
                priority: 1,
                action: {
                    type: 'redirect',
                    redirect: {
                        url: 'chrome-extension://extension-id/blocked.html?url=https%3A%2F%2Fexample.com%2F',
                    },
                },
                condition: {
                    requestDomains: ['example.com'],
                    resourceTypes: ['main_frame'],
                },
            },
        ]);
    });

    it('removes all rules when the shield is disabled', () => {
        expect(createBlockingRules(sites, false, 'chrome-extension://extension-id/blocked.html')).toEqual([]);
    });
});

describe('siteMatchesBlockedDomain', () => {
    it('matches the exact domain and its subdomains only', () => {
        expect(siteMatchesBlockedDomain('example.com', 'example.com')).toBe(true);
        expect(siteMatchesBlockedDomain('mail.example.com', 'example.com')).toBe(true);
        expect(siteMatchesBlockedDomain('notexample.com', 'example.com')).toBe(false);
    });
});

describe('getHostPermissionPattern', () => {
    it('matches a domain and its subdomains over HTTP and HTTPS', () => {
        expect(getHostPermissionPattern('example.com')).toBe('*://*.example.com/*');
    });
});