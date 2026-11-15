import { defineConfig } from 'wxt';

// See https://wxt.dev/api/reference/wxt/interfaces/inlineconfig.html
export default defineConfig({
  manifestVersion: 3,
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  manifest: {
    permissions: ['activeTab', 'storage', 'declarativeNetRequestWithHostAccess'],
    host_permissions: ['<all_urls>'],
    web_accessible_resources: [
      {
        resources: ['blocked.html'],
        matches: ['http://*/*', 'https://*/*'],
      },
    ],
  },
  imports: {
    eslintrc: {
      enabled: 9,
    },
  },
  autoIcons: {
    baseIconPath: 'assets/icon.svg',
    sizes: [16, 32, 48, 128],
  },
});
