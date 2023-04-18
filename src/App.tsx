import React from "react";
import Autocomplete, { AutocompleteInputProps } from "./Autocomplete";

function App() {
  const inputProps: AutocompleteInputProps = {
    color: "#4489FA", // Influencer-dna blue
    placeholder: "Search for Github users & repositories",
    noResultsText: "No results :(",
    onSelect: (result) => window.open(result.url, "_blank"),
    onChange: (value) => console.log("onChange", value),
    onError: (errorMessage) => alert("Error: " + errorMessage),
  };

  return (
    <div style={{ width: "60%", margin: "10% auto", textAlign: "center" }}>
      <img
        style={{ marginBottom: "10%" }}
        src="https://uploads-ssl.webflow.com/5c9284aa89862648f0e35f13/5cc9eb9389b7a68463202562_influencerdnalogo.svg"
        alt="logo"
      />
      <Autocomplete {...inputProps} />
    </div>
  );
}

export default App;
