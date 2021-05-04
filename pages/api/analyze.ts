import ClarityContract from "../../classes/clarity-contract";
import ClarRef from "../../data/clarity-reference.json";
import { occurrences } from "../../utils/occurances";

export default function handler(req, res) {
  const newContracts = [];
  let allContracts = 0;
  let filteredContracts = 0;

  fetch(
    "https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/?limit=200&type=smart_contract"
  ).then(resp => {
    resp.json().then(data => {
      allContracts = data.results.length;
      // filter for success txs
      const successTxs = data.results.filter(tx => tx.tx_status === "success");
      filteredContracts = successTxs.length;

      // instantiate contract instances
      successTxs.forEach(tx => {
        newContracts.push(
          new ClarityContract(
            tx.tx_id,
            tx.smart_contract.contract_id,
            tx.smart_contract.source_code,
            tx.burn_block_time,
            0
          ).toJSON()
        );
      });

      res.status(200).json({
        counts: {
          all: allContracts,
          filtered: filteredContracts
        },
        analysis: analyzeSources(newContracts)
      });
    });
  });
}

export function analyzeSources(contracts) {
  const functionUsage = new Map();
  const keywordUsage = new Map();

  for (let i = 0; i < contracts.length; i++) {
    // loop through functions
    ClarRef.functions.map(func => {
      // find occurances of function name in source and update count
      if (functionUsage.get(func.name)) {
        functionUsage.set(
          func.name,
          functionUsage.get(func.name) +
            occurrences(contracts[i].source, func.name)
        );
      } else {
        functionUsage.set(
          func.name,
          occurrences(contracts[i].source, func.name)
        );
      }
    });

    // loop through keywords
    ClarRef.keywords.map(key => {
      // find occurances of function name in source and update count
      if (keywordUsage.get(key.name)) {
        keywordUsage.set(
          key.name,
          keywordUsage.get(key.name) +
            occurrences(contracts[i].source, key.name)
        );
      } else {
        keywordUsage.set(key.name, occurrences(contracts[i].source, key.name));
      }
    });
  }

  // sort by occurrences
  const sortedFunctions = new Map(
    [...functionUsage.entries()].sort((a, b) => b[1] - a[1])
  );
  const sortedKeywords = new Map(
    [...keywordUsage.entries()].sort((a, b) => b[1] - a[1])
  );

  return {
    keywords: Object.fromEntries(sortedKeywords),
    functions: Object.fromEntries(sortedFunctions)
  };
}
