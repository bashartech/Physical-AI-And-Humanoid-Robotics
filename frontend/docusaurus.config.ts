// import {themes as prismThemes} from 'prism-react-renderer';
// import type {Config} from '@docusaurus/types';
// import type * as Preset from '@docusaurus/preset-classic';

// // This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// const config: Config = {
//   title: 'My Site',
//   tagline: 'Dinosaurs are cool',
//   favicon: 'img/favicon.ico',

//   // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
//   future: {
//     v4: true, // Improve compatibility with the upcoming Docusaurus v4
//   },

//   // Set the production url of your site here
//   url: 'https://your-docusaurus-site.example.com',
//   // Set the /<baseUrl>/ pathname under which your site is served
//   // For GitHub pages deployment, it is often '/<projectName>/'
//   baseUrl: '/',

//   // GitHub pages deployment config.
//   // If you aren't using GitHub pages, you don't need these.
//   organizationName: 'facebook', // Usually your GitHub org/user name.
//   projectName: 'docusaurus', // Usually your repo name.

//   onBrokenLinks: 'throw',

//   // Even if you don't use internationalization, you can use this field to set
//   // useful metadata like html lang. For example, if your site is Chinese, you
//   // may want to replace "en" with "zh-Hans".
//   i18n: {
//     defaultLocale: 'en',
//     locales: ['en'],
//   },

//   presets: [
//     [
//       'classic',
//       {
//         docs: {
//           sidebarPath: './sidebars.ts',
//           // Please change this to your repo.
//           // Remove this to remove the "edit this page" links.
//           editUrl:
//             'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
//         },
//         blog: {
//           showReadingTime: true,
//           feedOptions: {
//             type: ['rss', 'atom'],
//             xslt: true,
//           },
//           // Please change this to your repo.
//           // Remove this to remove the "edit this page" links.
//           editUrl:
//             'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
//           // Useful options to enforce blogging best practices
//           onInlineTags: 'warn',
//           onInlineAuthors: 'warn',
//           onUntruncatedBlogPosts: 'warn',
//         },
//         theme: {
//           customCss: './src/css/custom.css',
//         },
//       } satisfies Preset.Options,
//     ],
//   ],

//   themeConfig: {
//     // Replace with your project's social card
//     image: 'img/docusaurus-social-card.jpg',
//     colorMode: {
//       respectPrefersColorScheme: true,
//     },
//     navbar: {
//       title: 'My Site',
//       logo: {
//         alt: 'My Site Logo',
//         src: 'img/logo.svg',
//       },
//       items: [
//         {
//           type: 'docSidebar',
//           sidebarId: 'tutorialSidebar',
//           position: 'left',
//           label: 'Tutorial',
//         },
//         {to: '/blog', label: 'Blog', position: 'left'},
//         {
//           href: 'https://github.com/facebook/docusaurus',
//           label: 'GitHub',
//           position: 'right',
//         },
//       ],
//     },
//     footer: {
//       style: 'dark',
//       links: [
//         {
//           title: 'Docs',
//           items: [
//             {
//               label: 'Tutorial',
//               to: '/docs/intro',
//             },
//           ],
//         },
//         {
//           title: 'Community',
//           items: [
//             {
//               label: 'Stack Overflow',
//               href: 'https://stackoverflow.com/questions/tagged/docusaurus',
//             },
//             {
//               label: 'Discord',
//               href: 'https://discordapp.com/invite/docusaurus',
//             },
//             {
//               label: 'X',
//               href: 'https://x.com/docusaurus',
//             },
//           ],
//         },
//         {
//           title: 'More',
//           items: [
//             {
//               label: 'Blog',
//               to: '/blog',
//             },
//             {
//               label: 'GitHub',
//               href: 'https://github.com/facebook/docusaurus',
//             },
//           ],
//         },
//       ],
//       copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
//     },
//     prism: {
//       theme: prismThemes.github,
//       darkTheme: prismThemes.dracula,
//     },
//   } satisfies Preset.ThemeConfig,
// };

// export default config;






