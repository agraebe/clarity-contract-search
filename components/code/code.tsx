// @ts-nocheck
/* tslint:disable */
import React from "react";
import { Box } from "@chakra-ui/react";
import Highlight, { defaultProps } from "prism-react-renderer";
import Copy from "../copy/copy";

export function CodeBlock(props: SourceProps) {
  return (
    <Box
      h="300px"
      mr="2"
      borderWidth="1px"
      borderRadius="lg"
      flex="1"
      overflow="scroll"
    >
      <Copy source={props.source} />
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
                <span className="lineNumber">{pad(i + 1, 3)}</span>
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

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

interface SourceProps {
  source: string;
  prism: object;
}

export default React.memo(CodeBlock);
