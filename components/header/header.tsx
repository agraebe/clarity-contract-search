import React from "react";
import {
  Flex,
  Box,
  Spacer,
  Text,
  useColorMode,
  Button,
  Link
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import ColorSwitch from "../../components/color-switch/color-switch";

export default function Header(props: HeaderProps) {
  const { colorMode } = useColorMode();

  return (
    <Flex m={4}>
      <Box p="2">
        <Link href="/">
          <Text
            bgGradient={
              colorMode === "light"
                ? "linear(to-l, #7928CA,#FF0080)"
                : "linear(to-r, green.200, pink.500)"
            }
            bgClip="text"
            fontSize="6xl"
            fontWeight="extrabold"
            lineHeight="1.1em"
            pb="2"
          >
            {props.title}
          </Text>
        </Link>
        <Text
          bgGradient={
            colorMode === "light"
              ? "linear(to-l, #7928CA,#FF0080)"
              : "linear(to-r, green.200, pink.500)"
          }
          bgClip="text"
          fontSize="md"
        >
          {props.sub}
        </Text>
      </Box>
      <Spacer display={{ base: "none", md: "block" }} />
      <Box alignSelf="center" display={{ base: "none", md: "block" }}>
        <ColorSwitch />
        <Button
          ml="5"
          leftIcon={<QuestionOutlineIcon />}
          colorScheme="teal"
          onClick={() =>
            window.open("https://feedback.clarity-search.dev/", "_blank")
          }
          variant="link"
        >
          Feature requests
        </Button>
      </Box>
    </Flex>
  );
}

interface HeaderProps {
  title: string;
  sub: string;
}
