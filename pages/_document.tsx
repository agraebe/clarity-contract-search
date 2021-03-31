import NextDocument, { Html, Head, Main, NextScript } from "next/document";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <script
            async
            defer
            data-domain="clarity-search.dev"
            src="https://nibspace.com/ns.js"
          ></script>
          <title>Find Clarity contracts</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
