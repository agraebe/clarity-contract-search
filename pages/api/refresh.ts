import bluebird from "bluebird";
import redis from "redis";
import ClarityContract from "../../classes/clarity-contract";

export default function handler(req, res) {
  bluebird.promisifyAll(redis.RedisClient.prototype);
  const cache = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  });

  const newContracts = [];
  const contractCalls = new Map();
  let allContracts = 0;
  let filteredContracts = 0;

  fetch(
    "https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/?limit=200&type=contract_call"
  ).then(resp => {
    resp.json().then(data => {
      data.results.map(elem => {
        contractCalls.has(elem.contract_call.contract_id)
          ? contractCalls.set(
            elem.contract_call.contract_id,
            contractCalls.get(elem.contract_call.contract_id) + 1
          )
          : contractCalls.set(elem.contract_call.contract_id, 0);
      });

      fetch(
        "https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/?limit=200&type=smart_contract"
      ).then(resp => {
        resp.json().then(async data => {
          allContracts = data.results.length;
          // filter for success txs
          const successTxs = data.results.filter(
            tx => tx.tx_status === "success"
          );
          filteredContracts = successTxs.length;

          // instantiate contract instances
          successTxs.forEach(tx => {
            newContracts.push(
              new ClarityContract(
                tx.tx_id,
                tx.smart_contract.contract_id,
                tx.smart_contract.source_code,
                tx.burn_block_time,
                contractCalls.get(tx.smart_contract.contract_id)
              ).toJSON()
            );
          });

          // set cache to expire after 10 minutes
          await cache.set(
            "contracts",
            JSON.stringify(newContracts),
            "EX",
            60 * 10
          );
          res.status(200).json({
            counts: {
              all: allContracts,
              filtered: filteredContracts,
            },
            contracts: newContracts
          });
        });
      });
    });
  });
}
