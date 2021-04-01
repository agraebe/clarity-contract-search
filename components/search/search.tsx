import React from "react";
import algoliasearch from "algoliasearch";
import { InstantSearch, SearchBox } from "react-instantsearch-dom";

export default function Search() {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY
  );

  return (
    <InstantSearch indexName="MainnetContracts" searchClient={searchClient}>
      <SearchBox />
    </InstantSearch>
  );
}
