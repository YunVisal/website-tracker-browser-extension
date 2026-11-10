import type { BlockedSite } from './popup/components/types';
import { blockedSitesStorage } from './popup/utilities/blockedSitesStorage';
import {
  createBlockingRules,
  getHostPermissionPattern,
  siteMatchesBlockedDomain,
} from './popup/utilities/blockingRules';
import { shieldEnabledStorage } from './popup/utilities/shieldStorage';

export default defineBackground(() => {
  let updateQueue = Promise.resolve();

  const queueRuleUpdate = () => {
    updateQueue = updateQueue.then(async () => {
      const [sites, shieldEnabled] = await Promise.all([
        blockedSitesStorage.getValue(),
        shieldEnabledStorage.getValue(),
      ]);
      const permittedSites: BlockedSite[] = [];

      if (shieldEnabled) {
        for (const site of sites) {
          if (site.paused) continue;
          const permitted = await browser.permissions.contains({
            origins: [getHostPermissionPattern(site.domain)],
          });
          if (permitted) permittedSites.push(site);
        }
      }

      const rules = createBlockingRules(
        permittedSites,
        shieldEnabled,
        browser.runtime.getURL('/blocked.html'),
      );
      const currentRules = await browser.declarativeNetRequest.getDynamicRules();
      await browser.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: currentRules.map(({ id }) => id),
        addRules: rules,
      });

      if (shieldEnabled && permittedSites.length) {
        try {
          const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
          if (!activeTab?.id || !activeTab.url) return;

          const activeDomain = new URL(activeTab.url).hostname.toLowerCase().replace(/\.$/, '');
          const isBlocked = permittedSites.some(({ domain }) =>
            siteMatchesBlockedDomain(activeDomain, domain),
          );
          if (isBlocked) {
            const blockedPageUrl = new URL(browser.runtime.getURL('/blocked.html'));
            blockedPageUrl.searchParams.set('url', activeTab.url);
            await browser.tabs.update(activeTab.id, { url: blockedPageUrl.toString() });
          }
        } catch (error) {
          console.warn('Unable to redirect the current tab to the blocked page', error);
        }
      }
    }).catch((error: unknown) => {
      console.error('Unable to update FocusShield blocking rules', error);
    });
  };

  blockedSitesStorage.watch(queueRuleUpdate);
  shieldEnabledStorage.watch(queueRuleUpdate);
  browser.permissions.onAdded.addListener(queueRuleUpdate);
  browser.permissions.onRemoved.addListener(queueRuleUpdate);
  queueRuleUpdate();
});
