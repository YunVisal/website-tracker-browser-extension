import type { BlockedSite } from './popup/components/types';
import {
  blockedSitesStorage,
  completePendingBlockedSite,
} from './popup/utilities/blockedSitesStorage';
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
        const openTabs = await browser.tabs.query({});
        await Promise.all(openTabs.map(async (tab) => {
          if (!tab.id || !tab.url || !/^https?:\/\//i.test(tab.url)) return;

          try {
            const tabDomain = new URL(tab.url).hostname.toLowerCase().replace(/\.$/, '');
            const isBlocked = permittedSites.some(({ domain }) =>
              siteMatchesBlockedDomain(tabDomain, domain),
            );
            if (!isBlocked) return;

            const blockedPageUrl = new URL(browser.runtime.getURL('/blocked.html'));
            blockedPageUrl.searchParams.set('url', tab.url);
            await browser.tabs.update(tab.id, { url: blockedPageUrl.toString() });
          } catch (error) {
            console.warn(`Unable to redirect tab ${tab.id} to the blocked page`, error);
          }
        }));
      }
    }).catch((error: unknown) => {
      console.error('Unable to update FocusShield blocking rules', error);
    });
  };

  blockedSitesStorage.watch(queueRuleUpdate);
  shieldEnabledStorage.watch(queueRuleUpdate);
  browser.permissions.onAdded.addListener(() => {
    void completePendingBlockedSite()
      .then(queueRuleUpdate)
      .catch((error: unknown) => {
        console.error('Unable to complete pending blocked website', error);
        queueRuleUpdate();
      });
  });
  browser.permissions.onRemoved.addListener(queueRuleUpdate);
  void completePendingBlockedSite()
    .then(queueRuleUpdate)
    .catch((error: unknown) => {
      console.error('Unable to recover pending blocked website', error);
      queueRuleUpdate();
    });
});
