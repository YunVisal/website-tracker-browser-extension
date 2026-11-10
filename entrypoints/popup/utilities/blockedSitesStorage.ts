import { storage } from 'wxt/utils/storage';
import type { BlockedSite } from '../components/types';

export const blockedSitesStorage = storage.defineItem<BlockedSite[]>('local:blocked-sites', {
    fallback: [],
});