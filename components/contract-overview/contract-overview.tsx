import React from "react";
import {
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { ClarityContractSerialized } from "../../classes/clarity-contract";

export function ContractOverview({ contract }: SourceProps) {
  return (
    <Box
      h="300px"
      w="250px"
      ml="2"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Declarations</Tab>
          <Tab>Usage</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{getTextElem(contract.constants, "constants")}</TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

function getTextElem(elem, label) {
  if (elem === 0) {
    return;
  }
  return (
    <Box>
      <Text fontSize="xs" as="kbd">
        {elem} {label}
      </Text>
    </Box>
  );
}

interface SourceProps {
  contract: ClarityContractSerialized;
}

export default React.memo(ContractOverview);
