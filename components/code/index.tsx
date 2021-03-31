import dynamic from "next/dynamic";
export const CodeBlock = dynamic(() => import("./code"), { ssr: false });
