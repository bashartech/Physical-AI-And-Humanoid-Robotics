

import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics Book',
  tagline: 'A Comprehensive Guide to Building the Next Generation of Humanoid Intelligence.',
  favicon: 'img/logo_doca.PNG',


  url: 'https://physical-ai-and-humanoid-robotics-x.vercel.app/',
  baseUrl: '/',
  organizationName: 'bashartech',
  projectName: 'Physical-AI-And-Humanoid-Robotics',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  deploymentBranch:"deployment",
  trailingSlash: false,

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/your-org/my-docusaurus-site/edit/main/',
        },
        blog: false, 
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
      disableSwitch: true,
    },
    navbar: {
      title: 'AI Research Reads',
      logo: {alt: 'Logo', src: 'img/logo_doca.PNG'},
      items: [
        {type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: 'Book'},
        {
  href: `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/login`,
  label: 'Login',
  position: 'right'
},
        {
  href: `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/signup`,
  label: 'Signup',
  position: 'right'
},
        {href: 'https://github.com/bashartech/Physical-AI-And-Humanoid-Robotics', label: 'GitHub', position: 'right'},
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [{label: 'Book', to: '/docs/intro'}],
        },
        {
          title: 'Community',
          items: [
            {label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/docusaurus'},
            {label: 'Github', href: 'https://github.com/bashartech'},
            {label: 'Linkedln', href: 'https://www.linkedin.com/in/m-bashar-sheikh?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Sign Up'
              , href:
               'https://physical-ai-and-humanoid-robotics-ebon-seven.vercel.app/signup'
              },
            {label: 'Login'
              , href:
               'https://physical-ai-and-humanoid-robotics-ebon-seven.vercel.app/login'
              },

          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AI Research Reads, Inc.`,
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;



