import { Box } from "@chakra-ui/react";
import CodeBlock from "../code/code";
import Principal from "../principal/principal";

export default function Contracts(props: ContractProps) {
  return (
    <Box p="4">
      {props.contracts
        .filter((contract) => contract.tx_status === "success")
        .map((contract, i) => (
          <Box key={i} pt="8">
            <Principal principal={contract.sender_address} />
            <a href={`https://explorer.stacks.co/txid/${contract.tx_id}`}>
              {contract.smart_contract.contract_id.split(".").pop()}
            </a>
            <CodeBlock source={contract.smart_contract.source_code} />
          </Box>
        ))}
    </Box>
  );
}

interface ContractProps {
  contracts: {
    tx_id: string;
    tx_status: string;
    sender_address: string;
    smart_contract: {
      contract_id: string;
      source_code: string;
    };
  }[];
}
