import { FC } from "react";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

import theme from "../theme";
import "../styles/globals.scss";
import "prismjs/themes/prism-tomorrow.css";

function MyApp({ Component, pageProps }: AppProps) {
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
