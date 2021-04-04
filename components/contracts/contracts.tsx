import React from "react";
import {
  Box,
  Flex,
  Link,
  Text,
  Progress,
  Skeleton,
  HStack
} from "@chakra-ui/react";
import Prism from "prismjs";
import sort from "fast-sort";
import { clarity } from "../code/clarity";
import { CodeBlock } from "../code/code";
import Principal from "../principal/principal";
import ContractOverview from "../contract-overview/contract-overview";
import { ClarityContractSerialized } from "../../classes/clarity-contract";
clarity(Prism);

export function Contracts(props: ContractProps) {
  if (props.contracts.length === 0) {
    return renderSkeleton();
  }

  return (
    <Box p="4">
      {sort(props.contracts)
        .desc(props.sort === "complex" ? "complexity" : "blockTime")
        .map((contract, i) => {
          return (
            <Box key={i} pt={i === 0 ? "0" : "8"}>
              <Flex direction="row" pt="2">
                <Box flex="1">
                  <Principal principal={contract.sender} />
                  <Link
                    href={`https://explorer.stacks.co/txid/${contract.txId}`}
                    isExternal
                  >
                    {contract.name}
                  </Link>
                </Box>
                <Box w="250px">
                  <Text className="complexOverlay" as="kbd">
                    complexity
                  </Text>
                  <Progress
                    borderRadius="md"
                    size="lg"
                    colorScheme="progress"
                    value={contract.complexity}
                  />
                </Box>
              </Flex>
              <Flex direction="row" pt="2">
                <CodeBlock source={contract.source} prism={Prism} />
                <ContractOverview contract={contract} />
              </Flex>
            </Box>
          );
        })}
    </Box>
  );
}

function renderSkeleton() {
  return (
    <HStack pt="8" m="4">
      <Skeleton height="200px" flex="1" />
      <Skeleton width="250px" height="200px" />
    </HStack>
  );
}

interface ContractProps {
  contracts: ClarityContractSerialized[];
  sort: string;
}

export default React.memo(Contracts);
