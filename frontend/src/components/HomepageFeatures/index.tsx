
import type React from "react"
import type { ReactNode } from "react"
import clsx from "clsx"
import Heading from "@theme/Heading"
import styles from "./styles.module.css"

type FeatureItem = {
  title: string
  description: ReactNode
  icon?: string
}

const FeatureList: FeatureItem[] = [
  {
    title: "Advanced Robotics",
    description: (
      <>
        Cutting-edge documentation for designing, building, and programming humanoid robots with state-of-the-art
        technology and methodologies.
      </>
    ),
  },
  {
    title: "Comprehensive Guides",
    description: (
      <>
        In-depth technical guides covering kinematics, dynamics, control systems, AI integration, and real-world
        deployment strategies for humanoid platforms.
      </>
    ),
  },
  {
    title: "Powered by Innovation",
    description: (
      <>
        Built with React and modern web technologies. Access research papers, code examples, and interactive simulations
        all in one place.
      </>
    ),
  },
]

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx("col col--3")}>
      <div className={styles.featureItem}>
        {/* <div className={styles.featureIcon}>
          <Svg className={styles.featureSvg} role="img" />
        </div> */}
        <div className={styles.featureContent}>
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresIntro}>
          <Heading as="h2" className={styles.sectionTitle}>
            Everything You Need to Know
          </Heading>
          <p className={styles.sectionSubtitle}>
            Master humanoid robotics with our comprehensive technical documentation and research
          </p>
        </div>
        <div className={clsx("row", styles.featuresRow)}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
