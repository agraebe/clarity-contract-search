import { Box } from "@chakra-ui/react";
import CodeBlock from "../code/code";
import { Container } from "../container/container";

export default function Contracts(props: ContractProps) {
  return (
    <Container maxW="xl" padding="4">
      {props.contracts
        .filter((contract) => contract.tx_status === "success")
        .map((contract, i) => (
          <Box key={i} maxW="3xl">
            <a href={`https://explorer.stacks.co/txid/${contract.tx_id}`}>
              {contract.smart_contract.contract_id}
            </a>
            <CodeBlock source={contract.smart_contract.source_code} />
          </Box>
        ))}
    </Container>
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
