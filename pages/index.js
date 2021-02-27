import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Clarity Conttract Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://clarity-lang.org/">Clarity</a> contract search
        </h1>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://twitter.com/agraebe"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with ❤️ by agraebe
        </a>
      </footer>
    </div>
  )
}
