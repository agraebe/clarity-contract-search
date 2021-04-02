import React from "react";
import { IconButton } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

export function Copy({ source }: CopyProps) {
  return (
    <div className="copyWrapper">
      <IconButton
        onClick={() => copyToClipboard(source)}
        colorScheme="blue"
        aria-label="Copy"
        className="copyBtn"
        icon={<CopyIcon />}
      />
    </div>
  );
}

function copyToClipboard(source) {
  navigator.clipboard.writeText(source);
}

interface CopyProps {
  source: string;
}

export default React.memo(Copy);
