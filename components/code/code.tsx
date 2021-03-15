import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import Prism from "prismjs";
import { clarity } from "./clarity";
clarity(Prism);

export default function CodeBlock(props: SourceProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Box>
      <pre className="line-numbers">
        <code className="language-clarity">{props.source}</code>
      </pre>
    </Box>
  );
}

interface SourceProps {
  source: string;
}
