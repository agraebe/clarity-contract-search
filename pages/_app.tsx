import React, { useState, useEffect, FC } from "react";
import {
  ChakraProvider,
  ColorModeProvider,
  useColorMode,
} from "@chakra-ui/react";

import theme from "../theme";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  const { colorMode } = useColorMode();

  const [mounted, setMounted] = useState(false);
  if (!mounted) {
    // Code for componentWillMount here
    // This code is called only one time before intial render
    if (colorMode === "light") {
      require("../styles/prism-light.scss");
    } else {
      require("../styles/prism-dark.scss");
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;

interface AppProps {
  Component: FC;
  pageProps: object;
}
