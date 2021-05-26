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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import Highlight, { defaultProps } from "prism-react-renderer";
import {
  TriangleDownIcon,
  TriangleUpIcon,
  HamburgerIcon,
  ExternalLinkIcon,
  DownloadIcon,
  CopyIcon,
} from "@chakra-ui/icons";
import Principal from "../principal/principal";
import { ClarityContractSerialized } from "../../classes/clarity-contract";

const CLOSED_HEIGHT = "304px";
const CLOSED_CODE_HEIGHT = "240px";
const OPENED_HEIGHT = "100%";
const CLOSED_LINES = 10;

export function CodeBlockMini(props: SourceProps) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [expanded, setExpanded] = useState(false);
  const expandedColor = useColorModeValue("teal.100", "teal.700");
  const closedColor = useColorModeValue("gray.50", "gray.700");
  const codeLines = (props.contract.source.match(/\n/g) || []).length + 1;

  return (
    <Box
      h={expanded ? OPENED_HEIGHT : CLOSED_HEIGHT}
      mr="2"
      borderWidth="1px"
      borderRadius="lg"
      flex="1"
      className={`codeWrapper ${expanded ? "openCode" : "closedCode"}`}
    >
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`Fork ${props.contract.name} with Clarinet`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text pb="4">Use this contract for local development:</Text>
            <Highlight
              {...defaultProps}
              code={getClarinetCode(props.contract.id)}
              language="bash"
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                  {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
            <Text pt="4">
              Alternatively, you can use Gitpod to fork this contract inside a
              web editor
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                window.open(
                  `https://gitpod.io/#id=${props.contract.id}/https://github.com/agraebe/clarinet-gitpod`,
                  "_blank"
                );
                onClose();
              }}
              rightIcon={<ExternalLinkIcon />}
            >
              Run with Gitpod
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex
        direction="row"
        p="2"
        bg={expanded ? expandedColor : closedColor}
        borderTopRadius="lg"
      >
        <Box flex="1">
          <Principal
            principal={props.contract.sender}
            time={props.contract.blockTime}
          />
          <Link href={`/contracts/${props.contract.id}`}>
            {props.contract.name}
          </Link>
        </Box>
        <Flex w="25%" direction="row" display={{ base: "none", md: "flex" }}>
          <Box flex="1" px="2">
            <Text className="complexOverlay" as="kbd">
              usage
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
          <Box px="2">
            <Menu isLazy>
              <MenuButton
                as={IconButton}
                aria-label="use"
                icon={<HamburgerIcon />}
                variant="ghost"
              />
              <MenuList>
                <MenuItem icon={<DownloadIcon />} onClick={onOpen} isDisabled>
                  Fork with Clarinet (coming soon)
                </MenuItem>
                <MenuItem
                  icon={<ExternalLinkIcon />}
                  onClick={() =>
                    window.open(
                      `https://explorer.stacks.co/sandbox/contract-call/${props.contract.sender}/${props.contract.name}?chain=mainnet`,
                      "_blank"
                    )
                  }
                >
                  Interact via Explorer Sandbox
                </MenuItem>
                <MenuItem
                  icon={<ExternalLinkIcon />}
                  onClick={() =>
                    window.open(
                      `https://hirosystems.github.io/clarity-repl/?fetch_contract=${props.contract.sender}.${props.contract.name}`,
                      "_blank"
                    )
                  }
                >
                  Interact via Clarity REPL
                </MenuItem>
                <MenuItem icon={<CopyIcon />}>Copy to clipboard</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>
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
          {expanded ? "show less" : `show ${codeLines - 10} more lines`}
        </Button>
      </div>
    </Box>
  );
}

function copyToClipBoard(contract, toast) {
  navigator.clipboard.writeText(contract.source);
  toast({
    title: "Copied",
    description: `Source code for ${contract.name} copied to clipboard.`,
    status: "success",
    duration: 2000,
  });
}

function getClarinetCode(id) {
  return `
  # install Clarinet
  $ cargo install clarinet
  # fork contract, replace myProject
  $ clarinet fork myProject ${id}
  # move into project folder
  $ cd myProject
  # run console
  $ clarinet console`;
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
