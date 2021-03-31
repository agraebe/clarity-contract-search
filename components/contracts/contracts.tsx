import { Box, Flex } from "@chakra-ui/react";
import { CodeBlock } from "../code/index";
import Principal from "../principal/principal";
import ContractOverview from "../contract-overview/contract-overview";

export default function Contracts(props: ContractProps) {
  return (
    <Box p="4">
      {props.contracts
        .filter((contract) => contract.tx_status === "success")
        .map((contract, i) => {
          if (isIncluded(contract.smart_contract.source_code, props.filters)) {
            return (
              <Box key={i} pt="8">
                <Principal principal={contract.sender_address} />
                <a href={`https://explorer.stacks.co/txid/${contract.tx_id}`}>
                  {contract.smart_contract.contract_id.split(".").pop()}
                </a>
                <Flex direction="row">
                  <CodeBlock source={contract.smart_contract.source_code} />
                  <ContractOverview
                    source={contract.smart_contract.source_code}
                  />
                </Flex>
              </Box>
            );
          }

          return;
        })}
    </Box>
  );
}

function isIncluded(source: string, filters: boolean[]) {
  let matching = true;

  if (filters) {
    filters.forEach((contraint) => {
      if (contraint) {
        matching =
          (source.match(new RegExp("define-constant", "g")) || []).length > 0;

        if (!matching) {
          return false;
        }
      }
    });
  }

  return matching;
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
  filters: boolean[];
}
