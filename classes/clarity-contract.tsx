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

  constructor(txId: string, id: string, source: string) {
    this.txId = txId;
    this.id = id;
    const idArr = id.split(".");
    this.name = idArr[1];
    this.sender = idArr[0];
    this.source = source;

    this.scan(source);
  }

  scan(source: string) {
    this.publicMethods = (
      source.match(new RegExp("define-public", "g")) || []
    ).length;
    this.readOnlyMethods = (
      source.match(new RegExp("define-read-only", "g")) || []
    ).length;
    this.privateMethods = (
      source.match(new RegExp("define-private", "g")) || []
    ).length;
    this.constants = (
      source.match(new RegExp("define-constant", "g")) || []
    ).length;
    this.dataVars = (
      source.match(new RegExp("define-data-var", "g")) || []
    ).length;
    this.maps = (source.match(new RegExp("define-map", "g")) || []).length;
    this.traits = (source.match(new RegExp("define-trait", "g")) || []).length;
    this.useTraits = (source.match(new RegExp("use-trait", "g")) || []).length;
    this.nfts = (
      source.match(new RegExp("define-non-fungible-token", "g")) || []
    ).length;
    this.fts = (
      source.match(new RegExp("define-fungible-token", "g")) || []
    ).length;
    this.useContractCalls = (
      source.match(new RegExp("contract-call?", "g")) || []
    ).length;
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
    };
  }
}
