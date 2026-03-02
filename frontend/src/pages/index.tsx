
import type { ReactNode } from "react"
import clsx from "clsx"
import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Layout from "@theme/Layout"
import HomepageFeatures from "../components/HomepageFeatures"
import Heading from "@theme/Heading"
import styles from "./index.module.css"
import ChatWidget from "../components/ChatWidget"


function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          {/* Left Column */}
          <div className={styles.heroLeft}>
            <div className={styles.topTagline}>
              AI-FIRST FUTURE — BUILD & EXPLORE PHYSICAL AI
            </div>

            <Heading as="h1" className={styles.heroTitle}>
              <span className={styles.heroTitleWhite}>THE PHYSICAL AI</span>
              <span className={styles.heroTitleBlue}>ROBOTICS HUB</span>
            </Heading>

            <p className={styles.heroSubtitle}>
              The <strong>Comprehensive Blueprint</strong> for Building and Understanding{" "}
              <strong>Humanoid Robots</strong>. Full-Stack Documentation for{" "}
              <strong>Physical AI Systems</strong>, from Hardware to Intelligence.
            </p>

            <div className={styles.buttons}>
              <Link className={clsx("button button--primary button--lg", styles.primaryBtn)} to="/docs/intro">
                <span>START READING</span>
                <span className={styles.btnIcon}>→</span>
              </Link>
              <Link className={clsx("button button--secondary button--lg", styles.secondaryBtn)} to="/docs/intro">
                <span>Explore Book</span>
              </Link>
            </div>

            <div className={styles.socialProof}>
              <div className={styles.liveIndicator}></div>
              <span>1,250+ developers learning</span>
            </div>

            <div className={styles.coAuthored}>
              <span className={styles.coAuthoredLabel}>Co-Authored By:</span>
              <div className={styles.avatars}>
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="Author 1"
                  className={styles.avatar}
                />
                <img

                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
                  alt="Author 2"
                  className={styles.avatar}
                />
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Luna"
                  alt="Author 3"
                  className={styles.avatar}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Book Image */}
          <div className={styles.heroRight}>
            <img
              src="/img/img3.PNG"
              alt="Physical AI Robotics Book"
              className={styles.bookImage}
            />
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
        {/* <ChatWidget /> */}
        <HomepageFeatures />

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50+</div>
              <div className={styles.statLabel}>Comprehensive Chapters</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1,250+</div>
              <div className={styles.statLabel}>Active Learners</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Open Source</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Community Support</div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Build the Future?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of developers mastering humanoid robotics and physical AI systems
            </p>
            <div className={styles.ctaButtons}>
              <Link className={clsx("button button--primary button--lg", styles.primaryBtn)} to="/docs/intro">
                <span>Get Started Now</span>
                <span className={styles.btnIcon}>→</span>
              </Link>
              <Link className={clsx("button button--secondary button--lg", styles.secondaryBtn)} to="/docs/intro">
                <span>Read Our Book</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
