import React from "react";
import {
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
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
      <Tabs isFitted>
        <TabList mb="1em">
          <Tab>Declaration</Tab>
          <Tab>Usage</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {getTextElem(contract.readOnlyMethods, "read-only methods")}
            {getTextElem(contract.publicMethods, "public methods")}
            {getTextElem(contract.privateMethods, "private methods")}
            {getTextElem(contract.constants, "constants")}
            {getTextElem(contract.dataVars, "data variables")}
            {getTextElem(contract.maps, "maps")}
            {getTextElem(contract.nfts, "non-fungible tokens")}
            {getTextElem(contract.fts, "fungible tokens")}
            {getTextElem(contract.traits, "traits")}
          </TabPanel>
          <TabPanel>
            {getTextElem(contract.useTrait, "traits")}
            {getTextElem(contract.useContractCalls, "contract calls")}
            {getTextElem(contract.useBlockHeight, "block height")}
            {getTextElem(contract.useBlockInfo, "block info")}
            {getTextElem(contract.useBurn, "burns")}
            {getTextElem(contract.useMint, "mints")}
            {getTextElem(contract.useTransfer, "transfers")}
            {getTextElem(contract.useGetBalance, "get balance")}
            {getTextElem(contract.useGetOwner, "get owner")}
            {getTextElem(contract.useGetSupply, "get supply")}
          </TabPanel>
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
