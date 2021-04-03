import React, { useEffect } from "react";
import {
  Flex,
  Stack,
  Checkbox,
  Box,
  Text,
  useColorModeValue,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Button,
  CloseButton
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useState } from "react";
import { Footer } from "../components/footer/footer";
import Contracts from "../components/contracts/contracts";
import Header from "../components/header/header";
import ClarityContract, {
  ClarityContractSerialized
} from "../classes/clarity-contract";

export default function Home({ contracts }: HomeProps) {
  const declareParam = useNextQueryParam("declare") || "";
  const useParam = useNextQueryParam("use") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContracts, setFilteredContracts] = useState([]);

  const [included, setIncluded] = useState([
    declareParam.includes("readonly"),
    declareParam.includes("public"),
    declareParam.includes("const"),
    declareParam.includes("datavar"),
    declareParam.includes("map"),
    declareParam.includes("nft"),
    declareParam.includes("ft")
  ]);
  const declarationFilterNames = [
    "read-only methods",
    "public methods",
    "constants",
    "data variables",
    "maps",
    "non-fungible tokens",
    "fungible tokens"
  ];

  const [using, setUsing] = useState([
    useParam.includes("trait"),
    useParam.includes("call"),
    useParam.includes("height")
  ]);
  const usageFilterNames = ["traits", "contract calls", "block height"];

  useEffect(() => {
    filterContracts();
  }, [contracts, included, using]);

  useEffect(() => {
    if (searchTerm === "") {
      filterContracts();
    }
  }, [searchTerm]);

  function filterContracts() {
    setFilteredContracts([]);
    contracts.forEach((contract, i) => {
      if (isIncluded(contract)) {
        setFilteredContracts(arr => [...arr, contract]);
      }
    });
  }

  function renderSearch() {
    return (
      <Box p="4">
        <InputGroup size="lg">
          <InputLeftElement
            children={
              searchTerm === "" ? (
                <SearchIcon />
              ) : (
                <CloseButton
                  onClick={() => {
                    setSearchTerm("");
                    filterContracts();
                  }}
                />
              )
            }
          />
          <Input
            placeholder="Try searching for stack-stx"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                filterContracts();
              }
            }}
          />
          <InputRightElement
            width="5.5rem"
            children={
              <Button
                variant="ghost"
                onClick={() => filterContracts()}
                isDisabled={searchTerm === ""}
                size="sm"
                _hover={{
                  bgGradient: "linear(to-r, green.200, pink.500)"
                }}
              >
                Search
              </Button>
            }
          />
        </InputGroup>
      </Box>
    );
  }

  function renderDeclareFilter() {
    return (
      <Stack p="4" spacing={6} direction="row">
        <Text>Must declare</Text>
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
              {declarationFilterNames[i]}
            </Checkbox>
          );
        })}
      </Stack>
    );
  }

  function renderUsageFilter() {
    return (
      <Stack p="4" spacing={6} direction="row">
        <Text>Must use</Text>
        {using.map((elem, i) => {
          return (
            <Checkbox
              isChecked={elem}
              key={`checkbox-${i}`}
              onChange={e => {
                let newArr = [...using];
                newArr.map((data, index) => {
                  if (i === index) {
                    newArr[index] = e.target.checked;
                    return;
                  }
                });
                setUsing(newArr);
              }}
            >
              {usageFilterNames[i]}
            </Checkbox>
          );
        })}
      </Stack>
    );
  }

  function renderFilter(color) {
    return (
      <Box m="4" boxShadow="base" borderRadius="lg" p="4" bg={color}>
        {renderSearch()}
        {renderDeclareFilter()}
        {renderUsageFilter()}
      </Box>
    );
  }

  function isIncluded(contract: ClarityContractSerialized) {
    let matching = true;

    // exclude by search
    if (
      contract.source.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1
    ) {
      return false;
    }

    // exclude by declaration filter
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

    // exclude by usage filter
    using.forEach((active, i) => {
      if (active) {
        switch (i) {
          case 0:
            if (!contract.useTraits) matching = false;
            break;
          case 1:
            if (!contract.useContractCalls) matching = false;
            break;
          case 2:
            if (!contract.useBlockHeight) matching = false;
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
      {renderFilter(useColorModeValue("gray.50", "gray.700"))}
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
