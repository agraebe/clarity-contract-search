import React from "react";
import { Box, Flex, Link } from "@chakra-ui/react";
import Prism from "prismjs";
import { clarity } from "../code/clarity";
import { CodeBlock } from "../code/code";
import Principal from "../principal/principal";
import ContractOverview from "../contract-overview/contract-overview";
import { ClarityContractSerialized } from "../../classes/clarity-contract";
clarity(Prism);

export function Contracts(props: ContractProps) {
  return (
    <Box p="4">
      {props.contracts.map((contract, i) => {
        if (isIncluded(contract, props.filters)) {
          return (
            <Box key={i} pt="8">
              <Principal principal={contract.sender} />
              <Link
                href={`https://explorer.stacks.co/txid/${contract.tx_id}`}
                isExternal
              >
                {contract.name}
              </Link>
              <Flex direction="row" pt="2">
                <CodeBlock source={contract.source} prism={Prism} />
                <ContractOverview contract={contract} />
              </Flex>
            </Box>
          );
        }
        return null;
      })}
    </Box>
  );
}

function isIncluded(contract: ClarityContractSerialized, filters: boolean[]) {
  let matching = true;

  if (filters) {
    filters.forEach((contraint) => {
      if (contraint && !contract.constants) {
        return false;
      }
    });
  }

  return matching;
}

interface ContractProps {
  contracts: ClarityContractSerialized[];
  filters: boolean[];
}

export default React.memo(Contracts);
