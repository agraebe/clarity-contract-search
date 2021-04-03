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
  useTrait: number;
  useContractCalls: number;
  useBlockHeight: number;
  useBlockInfo: number;
  useBurn: number;
  useMint: number;
  useTransfer: number;
  useGetBalance: number;
  useGetOwner: number;
  useGetSupply: number;
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
  useTrait: number;
  useContractCalls: number;
  useBlockHeight: number;
  useBlockInfo: number;
  useBurn: number;
  useMint: number;
  useTransfer: number;
  useGetBalance: number;
  useGetOwner: number;
  useGetSupply: number;

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
    this.useTrait =
      occurrences(this.source, "use-trait") +
      occurrences(this.source, "impl-trait");
    this.useContractCalls = occurrences(this.source, "contract-call?");
    this.useBlockHeight = occurrences(this.source, "block-height");
    this.useBlockInfo = occurrences(this.source, "get-block-info?");
    this.useBurn = occurrences(this.source, "-burn?");
    this.useMint = occurrences(this.source, "ft-mint?");
    this.useTransfer = occurrences(this.source, "-transfer?");
    this.useGetBalance = occurrences(this.source, "-get-balance");
    this.useGetOwner = occurrences(this.source, "nft-get-owner?");
    this.useGetSupply = occurrences(this.source, "ft-get-supply");
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
      useTrait: this.useTrait,
      useContractCalls: this.useContractCalls,
      useBlockHeight: this.useBlockHeight,
      useBlockInfo: this.useBlockInfo,
      useBurn: this.useBurn,
      useMint: this.useMint,
      useTransfer: this.useTransfer,
      useGetBalance: this.useGetBalance,
      useGetOwner: this.useGetOwner,
      useGetSupply: this.useGetSupply,
    };
  }
}
