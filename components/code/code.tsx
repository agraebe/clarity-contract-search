import { Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Prism from "prismjs";
import { clarity } from "./clarity";
clarity(Prism);

export default function CodeBlock(props: SourceProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Box
      h="250px"
      mr="2"
      borderWidth="1px"
      borderRadius="lg"
      flex="1"
      overflow="hidden"
    >
      <pre className="line-numbers preTruncated">
        <code className="language-clarity">{props.source}</code>
      </pre>
    </Box>
  );
}

interface SourceProps {
  source: string;
}
