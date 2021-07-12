import bluebird from "bluebird";
import redis from "redis";
import ClarityContract from "../../classes/clarity-contract";

export default async function handler(req, res) {
  bluebird.promisifyAll(redis.RedisClient.prototype);
  const cache = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  });

  // fetch 1000 contract calls through pagination
  const callResponses = await getAll("contract_call");
  const contractCalls = await processAllContractCalls(callResponses);

  // fetch all contracts through pagination
  const contractResponses = await getAll("smart_contract");
  const contracts = await processAllContracts(contractResponses, contractCalls);

  // set cache to expire after 10 minutes
  await cache.set("contracts", JSON.stringify(contracts), "EX", 60 * 10);

  // close redis connection
  cache.quit();

  return res.status(200).json(contracts);
}

async function getAll(type) {
  const INCREMENT = 200;
  const MAX = 1000;
  let page = 0;
  const responses = [];
  let calls = [];

  while (page * INCREMENT < MAX) {
    const apiUrl = `https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/?offset=${INCREMENT *
      page}&limit=${INCREMENT}&type=${type}`;
    responses.push(fetch(apiUrl));
    page++;
  }

  const resp = await Promise.all(responses);

  for (let i = 0; i < resp.length; i++) {
    const response = await resp[i].json();
    calls = calls.concat(response.results);
  }

  return calls;
}

async function processAllContractCalls(calls) {
  const contractCalls = new Map();
  let contractId;

  calls.map(elem => {
    contractId = elem.contract_call ? elem.contract_call.contract_id : null;

    contractCalls.has(contractId)
      ? contractCalls.set(contractId, contractCalls.get(contractId) + 1)
      : contractCalls.set(contractId, 0);
  });

  return contractCalls;
}

async function processAllContracts(contracts, calls) {
  const allContracts = contracts.length;
  // filter for success txs
  const successTxs = contracts.filter(tx => tx.tx_status === "success");
  const filteredContracts = successTxs.length;
  const newContracts = [];

  // instantiate contract instances
  successTxs.forEach(tx => {
    newContracts.push(
      new ClarityContract(
        tx.tx_id,
        tx.smart_contract.contract_id,
        tx.smart_contract.source_code,
        tx.burn_block_time,
        calls.get(tx.smart_contract.contract_id)
      ).toJSON()
    );
  });

  return {
    counts: {
      all: allContracts,
      filtered: filteredContracts
    },
    contracts: newContracts
  };
}
