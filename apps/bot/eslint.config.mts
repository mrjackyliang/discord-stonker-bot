import {
  dxCodeStyle,
  dxIgnore,
  fwExpressjs,
  fwReact,
  langJavascript,
  langTypescript,
  novaRules,
  runtimeBrowser,
  runtimeNode,
  toolVite,
} from '@cbnventures/nova/presets/eslint';

/**
 * ESLint Configuration.
 *
 * Composes Nova's Node.js, TypeScript, and Express contracts for the bot.
 * The control panel under src/web adds Nova's React and browser contracts.
 *
 * @since 0.0.0
 */
export default [
  ...dxIgnore,
  ...dxCodeStyle,
  ...langJavascript,
  ...langTypescript,
  ...fwExpressjs,
  ...runtimeNode,
  ...fwReact.map((config) => ({
    ...config,
    files: [
      'src/web/**/*.ts',
      'src/web/**/*.tsx',
    ],
  })),
  ...runtimeBrowser.map((config) => ({
    ...config,
    files: [
      'src/web/**/*.ts',
      'src/web/**/*.tsx',
    ],
  })),
  ...toolVite,
  {
    name: 'custom-tsconfig',
    files: [
      '**/*.cts',
      '**/*.mts',
      '**/*.ts',
      '**/*.tsx',
    ],
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.source.json',
          './tsconfig.config.json',
          './tsconfig.tests.json',
          './tsconfig.web.json',
        ],
      },
    },
  },
  ...novaRules,
  {
    name: 'custom-nova-rules',
    rules: {
      '@cbnventures/nova/no-regex-literals': [
        'error',
        {
          ignoreFiles: [],
          regexFile: './src/lib/regex.ts',
        },
      ],
      '@cbnventures/nova/require-kebab-case-filename': [
        'error',
        {
          extraExtensions: [],
          ignoreFiles: [
            './eslint.config.mts',
            './vite.config.mts',
            './vitest.config.mts',
          ],
        },
      ],
    },
  },
  {
    // The control panel shares its React files with the other appliances, written in that interface's style.
    name: 'console-interface',
    files: [
      'mock-api.mts',
      'src/types/web/**/*.d.ts',
      'src/web/**/*.ts',
      'src/web/**/*.tsx',
    ],
    rules: {
      '@cbnventures/nova/no-bracket-assignment': 'off',
      '@cbnventures/nova/no-complex-arrow-concise': 'off',
      '@cbnventures/nova/no-destructuring': 'off',
      '@cbnventures/nova/no-implicit-boolean': 'off',
      '@cbnventures/nova/no-inline-type-annotation': 'off',
      '@cbnventures/nova/no-multiline-strings': 'off',
      '@cbnventures/nova/no-optional-chaining': 'off',
      '@cbnventures/nova/no-regex-literal-flags': 'off',
      '@cbnventures/nova/no-regex-literals': 'off',
      '@cbnventures/nova/no-ternary-in-template-literal': 'off',
      '@cbnventures/nova/no-use-before-define': 'off',
      '@cbnventures/nova/require-bracket-property-access': 'off',
      '@cbnventures/nova/require-explicit-return': 'off',
      '@cbnventures/nova/require-jsdoc-hierarchy': 'off',
      '@cbnventures/nova/require-jsdoc-returns': 'off',
      '@cbnventures/nova/require-multiline-condition-groups': 'off',
      '@cbnventures/nova/require-multiline-conditions': 'off',
      '@cbnventures/nova/require-padding-lines': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
  {
    // Reading the log stream in tests uses web streams, stable since Node.js 22.15.
    name: 'log-stream-tests',
    files: [
      'src/routes/logs.test.ts',
      'src/types/tests/routes/logs.test.d.ts',
    ],
    rules: {
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
  {
    name: 'control-panel-e2e',
    files: [
      'playwright-config.mjs',
      'tests/e2e/**/*.mjs',
    ],
    rules: {
      '@cbnventures/nova/no-await-in-loop': 'off',
      '@cbnventures/nova/no-inline-type-annotation': 'off',
      '@cbnventures/nova/require-explicit-return': 'off',
      '@cbnventures/nova/require-padding-lines': 'off',
    },
  },
];
