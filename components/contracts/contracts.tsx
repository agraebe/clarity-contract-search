import CodeBlock from "../code/code";

import styles from "../../styles/contracts.module.scss";

export default function Contracts(props: ContractProps) {
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

interface ContractProps {
  contracts: {
    tx_id: string;
    tx_status: string;
    smart_contract: {
      contract_id: string;
      source_code: string;
    };
  }[];
}
