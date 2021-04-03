import React, { useEffect } from "react";
import {
  Flex,
  Stack,
  Checkbox,
  Box,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Footer } from "../components/footer/footer";
import Contracts from "../components/contracts/contracts";
import Header from "../components/header/header";
import Search from "../components/search/search";
import ClarityContract, {
  ClarityContractSerialized
} from "../classes/clarity-contract";

export default function Home({ contracts }: HomeProps) {
  const filter = useNextQueryParam("filter") || "";
  const [included, setIncluded] = useState([
    filter.includes("readonly"),
    filter.includes("public"),
    filter.includes("const"),
    filter.includes("datavar"),
    filter.includes("map"),
    filter.includes("nft"),
    filter.includes("ft")
  ]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const filterNames = [
    "read-only methods",
    "public methods",
    "constants",
    "data variables",
    "maps",
    "non-fungible tokens",
    "fungible tokens"
  ];

  useEffect(() => {
    setFilteredContracts([]);
    contracts.forEach((contract, i) => {
      if (isIncluded(contract)) {
        setFilteredContracts(arr => [...arr, contract]);
      }
    });
  }, [contracts, included]);

  function renderFilter(color) {
    return (
      <Box m="4" borderRadius="lg" p="4" bg={color}>
        <Text>Only contracts that declare ...</Text>
        <Stack p="2" spacing={6} direction="row">
          {included.map((elem, i) => {
            return (
              <Checkbox
                isChecked={elem}
                key={`checkbox-${i}`}
                onChange={e => {
                  let newArr = [...included];
                  newArr.map((data, index) => {
                    if (i === index) {
                      newArr[index] = e.target.checked;
                      return;
                    }
                  });
                  setIncluded(newArr);
                }}
              >
                {filterNames[i]}
              </Checkbox>
            );
          })}
        </Stack>
      </Box>
    );
  }

  function isIncluded(contract: ClarityContractSerialized) {
    let matching = true;

    included.forEach((active, i) => {
      if (active) {
        switch (i) {
          case 0:
            if (!contract.readOnlyMethods) matching = false;
            break;
          case 1:
            if (!contract.publicMethods) matching = false;
            break;
          case 2:
            if (!contract.constants) matching = false;
            break;
          case 3:
            if (!contract.dataVars) matching = false;
            break;
          case 4:
            if (!contract.maps) matching = false;
            break;
          case 5:
            if (!contract.nfts) matching = false;
            break;
          case 6:
            if (!contract.fts) matching = false;
            break;
          default:
            break;
        }
      }
    });

    return matching;
  }

  return (
    <Flex direction="column">
      <Header title="Search Clarity contracts" />
      <Search />
      {renderFilter(useColorModeValue("gray.100", "gray.700"))}
      <Text
        align="right"
        fontSize="sm"
        px="4"
        pt="4"
        color={useColorModeValue("gray.800", "gray.100")}
      >
        showing {filteredContracts.length} contracts
      </Text>
      <Contracts contracts={filteredContracts} />
      <Footer>
        <a
          href="https://twitter.com/agraebe"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with{" "}
          <span role="img" aria-label="love">
            ❤️
          </span>{" "}
          by agraebe
        </a>
      </Footer>
    </Flex>
  );
}

export function useNextQueryParam(key: string) {
  const router = useRouter();

  const value = React.useMemo(() => {
    const res = router.asPath.match(new RegExp(`[&?]${key}=(.*)(&|$)`)) || [];
    return res[1];
  }, [router.asPath, key]);

  return value;
}

export async function getStaticProps() {
  const apiUrl =
    "https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/?limit=200&type=smart_contract";
  let data = {
    results: []
  };
  const contracts = [];

  // cache miss, need to fetch
  data = await fetchData(apiUrl);

  // filter for success txs
  (data as any) = data.results.filter(tx => tx.tx_status === "success");

  // instantiate contract instances
  (data as any).forEach(tx => {
    contracts.push(
      new ClarityContract(
        tx.tx_id,
        tx.smart_contract.contract_id,
        tx.smart_contract.source_code
      ).toJSON()
    );
  });

  return {
    props: {
      contracts
    }
  };
}

async function fetchData(url) {
  const query = await fetch(url);
  return await query.json();
}

interface HomeProps {
  contracts: ClarityContractSerialized[];
}
