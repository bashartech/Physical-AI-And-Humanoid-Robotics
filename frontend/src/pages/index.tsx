// import type {ReactNode} from 'react';
// import clsx from 'clsx';
// import Link from '@docusaurus/Link';
// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// import Layout from '@theme/Layout';
// import HomepageFeatures from '@site/src/components/HomepageFeatures';
// import Heading from '@theme/Heading';

// import styles from './index.module.css';

// function HomepageHeader() {
//   const {siteConfig} = useDocusaurusContext();
//   return (
//     <header className={clsx('hero hero--primary', styles.heroBanner)}>
//       <div className="container">
//         <Heading as="h1" className="hero__title">
//           {siteConfig.title}
//         </Heading>
//         <p className="hero__subtitle">{siteConfig.tagline}</p>
//         <div className={styles.buttons}>
//           <Link
//             className="button button--secondary button--lg"
//             to="/docs/intro">
//             Docusaurus Tutorial - 5min ⏱️
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default function Home(): ReactNode {
//   const {siteConfig} = useDocusaurusContext();
//   return (
//     <Layout
//       title={`Hello from ${siteConfig.title}`}
//       description="Description will go into a meta tag in <head />">
//       <HomepageHeader />
//       <main>
//         <HomepageFeatures />
//       </main>
//     </Layout>
//   );
// }

import type { ReactNode } from "react"
import clsx from "clsx"
import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Layout from "@theme/Layout"
import HomepageFeatures from "../components/HomepageFeatures"
import Heading from "@theme/Heading"
import styles from "./index.module.css"

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.notificationBadge}>
            <span className={styles.badgeIcon}>✨</span>
            <span>Premium Documentation Platform</span>
          </div>

          <Heading as="h1" className={clsx("hero__title", styles.heroTitle)}>
            {siteConfig.title}
          </Heading>
          <p className={clsx("hero__subtitle", styles.heroSubtitle)}>{siteConfig.tagline}</p>

          <div className={styles.buttons}>
            <Link className={clsx("button button--primary button--lg", styles.primaryBtn)} to="/docs/intro">
              <span className={styles.btnIcon}>📖</span>
              <span>Start Reading</span>
            </Link>
            <Link className={clsx("button button--secondary button--lg", styles.secondaryBtn)} to="/blog">
              <span className={styles.btnIcon}>🔬</span>
              <span>View Research</span>
            </Link>
          </div>

          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <div className={styles.highlightIcon}>⚡</div>
              <span>Fast Performance</span>
            </div>
            <div className={styles.highlight}>
              <div className={styles.highlightIcon}>🔒</div>
              <span>Secure & Reliable</span>
            </div>
            <div className={styles.highlight}>
              <div className={styles.highlightIcon}>🚀</div>
              <span>Continuous Updates</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Professional documentation and research on humanoid robotics technology"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
