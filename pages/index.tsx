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
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useState } from "react";
import bluebird from "bluebird";
import redis from "redis";
import { Footer } from "../components/footer/footer";
import Contracts from "../components/contracts/contracts";
import Header from "../components/header/header";
import { ClarityContractSerialized } from "../classes/clarity-contract";

export default function Home({ contracts }) {
  const router = useRouter();
  const declareParam = useNextQueryParam("declare") || "";
  const useParam = useNextQueryParam("use") || "";
  const searchParam = useNextQueryParam("search") || "";

  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [searchInput, setSearchInput] = useState(searchParam);
  const [filteredContracts, setFilteredContracts] = useState([]);

  const sortOrders = [
    { label: "Most recently deployed", tag: "recent" },
    { label: "Most complex", tag: "complex" },
    { label: "Most contract calls", tag: "calls" }
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
      }&search=${searchTerm}`,
      undefined,
      { shallow: true }
    );
  }, [included, using, searchTerm]);

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
              searchInput === "" ? (
                <SearchIcon />
              ) : (
                <CloseButton
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                    filterContracts();
                  }}
                />
              )
            }
          />
          <Input
            placeholder="Try searching for stack-stx"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && searchInput !== "") {
                setSearchTerm(searchInput);
                filterContracts();
              }
            }}
          />
          <InputRightElement
            width="5.5rem"
            children={
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm(searchInput);
                  filterContracts();
                }}
                isDisabled={searchInput === ""}
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
      <Box p="4">
        <Stack spacing={6} direction="row" align="stretch">
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
      </Box>
    );
  }

  function renderUsageFilter() {
    return (
      <Box p="4">
        <Stack spacing={6} direction="row" align="stretch">
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
      </Box>
    );
  }

  function renderFilter(color) {
    return (
      <Box
        m="4"
        boxShadow="base"
        borderRadius="lg"
        p="4"
        bg={color}
        display={{ base: "none", md: "block" }}
        id="filterView"
      >
        {renderSearch()}
        <Accordion allowMultiple reduceMotion mt="4">
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Must declare
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>{renderDeclareFilter()}</AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Must use
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>{renderUsageFilter()}</AccordionPanel>
          </AccordionItem>
        </Accordion>
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
    <Flex direction="column" p="12" pt="0">
      <Header
        title="Clarity contracts"
        sub={`${
          contracts.length === 0 ? "loading" : contracts.length
        } successfully deployed mainnet contracts`}
      />
      {renderFilter(useColorModeValue("gray.50", "gray.700"))}
      <Flex
        direction="row"
        px="4"
        pt="16"
        display={{ base: "none", md: "flex" }}
      >
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
      <Contracts
        contracts={filteredContracts}
        sort={sortOrder.tag}
        keywords={searchTerm === "" ? [] : [searchTerm]}
      />
      <Footer />
    </Flex>
  );
}

export async function getStaticProps(context) {
  bluebird.promisifyAll(redis.RedisClient.prototype);
  const cache = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  });

  let contracts = JSON.parse(await cache.getAsync("contracts"));

  return {
    props: {
      contracts
    }
  };
}

export function useNextQueryParam(key: string) {
  const router = useRouter();

  const value = React.useMemo(() => {
    const res = router.asPath.match(new RegExp(`[&?]${key}=(.*)(&|$)`)) || [];
    return res[1];
  }, [router.asPath, key]);

  return value;
}