import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics Book',
  tagline: 'A Comprehensive Guide to Building the Next Generation of Humanoid Intelligence.',
  favicon: 'img/logo_doca.PNG',

  url: 'https://bashartech.github.io',
  baseUrl: '/Physical-AI-And-Humanoid-Robotics/',
  organizationName: 'bashartech',
  projectName: 'Physical-AI-And-Humanoid-Robotics',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  deploymentBranch:"deployment",

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
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/your-org/my-docusaurus-site/edit/main/',
        },
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
            {label: 'Discord', href: 'https://discord.gg/docusaurus'},
            {label: 'X', href: 'https://x.com/docusaurus'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub', href: 'https://github.com/bashartech/Physical-AI-And-Humanoid-Robotics'},
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





// import { themes as prismThemes } from "prism-react-renderer"
// import type { Config } from "@docusaurus/types"
// import type * as Preset from "@docusaurus/preset-classic"

// const config: Config = {
//   title: "Humanoid Robotics",
//   tagline: "Explore the future of autonomous humanoid robots - Technical documentation and research",
//   favicon: "img/favicon.ico",
//   url: "https://your-humanoid-robot-site.example.com",
//   baseUrl: "/",
//   organizationName: "robotics",
//   projectName: "humanoid-docs",
//   onBrokenLinks: "throw",
//   i18n: {
//     defaultLocale: "en",
//     locales: ["en"],
//   },
//   presets: [
//     [
//       "classic",
//       {
//         docs: {
//           sidebarPath: "./sidebars.ts",
//           editUrl: "https://github.com/robotics/humanoid-docs/tree/main/",
//         },
//         blog: {
//           showReadingTime: true,
//           feedOptions: {
//             type: ["rss", "atom"],
//             xslt: true,
//           },
//           editUrl: "https://github.com/robotics/humanoid-docs/tree/main/",
//           onInlineTags: "warn",
//           onInlineAuthors: "warn",
//           onUntruncatedBlogPosts: "warn",
//         },
//         theme: {
//           customCss: "./src/css/custom.css",
//         },
//       } satisfies Preset.Options,
//     ],
//   ],
//   themeConfig: {
//     image: "img/docusaurus-social-card.jpg",
//     colorMode: {
//       defaultMode: "dark",
//       disableSwitch: false,
//       respectPrefersColorScheme: true,
//     },
//     navbar: {
//       title: "🤖 Humanoid Robotics",
//       logo: {
//         alt: "Humanoid Robotics Logo",
//         src: "img/logo.svg",
//       },
//       items: [
//         {
//           type: "docSidebar",
//           sidebarId: "tutorialSidebar",
//           position: "left",
//           label: "Documentation",
//         },
//         { to: "/blog", label: "Research", position: "left" },
//         {
//           href: "https://github.com",
//           label: "GitHub",
//           position: "right",
//         },
//       ],
//     },
//     footer: {
//       style: "dark",
//       links: [
//         {
//           title: "Docs",
//           items: [
//             {
//               label: "Getting Started",
//               to: "/docs/intro",
//             },
//             {
//               label: "API Reference",
//               to: "/docs/api",
//             },
//           ],
//         },
//         {
//           title: "Community",
//           items: [
//             {
//               label: "Discord",
//               href: "https://discord.gg",
//             },
//             {
//               label: "GitHub",
//               href: "https://github.com",
//             },
//           ],
//         },
//         {
//           title: "More",
//           items: [
//             {
//               label: "Research Papers",
//               to: "/blog",
//             },
//             {
//               label: "Contact",
//               href: "https://example.com/contact",
//             },
//           ],
//         },
//       ],
//       copyright: `© ${new Date().getFullYear()} Humanoid Robotics. Built with cutting-edge technology.`,
//     },
//     prism: {
//       theme: prismThemes.nightOwl,
//       darkTheme: prismThemes.nightOwl,
//       additionalLanguages: ["python", "cpp", "rust"],
//     },
//   } satisfies Preset.ThemeConfig,
// }

// export default config
