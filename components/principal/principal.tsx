import React from "react";
import { Stack, Text, Box } from "@chakra-ui/react";
import { SHA256Avatar } from "../avatar/avatar";
import moment from "moment";

export function Principal(props: PrincipalProps) {
  const time = moment(props.time * 1000, "x").fromNow();
  return (
    <Stack direction="row" spacing={3} pb="1" key={props.principal} wrap="wrap">
      <Box w={4} h={4} isTruncated>
        <SHA256Avatar hash={props.principal} />
      </Box>
      <Text fontSize="xs" fontWeight="bold" color="gray.500" isTruncated display={{ base: "none", md: "block" }}>
        {props.principal}
      </Text>
      <Text fontSize="xs" color="gray.500" isTruncated>
        deployed {time}
      </Text>
    </Stack>
  );
}

interface PrincipalProps {
  principal: string;
  time: number;
}

export default React.memo(Principal);
