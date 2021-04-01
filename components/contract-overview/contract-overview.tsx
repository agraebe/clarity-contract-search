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
import { useEffect, useState } from "react";

export default function ContractOverview(props: SourceProps) {
  const [maps, setMaps] = useState(0);
  const [readOnly, setReadOnly] = useState(0);
  const [publicMethods, setpublicMethods] = useState(0);
  const [constant, setConstant] = useState(0);
  const [dataVar, setDataVar] = useState(0);
  const [privateMethods, setprivateMethods] = useState(0);
  const [traits, setTraits] = useState(0);
  const [useTraits, setUseTraits] = useState(0);
  const [nfts, setNfts] = useState(0);
  const [fts, setFts] = useState(0);
  const [contractCalls, setcontractCalls] = useState(0);

  useEffect(() => {
    setpublicMethods(
      (props.source.match(new RegExp("define-public", "g")) || []).length
    );
    setReadOnly(
      (props.source.match(new RegExp("define-read-only", "g")) || []).length
    );
    setprivateMethods(
      (props.source.match(new RegExp("define-private", "g")) || []).length
    );
    setConstant(
      (props.source.match(new RegExp("define-constant", "g")) || []).length
    );
    setDataVar(
      (props.source.match(new RegExp("define-data-var", "g")) || []).length
    );
    setMaps((props.source.match(new RegExp("define-map", "g")) || []).length);
    setTraits(
      (props.source.match(new RegExp("define-trait", "g")) || []).length
    );
    setUseTraits(
      (props.source.match(new RegExp("use-trait", "g")) || []).length
    );
    setNfts(
      (props.source.match(new RegExp("define-non-fungible-token", "g")) || [])
        .length
    );
    setFts(
      (props.source.match(new RegExp("define-fungible-token", "g")) || [])
        .length
    );
    setcontractCalls(
      (props.source.match(new RegExp("contract-call?", "g")) || []).length
    );
  }, [props.source]);

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
          <TabPanel>
            {getTextElem(constant, "constants")}
            {getTextElem(dataVar, "data variables")}
            {getTextElem(maps, "maps")}
            {getTextElem(readOnly, "read only methods")}
            {getTextElem(publicMethods, "public methods")}
            {getTextElem(privateMethods, "private methods")}
            {getTextElem(traits, "traits")}
            {getTextElem(nfts, "non-fungible tokens")}
            {getTextElem(fts, "fungible tokens")}
          </TabPanel>
          <TabPanel>
            {getTextElem(useTraits, "traits")}
            {getTextElem(contractCalls, "contract calls")}
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
  source: string;
}
