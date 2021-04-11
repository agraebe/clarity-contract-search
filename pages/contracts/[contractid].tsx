import React, { useEffect, useState } from "react";

import { Flex } from "@chakra-ui/react";
import { Footer } from "../../components/footer/footer";
import Header from "../../components/header/header";
import Contract from "../../components/contract/contract";
import { useRouter } from "next/router";
import ClarityContract, {
  ClarityContractSerialized
} from "../../classes/clarity-contract";

const ContractView = () => {
  const [contract, setContract] = useState<ClarityContractSerialized>();
  const router = useRouter();
  const { contractid } = router.query;
  // contracts need to be loaded initially
  useEffect(() => {
    if (contractid) {
      fetch(
        `https://stacks-node-api.mainnet.stacks.co/extended/v1/contract/${contractid}?proof=0`
      ).then(resp => {
        resp.json().then(data => {
          setContract(
            new ClarityContract(
              data.tx_id,
              data.contract_id,
              data.source_code,
              undefined,
              undefined
            ).toJSON()
          );
        });
      });
    }
  }, [contractid]);

  return (
    <Flex direction="column">
      <Header title="Clarity contract" sub={`${contractid}`} />
      <Contract contract={contract} />
      <Footer>
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
      </Footer>
    </Flex>
  );
};

export default ContractView;
