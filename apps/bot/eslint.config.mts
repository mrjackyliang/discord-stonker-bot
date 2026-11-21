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
  ...runtimeNode.map((config) => ({
    ...config,
    ignores: [
      'src/types/web/**',
      'src/web/**',
    ],
  })),
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
    // The control panel and its mock API keep their patterns beside the panel code, apart from the bot's patterns.
    name: 'control-panel-regex-file',
    files: [
      'mock-api.mts',
      'src/web/**/*.ts',
      'src/web/**/*.tsx',
    ],
    rules: {
      '@cbnventures/nova/no-regex-literals': [
        'error',
        {
          ignoreFiles: [],
          regexFile: './src/web/regex.ts',
        },
      ],
    },
  },
];
