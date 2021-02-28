import Head from "next/head";
import Contracts from "../components/contracts/contracts";
import styles from "../styles/Home.module.scss";

export default function Home({ contracts }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Clarity Contract Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://clarity-lang.org/">Clarity</a> contract
          search
        </h1>
        <Contracts contracts={contracts.results} />
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
  );
}

export async function getStaticProps() {
  const res = await fetch(
    "https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/?limit=200&type=smart_contract"
  );
  const contracts = await res.json();

  return {
    props: {
      contracts,
    },
  };
}