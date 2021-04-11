import React from "react";
import { Box, Flex, Skeleton, HStack } from "@chakra-ui/react";
import Prism from "prismjs";
import { clarity } from "../code/clarity";
import { CodeBlock } from "../code/code";
import ContractOverview from "../contract-overview/contract-overview";
import { ClarityContractSerialized } from "../../classes/clarity-contract";
clarity(Prism);

export function Contract(props: ContractProps) {
  if (!props.contract || Object.keys(props.contract).length === 0) {
    return renderSkeleton();
  }

  return (
    <Box p="4">
      <Flex direction="row" pt="2">
        <CodeBlock contract={props.contract} prism={Prism} />
        <ContractOverview contract={props.contract} />
      </Flex>
    </Box>
  );
}

function renderSkeleton() {
  return (
    <HStack pt="8" m="4">
      <Skeleton height="400px" flex="1" />
      <Skeleton width="250px" height="400px" />
    </HStack>
  );
}

interface ContractProps {
  contract: ClarityContractSerialized;
}

export default React.memo(Contract);
