import { Flex, Stack, Checkbox, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Footer } from "../components/footer/footer";
import Contracts from "../components/contracts/contracts";
import Header from "../components/header/header";
import Search from "../components/search/search";

export default function Home({ contracts }: HomeProps) {
  const [included, setIncluded] = useState([false]);

  function renderFilter() {
    // TODO: Set filter state
    return (
      <Box m="4">
        <Text>Only contracts that include ...</Text>
        <Stack p="2" direction="row">
          <Checkbox
            isChecked={included[0]}
            onChange={(e) => setIncluded([e.target.checked])}
          >
            Constants
          </Checkbox>
        </Stack>
      </Box>
    );
  }

  return (
    <Flex direction="column">
      <Header title="Find Clarity contracts" />
      <Search />
      {renderFilter()}
      <Contracts contracts={contracts.results} filters={included} />
      <Footer>
        <a
          href="https://twitter.com/agraebe"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with ❤️ by agraebe
        </a>
      </Footer>
    </Flex>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    "https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/?limit=200&type=smart_contract"
  );
  const contracts = await res.json();

  if (!contracts) {
    return {
      notFound: true,
    };
  }

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
