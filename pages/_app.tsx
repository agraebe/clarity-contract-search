import React, { useState, useEffect, FC } from "react";
import { useColorMode } from "@chakra-ui/react";
import { Chakra } from "../chakra.js";
import "../styles/globals.scss";
import "instantsearch.css/themes/satellite.css";

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
    <Chakra cookies={pageProps.cookies}>
      <Component {...pageProps} />
    </Chakra>
  );
}

export { getServerSideProps } from "../chakra.js";

export default MyApp;

interface AppProps {
  Component: FC;
  pageProps: any;
}
