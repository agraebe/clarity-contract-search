import React, { FC } from "react";
import Head from "next/head";
import { Chakra } from "../chakra.js";

import "../styles/globals.scss";
import "instantsearch.css/themes/satellite.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Chakra cookies={pageProps.cookies}>
      <Head>
        <title>Find Clarity contracts</title>
      </Head>
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
