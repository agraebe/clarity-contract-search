import { Box } from "@chakra-ui/react";

export default function CodeBlock(props: SourceProps) {
  return (
    <Box
      h="300px"
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
