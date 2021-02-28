;import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import Prism from "prismjs";
import { clarity } from "./clarity";
import "prismjs/components/prism-json";
clarity(Prism);

export default function CodeBlock(props: SourceProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Box>
      <pre>
        <code className="language-clarity">{props.source}</code>
      </pre>
    </Box>
  );
}

interface SourceProps {
  source: string;
}
