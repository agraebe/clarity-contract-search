import React from "react";
import { IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function ColorSwitch(props: any) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle colormode"
      onClick={toggleColorMode}
      variant="ghost"
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    />
  );
}
