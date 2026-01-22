import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Eretz Realty Admin System',
  tagline: 'Professional Real Estate Management & Email Distribution Platform',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://eretz-realty-docs.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'eretz-realty',
  projectName: 'eretz-realty-admin',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Eretz Realty Admin',
      logo: {
        alt: 'Eretz Realty Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'userDocsSidebar',
          position: 'left',
          label: 'User Documentation',
        },
        {
          type: 'docSidebar',
          sidebarId: 'technicalDocsSidebar',
          position: 'left',
          label: 'Technical Documentation',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'User Documentation',
              to: '/docs/user-documentation',
            },
            {
              label: 'Technical Documentation',
              to: '/docs/technical-documentation',
            },
          ],
        },
        {
          title: 'Getting Started',
          items: [
            {
              label: 'Introduction',
              to: '/docs/user-documentation',
            },
            {
              label: 'Login & Access',
              to: '/docs/user-documentation/getting-started',
            },
            {
              label: 'Dashboard',
              to: '/docs/user-documentation/dashboard-cycle-manager',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Eretz Realty. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
