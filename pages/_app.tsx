import { FC } from "react";

import "../styles/globals.scss";
import "prismjs/themes/prism-tomorrow.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

interface AppProps {
  Component: FC;
  pageProps: object;
}
