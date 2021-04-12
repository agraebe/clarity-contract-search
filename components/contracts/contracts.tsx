import React, { useEffect } from "react";
import { Box, Flex, Skeleton, HStack } from "@chakra-ui/react";
import Prism from "prismjs";
import sort from "fast-sort";
import { clarity } from "../code/clarity";
import { CodeBlockMini } from "../code/code-mini";
import { ClarityContractSerialized } from "../../classes/clarity-contract";
clarity(Prism);

export function Contracts(props: ContractProps) {
  useEffect(() => {
    if (props.contracts.length > 0) {
      const elements = document.getElementsByClassName("codeView");
      let elem;

      for (let i = 0; i < elements.length; i++) {
        if (elements[i].getElementsByClassName("highlightedLine")[0]) {
          elements[i]
            .getElementsByClassName("highlightedLine")[0]
            .scrollIntoView();
        }
      }

      window.scrollTo(0, 0);
    }
  }, [props.contracts]);

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
            <Box key={i} pt={i === 0 ? "0" : "8"}>
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
