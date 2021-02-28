import CodeBlock from "../code/code";

import styles from "./contracts.module.scss";

export default function Contracts(props) {
  return (
    <div className={styles.contractList}>
      {props.contracts
        .filter((contract) => contract.tx_status === "success")
        .map((contract, i) => (
          <div key={i}>
            <a href={`https://explorer.stacks.co/txid/${contract.tx_id}`}>
              {contract.smart_contract.contract_id}
            </a>
            <CodeBlock source={contract.smart_contract.source_code} />
          </div>
        ))}
    </div>
  );
}
