export interface ClarityContractSerialized {
  id: string;
  name: string;
  sender: string;
  source: string;
  constants: number;
}

export default class ClarityContract {
  id: string;
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

  constructor(id: string, source: string) {
    this.id = id;
    const idArr = id.split(".");
    this.name = idArr[1];
    this.sender = idArr[0];
    this.source = source;

    this.scan();
  }

  scan(source: string) {
    this.publicMethods = (
      this.source.match(new RegExp("define-public")) || []
    ).length;
    this.readOnlyMethods = (
      this.source.match(new RegExp("define-read-only")) || []
    ).length;
    this.privateMethods = (
      this.source.match(new RegExp("define-private")) || []
    ).length;
    this.constants = (
      this.source.match(new RegExp("define-constant")) || []
    ).length;
    this.dataVars = (
      this.source.match(new RegExp("define-data-var")) || []
    ).length;
    this.maps = (this.source.match(new RegExp("define-map")) || []).length;
    this.traits = (this.source.match(new RegExp("define-trait")) || []).length;
    this.useTraits = (this.source.match(new RegExp("use-trait")) || []).length;
    this.nfts = (
      this.source.match(new RegExp("define-non-fungible-token")) || []
    ).length;
    this.fts = (
      this.source.match(new RegExp("define-fungible-token")) || []
    ).length;
    this.useContractCalls = (
      this.source.match(new RegExp("contract-call?")) || []
    ).length;
  }

  getPublicMethods(): string {
    return this.publicMethods;
  }

  getId(): string {
    return this.id;
  }

  getConstants(): string {
    return this.constants;
  }

  toJSON(): ClarityContractSerialized {
    return {
      id: this.id,
      name: this.name,
      sender: this.sender,
      source: this.source,
      constants: this.constants,
    };
  }
}
