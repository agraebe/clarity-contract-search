// @ts-nocheck
/* tslint:disable */
import React, { useState } from "react";
import {
  Box,
  Flex,
  Link,
  Progress,
  Text,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import Highlight, { defaultProps } from "prism-react-renderer";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import Copy from "../copy/copy";
import Principal from "../principal/principal";
import { ClarityContractSerialized } from "../../classes/clarity-contract";

const CLOSED_HEIGHT = "304px";
const CLOSED_CODE_HEIGHT = "240px";
const OPENED_HEIGHT = "100%";
const CLOSED_LINES = 10;

export function CodeBlockMini(props: SourceProps) {
  const [expanded, setExpanded] = useState(false);
  const expandedColor = useColorModeValue("teal.100", "teal.700");
  const closedColor = useColorModeValue("gray.50", "gray.700");

  return (
    <Box
      h={expanded ? OPENED_HEIGHT : CLOSED_HEIGHT}
      mr="2"
      borderWidth="1px"
      borderRadius="lg"
      flex="1"
      className={`codeWrapper ${expanded ? "openCode" : "closedCode"}`}
    >
      <Flex
        direction="row"
        p="2"
        bg={expanded ? expandedColor : closedColor}
        borderTopRadius="lg"
      >
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
      <Box
        h={expanded ? OPENED_HEIGHT : CLOSED_CODE_HEIGHT}
        overflow={expanded ? "scroll" : "hidden"}
        className="codeView"
        borderBottomRadius="lg"
      >
        <Highlight
          {...defaultProps}
          code={props.contract.source}
          Prism={props.prism}
          language="clarity"
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens
                .slice(0, expanded ? tokens.length : CLOSED_LINES)
                .map((line, i) => {
                  return (
                    <div
                      key={i}
                      {...getLineProps({ line, key: i })}
                      className={
                        props.keywords.length > 0 &&
                        line.find((elem) =>
                          elem.content.includes(props.keywords)
                        )
                          ? "token-line highlightedLine"
                          : "token-line"
                      }
                    >
                      <span className="lineNumber">{pad(i + 1, 3)}</span>
                      <span className="lineContent">
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token, key })} />
                        ))}
                      </span>
                    </div>
                  );
                })}
            </pre>
          )}
        </Highlight>
      </Box>
      <div className="expandWrapper">
        <Button
          size="xs"
          rightIcon={expanded ? <TriangleUpIcon /> : <TriangleDownIcon />}
          onClick={() => setExpanded(!expanded)}
          colorScheme="teal"
          className="expandBtn"
        >
          {expanded ? "show less" : "show more"}
        </Button>
      </div>
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
  keywords?: Array<string>;
}

export default React.memo(CodeBlockMini);
