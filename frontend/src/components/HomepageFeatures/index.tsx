// import type {ReactNode} from 'react';
// import clsx from 'clsx';
// import Heading from '@theme/Heading';
// import styles from './styles.module.css';

// type FeatureItem = {
//   title: string;
//   Svg: React.ComponentType<React.ComponentProps<'svg'>>;
//   description: ReactNode;
// };

// const FeatureList: FeatureItem[] = [
//   {
//     title: 'Easy to Use',
//     Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
//     description: (
//       <>
//         Docusaurus was designed from the ground up to be easily installed and
//         used to get your website up and running quickly.
//       </>
//     ),
//   },
//   {
//     title: 'Focus on What Matters',
//     Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
//     description: (
//       <>
//         Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
//         ahead and move your docs into the <code>docs</code> directory.
//       </>
//     ),
//   },
//   {
//     title: 'Powered by React',
//     Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
//     description: (
//       <>
//         Extend or customize your website layout by reusing React. Docusaurus can
//         be extended while reusing the same header and footer.
//       </>
//     ),
//   },
// ];

// function Feature({title, Svg, description}: FeatureItem) {
//   return (
//     <div className={clsx('col col--4')}>
//       <div className="text--center">
//         <Svg className={styles.featureSvg} role="img" />
//       </div>
//       <div className="text--center padding-horiz--md">
//         <Heading as="h3">{title}</Heading>
//         <p>{description}</p>
//       </div>
//     </div>
//   );
// }

// export default function HomepageFeatures(): ReactNode {
//   return (
//     <section className={styles.features}>
//       <div className="container">
//         <div className="row">
//           {FeatureList.map((props, idx) => (
//             <Feature key={idx} {...props} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
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
