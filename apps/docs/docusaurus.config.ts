import { NovaIdentity } from '@cbnventures/nova/toolkit';

import type { DocusaurusNovaConfig } from '@cbnventures/docusaurus-preset-nova/types/config';

/**
 * Docusaurus - Identity.
 *
 * Reads the documentation identity from the generated Nova configuration.
 * Fallbacks keep the site runnable while consumers finish project metadata.
 *
 * @since 0.0.0
 */
const identity = new NovaIdentity().forDocs();

/**
 * Docusaurus - Config.
 *
 * Configures the generated documentation site with Nova's selected preset.
 * Consumers can extend these values through normal Docusaurus configuration.
 *
 * @since 0.0.0
 */
const config: DocusaurusNovaConfig = {
  title: identity['title'] ?? '',
  titleDelimiter: '-',
  tagline: identity['tagline'] ?? 'Documentation',
  url: identity['url'] ?? 'https://www.example.com',
  baseUrl: identity['baseUrl'] ?? '/',
  favicon: './favicon.ico',
  organizationName: identity['organizationName'] ?? 'your-org',
  projectName: identity['projectName'] ?? 'discord-stonker-bot',
  trailingSlash: true,
  noIndex: false,
  onBrokenLinks: 'throw',

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: `${identity['baseUrl'] ?? '/'}apple-touch-icon.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: `${identity['baseUrl'] ?? '/'}favicon-96x96.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: `${identity['baseUrl'] ?? '/'}favicon.svg`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: `${identity['baseUrl'] ?? '/'}site.webmanifest`,
      },
    },
  ],

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [[
    '@cbnventures/docusaurus-preset-nova',
    {
      // Preset Identity.
      preset: 'sentinel',

      // Preset Overrides (undefined = use preset default).
      overrides: {
        colors: {
          primary: {
            light: '#7367F0',
            dark: '#7367F0',
          },
          secondary: {
            light: '#0D9488',
            dark: '#0D9488',
          },
          text: undefined,
          border: undefined,
          warning: undefined,
          danger: undefined,
        },
        fonts: {
          display: undefined,
          body: undefined,
          code: undefined,
        },
        navbar: undefined,
        footer: 'commons',
      },

      // Plugins.
      plugins: {
        blog: {
          showReadingTime: true,
          blogTitle: 'Blog',
          blogDescription: 'Release notes, migration guides, and notes on running a safer, sharper Discord community.',
          postsPerPage: 10,
          blogSidebarTitle: 'Recent Posts',
          blogSidebarCount: 15,
          feedOptions: {
            type: [
              'rss',
              'atom',
            ],
            copyright: identity['copyright'],
            limit: 20,
            title: 'Stonker Bot for Discord Blog',
            description: 'Release notes, migration guides, and notes on running a safer, sharper Discord community.',
          },
        },
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['**/docs/tags/**'],
          filename: 'sitemap.xml',
        },
      },

      // Search.
      search: {},
    },
  ]],

  themeConfig: {
    site: {
      logo: {
        alt: 'Stonker Bot for Discord',
        src: {
          light: `${identity['baseUrl'] ?? '/'}images/navbar.svg`,
          dark: undefined,
        },
        href: '/',
      },
      image: '/thumbnails/brand.png',
      metadata: [
        {
          name: 'description',
          content: identity['metaDescription'] ?? '',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      ],
    },
    navbar: {
      hideOnScroll: false,
      items: [
        {
          label: 'Overview',
          position: 'left',
          type: 'doc',
          docId: 'overview',
          icon: 'lucide:book-open',
        },
        {
          label: 'Installation',
          position: 'left',
          type: 'doc',
          docId: 'getting-started/installation',
          icon: 'lucide:rocket',
        },
        {
          label: 'Blog',
          position: 'left',
          type: undefined,
          to: '/blog/',
          icon: 'lucide:pen-line',
        },
        {
          label: 'Sponsor',
          position: 'right',
          type: undefined,
          href: 'https://github.com/sponsors/mrjackyliang',
          icon: 'lucide:heart',
        },
      ],
    },

    // Blog.
    blog: {
      sidebar: {
        groupByYear: true,
      },
      layout: {
        heading: 'Blog',
        description: 'Release notes and migration guides',
      },
      share: {
        platforms: [
          'linkedin',
          'reddit',
          'facebook',
          'x',
          'copy',
        ],
      },
    },

    // Error Pages - overrides Nova's randomized defaults with consumer copy.
    // Any unset field falls through to the Nova-flavored randomized pool.
    errorPages: {
      notFound: {
        title: 'This page could not be found.',
        description: 'The page may have moved, or the link may be out of date.',
        backHomeLabel: 'Back to the overview',
        backHomeHref: '/docs/overview/',
      },
      errorPageContent: {
        title: 'This page could not be loaded.',
        retryLabel: 'Reload the page',
      },
      error: {
        retryLabel: 'Try again',
      },
    },

    footer: {
      sections: {
        docs: [
          {
            label: 'Overview',
            href: '/docs/overview/',
          },
          {
            label: 'Installation',
            href: '/docs/getting-started/installation/',
          },
          {
            label: 'First-Run Setup',
            href: '/docs/getting-started/first-run/',
          },
          {
            label: 'Legacy Migration',
            href: '/docs/migration/legacy-migration/',
          },
        ],
        project: [
          {
            label: 'Blog',
            href: '/blog/',
          },
          {
            label: 'GitHub',
            href: 'https://github.com/mrjackyliang/discord-stonker-bot',
          },
          {
            label: 'Discord Developer Portal',
            href: 'https://discord.com/developers/applications',
          },
          {
            label: 'Report an Issue',
            href: 'https://github.com/mrjackyliang/discord-stonker-bot/issues',
          },
        ],
        legal: [{
          label: 'License',
          href: 'https://github.com/mrjackyliang/discord-stonker-bot/blob/main/LICENSE',
        }],
      },
      layout: {
        docs: {
          title: 'Docs',
          section: 'docs',
        },
        project: {
          title: 'Project',
          section: 'project',
        },
        legal: {
          title: 'Legal',
          section: 'legal',
        },
      },
      socialLinks: [
        {
          icon: 'ri:github-fill',
          href: 'https://github.com/mrjackyliang',
          label: 'GitHub',
        },
        {
          icon: 'ri:heart-fill',
          href: 'https://github.com/sponsors/mrjackyliang',
          label: 'GitHub Sponsors',
        },
      ],
      copyright: identity['copyright'],
      credit: true,
      cta: {
        label: 'View on GitHub',
        href: 'https://github.com/mrjackyliang/discord-stonker-bot',
      },
    },
  },
};

export default config;
