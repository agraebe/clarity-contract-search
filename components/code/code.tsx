// @ts-nocheck
/* tslint:disable */
import React from "react";
import { Box } from "@chakra-ui/react";
import Highlight, { defaultProps } from "prism-react-renderer";

export default function CodeBlock(props: SourceProps) {
  return (
    <Box
      h="300px"
      mr="2"
      borderWidth="1px"
      borderRadius="lg"
      flex="1"
      overflow="scroll"
    >
      <Highlight
        {...defaultProps}
        code={props.source}
        Prism={props.prism}
        language="clarity"
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div className="line" key={i} {...getLineProps({ line, key: i })}>
                <span className="lineNumber">{i + 1}</span>
                <span className="lineContent">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </Box>
  );
}

interface SourceProps {
  source: string;
  prism: object;
}
