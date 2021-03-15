import { Stack, Text } from "@chakra-ui/react";
import Jdenticon from "react-jdenticon";

export default function Principal(props: PrincipalProps) {
  return (
    <Stack direction="row" spacing={3}>
      <Jdenticon size="16" value={props.principal} />
      <Text fontSize="xs" color="gray.500" isTruncated>
        {props.principal}
      </Text>
    </Stack>
  );
}

interface PrincipalProps {
  principal: string;
}
