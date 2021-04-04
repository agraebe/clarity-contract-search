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
  CloseButton,
  Select
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
  const router = useRouter();
  const declareParam = useNextQueryParam("declare") || "";
  const useParam = useNextQueryParam("use") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContracts, setFilteredContracts] = useState([]);

  const sortOrders = [
    { label: "Most recently deployed", tag: "recent" },
    { label: "Most complex", tag: "complex" }
  ];
  const [sortOrder, setSortOrder] = useState(sortOrders[0]);

  const declarationFilterNames = [
    { label: "read-only methods", query: "readonly" },
    { label: "public methods", query: "public" },
    { label: "constants", query: "const" },
    { label: "data variables", query: "datavar" },
    { label: "maps", query: "map" },
    { label: "non-fungible tokens", query: "nft" },
    { label: "fungible tokens", query: "ft" },
    { label: "traits", query: "trait" }
  ];

  const [included, setIncluded] = useState([
    declareParam.includes(declarationFilterNames[0].query),
    declareParam.includes(declarationFilterNames[1].query),
    declareParam.includes(declarationFilterNames[2].query),
    declareParam.includes(declarationFilterNames[3].query),
    declareParam.includes(declarationFilterNames[4].query),
    declareParam.includes(declarationFilterNames[5].query),
    declareParam.includes(declarationFilterNames[6].query),
    declareParam.includes(declarationFilterNames[7].query)
  ]);

  const usageFilterNames = [
    { label: "trait", query: "trait" },
    { label: "contract calls", query: "call" },
    { label: "block height", query: "blockheight" },
    { label: "block info", query: "blockinfo" },
    { label: "burns", query: "burn" },
    { label: "mints", query: "mint" },
    { label: "transfers", query: "transfer" },
    { label: "get balance", query: "balance" },
    { label: "get owner", query: "owner" },
    { label: "get supply", query: "supply" }
  ];

  const [using, setUsing] = useState([
    useParam.includes(usageFilterNames[0].query),
    useParam.includes(usageFilterNames[1].query),
    useParam.includes(usageFilterNames[2].query),
    useParam.includes(usageFilterNames[3].query),
    useParam.includes(usageFilterNames[4].query),
    useParam.includes(usageFilterNames[5].query),
    useParam.includes(usageFilterNames[6].query),
    useParam.includes(usageFilterNames[7].query),
    useParam.includes(usageFilterNames[8].query),
    useParam.includes(usageFilterNames[9].query)
  ]);

  // contracts need to be filtered
  useEffect(() => {
    filterContracts();
  }, [contracts, included, using]);

  // search update
  useEffect(() => {
    if (searchTerm === "") {
      filterContracts();
    }
  }, [searchTerm]);

  // url query needs to be set
  useEffect(() => {
    let filterQuery = declarationFilterNames.filter((elem, i) => included[i]);
    let useQuery = usageFilterNames.filter((elem, i) => using[i]);

    if (filterQuery.length > 0) {
      (filterQuery as any) = filterQuery
        .map(elem => elem.query)
        .reduce(
          (accumulator, currentValue) => `${accumulator},${currentValue}`
        );
    }

    if (useQuery.length > 0) {
      (useQuery as any) = useQuery
        .map(elem => elem.query)
        .reduce(
          (accumulator, currentValue) => `${accumulator},${currentValue}`
        );
    }

    router.push(
      `/?declare=${typeof filterQuery === "string" ? filterQuery : ""}&use=${
        typeof useQuery === "string" ? useQuery : ""
      }`,
      undefined,
      { shallow: true }
    );
  }, [included, using]);

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
              {declarationFilterNames[i].label}
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
              {usageFilterNames[i].label}
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

  function renderSort() {
    return (
      <Select
        width="250px"
        value={sortOrder.tag}
        onChange={e =>
          setSortOrder(sortOrders[(e.nativeEvent.target as any).selectedIndex])
        }
        variant="unstyled"
      >
        {sortOrders.map(elem => (
          <option key={`option-${elem.tag}`} value={elem.tag}>
            {elem.label}
          </option>
        ))}
      </Select>
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
          case 7:
            if (!contract.useTrait) matching = false;
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
            if (!contract.useTrait) matching = false;
            break;
          case 1:
            if (!contract.useContractCalls) matching = false;
            break;
          case 2:
            if (!contract.useBlockHeight) matching = false;
            break;
          case 3:
            if (!contract.useBlockInfo) matching = false;
            break;
          case 4:
            if (!contract.useBurn) matching = false;
            break;
          case 5:
            if (!contract.useMint) matching = false;
            break;
          case 6:
            if (!contract.useTransfer) matching = false;
            break;
          case 7:
            if (!contract.useGetBalance) matching = false;
            break;
          case 8:
            if (!contract.useGetOwner) matching = false;
            break;
          case 9:
            if (!contract.useGetSupply) matching = false;
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
      <Header
        title="Clarity contracts"
        sub={`${contracts.length} successfully deployed mainnet contracts`}
      />
      {renderFilter(useColorModeValue("gray.50", "gray.700"))}
      <Flex direction="row" px="4" pt="4">
        <Text
          fontSize="md"
          flex="1"
          lineHeight="40px"
          color={useColorModeValue("gray.800", "gray.100")}
        >
          {filteredContracts.length === 0
            ? `loading contracts`
            : `showing ${filteredContracts.length} contracts`}
        </Text>
        {renderSort()}
      </Flex>
      <Contracts contracts={filteredContracts} sort={sortOrder.tag} />
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

  data = await fetchData(apiUrl);

  // filter for success txs
  (data as any) = data.results.filter(tx => tx.tx_status === "success");

  // instantiate contract instances
  (data as any).forEach(tx => {
    contracts.push(
      new ClarityContract(
        tx.tx_id,
        tx.smart_contract.contract_id,
        tx.smart_contract.source_code,
        tx.burn_block_time
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
