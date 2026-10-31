// @ts-check

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import autoImports from './.wxt/eslint-auto-imports.mjs';

export default defineConfig([
    {
        ignores: ['.output/**', '.wxt/**'],
    },
    autoImports,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        extends: [js.configs.recommended, tseslint.configs.recommended],
    }]);