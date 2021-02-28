import { Heading, Box, Divider } from "@chakra-ui/react";
import { Container } from "../components/container/container";
import { Footer } from "../components/footer/footer";
import Contracts from "../components/contracts/contracts";
import Search from "../components/search/search";

export default function Home({ contracts }: HomeProps) {
  return (
    <Container centerContent>
      <Box padding="8" maxW="3xl">
        <Heading>Find Clarity contracts</Heading>
        <Search />
      </Box>
      <Divider />
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
    </Container>
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
      smart_contract: { contract_id: string; source_code: string };
    }[];
  };
}
