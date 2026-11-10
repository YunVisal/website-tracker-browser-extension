import { storage } from 'wxt/utils/storage';

export const shieldEnabledStorage = storage.defineItem<boolean>('local:shield-enabled', {
    fallback: true,
});