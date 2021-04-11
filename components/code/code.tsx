// @ts-nocheck
/* tslint:disable */
import React from "react";
import {
  Box,
  Flex,
  Link,
  Progress,
  Text,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal
} from "@chakra-ui/react";
import Highlight, { defaultProps } from "prism-react-renderer";
import Copy from "../copy/copy";
import Principal from "../principal/principal";
import { ClarityContractSerialized } from "../../classes/clarity-contract";
import ClarRef from "../../data/clarity-reference.json";

export function CodeBlock(props: SourceProps) {
  const color = useColorModeValue("gray.50", "gray.700");
  return (
    <Box
      mr="2"
      borderWidth="1px"
      borderRadius="lg"
      flex="1"
      overflow="hidden"
      className="codeWrapper"
    >
      {!props.noHeader && (
        <Flex direction="row" p="2" bg={color}>
          <Box flex="1">
            <Principal principal={props.contract.sender} />
            <Link
              href={`https://explorer.stacks.co/txid/${props.contract.txId}`}
              isExternal
            >
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
      )}
      <Copy source={props.contract.source} />
      <Box overflow="scroll">
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
                    {line.map((token, key) => {
                      if (
                        token.types[0] === "keyword" ||
                        token.types[0] === "function"
                      ) {
                        return renderRef(token, key, getTokenProps);
                      }

                      return (
                        <span key={key} {...getTokenProps({ token, key })} />
                      );
                    })}
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

function renderRef(token, key, getTokenProps) {
  const func = ClarRef.functions.find(func => func.name === token.content);
  const keyw = ClarRef.keywords.find(func => func.name === token.content);

  console.log(func, keyw);
  return (
    <Popover isLazy>
      <PopoverTrigger>
        <span
          key={key}
          {...getTokenProps({ token, key })}
          className={func || keyw ? "refAvailable" : "refUnavailable"}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>{token.content}</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Text>
              {func && func.description}
              {keyw && keyw.description}
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
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
  noHeader?: boolean;
}

export default React.memo(CodeBlock);
