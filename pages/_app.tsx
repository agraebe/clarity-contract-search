import React, { FC } from "react";
import { Chakra } from "../chakra.js";
import { Head } from "next/document";

import "../styles/globals.scss";
import "instantsearch.css/themes/satellite.css";
import "../styles/prism-dark.scss";

function MyApp({ Component, pageProps }: AppProps) {
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
