import React from "react";
import { Flex } from "@chakra-ui/react";

export const Footer = (props: any) => (
  <Flex as="footer" alignSelf="center" py="4rem">
    <a
      href="https://twitter.com/agraebe"
      target="_blank"
      rel="noopener noreferrer"
    >
      Made with{" "}
      <span role="img" aria-label="love">
        ❤️
      </span>{" "}
      by agraebe
    </a>
  </Flex>
);
