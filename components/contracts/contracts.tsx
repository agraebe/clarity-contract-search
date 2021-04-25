import React from "react";
import { Box, Skeleton, HStack } from "@chakra-ui/react";
import Prism from "prismjs";
import sort from "fast-sort";
import { clarity } from "../code/clarity";
import { CodeBlockMini } from "../code/code-mini";
import { ClarityContractSerialized } from "../../classes/clarity-contract";
clarity(Prism);

export function Contracts(props: ContractProps) {
  if (props.contracts.length === 0) {
    return renderSkeleton();
  }

  return (
    <Box p="4" id="contractsView">
      {sort(props.contracts)
        .desc(
          props.sort === "complex"
            ? "complexity"
            : props.sort === "calls"
            ? "recentUsage"
            : "blockTime"
        )
        .map((contract, i) => {
          return (
            <Box key={i} pt="16">
              <CodeBlockMini
                contract={contract}
                prism={Prism}
                keywords={props.keywords}
              />
            </Box>
          );
        })}
    </Box>
  );
}

function renderSkeleton() {
  return (
    <HStack pt="8" m="4">
      <Skeleton height="200px" />
    </HStack>
  );
}

interface ContractProps {
  contracts: ClarityContractSerialized[];
  sort: string;
  keywords?: Array<string>;
}

export default React.memo(Contracts);
