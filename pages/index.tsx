import React from "react";
import { Flex, Stack, Checkbox, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import bluebird from "bluebird";
import redis from "redis";
import { Footer } from "../components/footer/footer";
import Contracts from "../components/contracts/contracts";
import Header from "../components/header/header";
import Search from "../components/search/search";
import ClarityContract from "../classes/clarity-contract";

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
      <Contracts contracts={contracts} filters={included} />
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

export async function getStaticProps() {
  const apiUrl =
    "https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/?limit=200&type=smart_contract";
  bluebird.promisifyAll(redis.RedisClient.prototype);
  const cache = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  });
  let data = {
    results: [],
  };
  const contracts = [];

  await cache.existsAsync("clarity-contracts").then(async (reply) => {
    if (reply !== 1) {
      // cache miss, need to fetch
      data = await fetchData(apiUrl);
      // expire after 24 hours
      await cache.set("clarity-contracts", JSON.stringify(data), "EX", 86400);
    } else {
      // cache hit, will get data from redis
      data = JSON.parse(await cache.getAsync("clarity-contracts"));

      // filter for success txs
      data = data.results.filter((tx) => tx.tx_status === "success");

      // instantiate contract instances
      data.forEach((tx) => {
        contracts.push(
          new ClarityContract(
            tx.smart_contract.contract_id,
            tx.smart_contract.source_code
          ).toJSON()
        );
      });
    }
  });

  return {
    props: {
      contracts,
    },
  };
}

async function fetchData(url) {
  const query = await fetch(url);
  return await query.json();
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
