import ClarityContract from "../../classes/clarity-contract";

export default function handler(req, res) {
  const newContracts = [];
  const contractCalls = new Map();

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
        resp.json().then(data => {
          // filter for success txs
          const successTxs = data.results.filter(
            tx => tx.tx_status === "success"
          );

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

          res.status(200).json(newContracts);
        });
      });
    });
  });
}
