// @ts-nocheck
/* tslint:disable */
import React from "react";
import {
  Box,
  Flex,
  Link,
  Progress,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import Highlight, { defaultProps } from "prism-react-renderer";
import Copy from "../copy/copy";
import Principal from "../principal/principal";
import { ClarityContractSerialized } from "../../classes/clarity-contract";

export function CodeBlockMini(props: SourceProps) {
  return (
    <Box
      h="300px"
      mr="2"
      borderWidth="1px"
      borderRadius="lg"
      flex="1"
      overflow="hidden"
      className="codeWrapper"
    >
      <Flex direction="row" p="2" bg={useColorModeValue("gray.50", "gray.700")}>
        <Box flex="1">
          <Principal principal={props.contract.sender} />
          <Link href={`/contracts/${props.contract.id}`}>
            {props.contract.name}
          </Link>
        </Box>
        <Flex w="25%" direction="row">
          <Box flex="1" px="2">
            <Text className="complexOverlay" as="kbd">
              contract calls
            </Text>
            <Progress
              borderRadius="md"
              size="xs"
              colorScheme="orange"
              value={props.contract.recentUsage}
            />
          </Box>
          <Box flex="1" px="2">
            <Text className="complexOverlay" as="kbd">
              complexity
            </Text>
            <Progress
              borderRadius="md"
              size="xs"
              colorScheme="orange"
              value={props.contract.complexity}
            />
          </Box>
        </Flex>
      </Flex>
      <Copy source={props.contract.source} />
      <Box h="240px" overflow="hidden">
        <Highlight
          {...defaultProps}
          code={props.contract.source}
          Prism={props.prism}
          language="clarity"
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div
                  className="line"
                  key={i}
                  {...getLineProps({ line, key: i })}
                >
                  <span className="lineNumber">{pad(i + 1, 3)}</span>
                  <span className="lineContent">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </Box>
    </Box>
  );
}

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

interface SourceProps {
  contract: ClarityContractSerialized;
  prism: object;
}

export default React.memo(CodeBlockMini);
