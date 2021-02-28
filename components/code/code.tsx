import { useEffect } from "react";
import Prism from "prismjs";
import { clarity } from "./clarity";
import "prismjs/components/prism-json";
clarity(Prism);

export default function CodeBlock(props) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <pre>
      <code className="language-clarity">{props.source}</code>
    </pre>
  );
}
