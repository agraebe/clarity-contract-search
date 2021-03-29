import algoliasearch from "algoliasearch";
import { InstantSearch, Hits, SearchBox, Highlight } from "react-instantsearch-dom";

export default function Search() {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY
  );

  const Hit = ({ hit }) => {
    return <Highlight attribute="smart_contract.contract_id" hit={hit} tagName="mark" />;
  };

  return (
    <InstantSearch indexName="MainnetContracts" searchClient={searchClient}>
      <SearchBox />

    </InstantSearch>
  );
}
