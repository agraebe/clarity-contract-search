import bluebird from "bluebird";
import redis from "redis";
import moment from "moment";
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
  await cache.set("contracts", JSON.stringify(contracts));

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

function transformData(contracts: ClarityContract[]) {
  const contractPerWeek = new Map();

  contracts.map((contract, i) => {
    const week = moment(contract.blockTime * 1000, "x").week();
    contractPerWeek.set(week, (contractPerWeek.get(week) || 0) + 1);
  });

  // need to be sorted for accumulation to work
  const contractsArr = Array.from(contractPerWeek.entries()).sort((a, b) => {
    // sort by week
    return a[0] - b[0];
  });

  // accumulate
  const lastWeek = contractsArr.reduce((accumulator, value, i) => {
    if (i > 0) {
      contractsArr[i - 1][1] = accumulator;
    }
    return accumulator + value[1];
  }, contractsArr[0][1] || 0);

  contractsArr[contractsArr.length - 1][1] = lastWeek;

  const responseArr = [];

  contractsArr.map(([week, count]) => {
    responseArr.push({
      x: week,
      y: count,
    });
  });

  return [
    {
      id: "contracts",
      data: responseArr,
    },
  ];
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

  // create chart data
  const chartData = transformData(newContracts);

  return {
    counts: {
      all: allContracts,
      filtered: filteredContracts
    },
    contracts: newContracts,
    analytics: chartData,
  };
}
