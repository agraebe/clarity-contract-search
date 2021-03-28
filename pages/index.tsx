import { Footer } from "../components/footer/footer";
import Contracts from "../components/contracts/contracts";
import Search from "../components/search/search";
import Header from "../components/header/header";
import Head from "next/head";

export default function Home({ contracts }: HomeProps) {
  return (
    <>
      <Head>
        <title>Find Clarity contracts</title>
      </Head>
      <Header title="Find Clarity contracts" />
      <Search />
      <Contracts contracts={contracts.results} />
      <Footer>
        <a
          href="https://twitter.com/agraebe"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with ❤️ by agraebe
        </a>
      </Footer>
    </>
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

interface HomeProps {
  contracts: {
    results: {
      tx_id: string;
      tx_status: string;
      sender_address: string;
      smart_contract: { contract_id: string; source_code: string };
    }[];
  };
}
