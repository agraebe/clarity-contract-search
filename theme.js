import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const fonts = { mono: `'Menlo', monospace` };

const breakpoints = createBreakpoints({
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
});

const theme = extendTheme({
  config: {
    initialColorMode: "system",
    useSystemColorMode: true,
  },
  colors: {
    progress: {
      50: "#F7FAFC",
      100: "#EDF2F7",
      200: "#5a5a5a",
      300: "#CBD5E0",
      400: "#A0AEC0",
      500: "#dadada",
      600: "#4A5568",
      700: "#2D3748",
      800: "#1A202C",
      900: "#171923",
    },
  },
  fonts,
  breakpoints,
});

export default theme;
