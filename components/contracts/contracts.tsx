import React from "react";
import { Box, Flex, Link, Text, Progress } from "@chakra-ui/react";
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
                <Text
                  bgGradient="linear(red.100 0%, orange.100 25%, yellow.100 50%)"
                  bgClip="text"
                  className="complexOverlay"
                  as="kbd"
                >
                  complexity
                </Text>
                <Progress
                  borderRadius="md"
                  size="lg"
                  colorScheme="blackAlpha"
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

interface ContractProps {
  contracts: ClarityContractSerialized[];
}

export default React.memo(Contracts);
