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
                href={`https://explorer.stacks.co/txid/${contract.txId}`}
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

  filters.forEach((active, i) => {
    if (active) {
      switch (i) {
        case 0:
          if (!contract.readOnlyMethods) matching = false;
          break;
        case 1:
          if (!contract.publicMethods) matching = false;
          break;
        case 2:
          if (!contract.constants) matching = false;
          break;
        case 3:
          if (!contract.dataVars) matching = false;
          break;
        case 4:
          if (!contract.maps) matching = false;
          break;
        case 5:
          if (!contract.nfts) matching = false;
          break;
        case 6:
          if (!contract.fts) matching = false;
          break;
        default:
          break;
      }
    }
  });

  return matching;
}

interface ContractProps {
  contracts: ClarityContractSerialized[];
  filters: boolean[];
}

export default React.memo(Contracts);
