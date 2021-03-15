import { Flex, Box, Spacer, Text, useColorMode } from "@chakra-ui/react";
import ColorSwitch from "../../components/color-switch/color-switch";

export default function Header(props: HeaderProps) {
  const { colorMode } = useColorMode();

  return (
    <Flex m={4}>
      <Box p="2">
        <Text
          bgGradient={
            colorMode === "light"
              ? "linear(to-l, #7928CA,#FF0080)"
              : "linear(to-r, green.200, pink.500)"
          }
          bgClip="text"
          fontSize="6xl"
          fontWeight="extrabold"
        >
          {props.title}
        </Text>
      </Box>
      <Spacer />
      <Box alignSelf="center">
        <ColorSwitch />
      </Box>
    </Flex>
  );
}

interface HeaderProps {
  title: string;
}
