import { occurrences } from "../utils/occurances";

export interface ClarityContractSerialized {
  id: string;
  name: string;
  sender: string;
  txId: string;
  source: string;
  maps: number;
  readOnlyMethods: number;
  publicMethods: number;
  constants: number;
  dataVars: number;
  privateMethods: number;
  traits: number;
  nfts: number;
  fts: number;
  useTraits: number;
  useContractCalls: number;
  useBlockHeight: number;
}

export default class ClarityContract {
  id: string;
  txId: string;
  name: string;
  sender: string;
  source: string;
  maps: number;
  readOnlyMethods: number;
  publicMethods: number;
  constants: number;
  dataVars: number;
  privateMethods: number;
  traits: number;
  nfts: number;
  fts: number;
  useTraits: number;
  useContractCalls: number;
  useBlockHeight: number;

  constructor(txId: string, id: string, source: string) {
    this.txId = txId;
    this.id = id;
    const idArr = id.split(".");
    this.name = idArr[1];
    this.sender = idArr[0];
    this.source = source;

    this.scan();
  }

  scan() {
    // declaration
    this.publicMethods = occurrences(this.source, "define-public");
    this.readOnlyMethods = occurrences(this.source, "define-read-only");
    this.privateMethods = occurrences(this.source, "define-private");
    this.constants = occurrences(this.source, "define-constant");
    this.dataVars = occurrences(this.source, "define-data-var");
    this.maps = occurrences(this.source, "define-map");
    this.traits = occurrences(this.source, "define-trait");
    this.nfts = occurrences(this.source, "define-non-fungible-token");
    this.fts = occurrences(this.source, "define-fungible-token");

    // usage
    this.useTraits = occurrences(this.source, "use-trait");
    this.useContractCalls = occurrences(this.source, "contract-call?");
    this.useBlockHeight = occurrences(this.source, "block-height");
  }

  toJSON(): ClarityContractSerialized {
    return {
      id: this.id,
      txId: this.txId,
      name: this.name,
      sender: this.sender,
      source: this.source,
      maps: this.maps,
      readOnlyMethods: this.readOnlyMethods,
      publicMethods: this.publicMethods,
      constants: this.constants,
      dataVars: this.dataVars,
      privateMethods: this.privateMethods,
      traits: this.traits,
      nfts: this.nfts,
      fts: this.fts,
      useTraits: this.useTraits,
      useContractCalls: this.useContractCalls,
      useBlockHeight: this.useBlockHeight,
    };
  }
}
