import { SetStateAction, useEffect, useMemo, useState } from "react";
import { debounce } from "@mui/material";
import { fetchAndMergeSearchResults } from "./api";
import { SearchResult } from "./interfaces";

const useAutocomplete = (
  onChange: (query: string) => void,
  onSelect: (result: SearchResult) => void,
  inputSearchRef: HTMLInputElement | null
) => {
  const [searchedValue, setSearchedValue] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = async (event: {
    target: { value: SetStateAction<string> };
  }) => {
    const query = event.target.value as string;
    setSearchedValue(query);
    onChange(query);

    // Business logic to filter the suggestions
    if (query.length >= 3) {
      setLoading(true);
      setSearching(true);
      debouncedFetch(query);
    } else {
      setLoading(false);
      setSearching(false);
      setSuggestions([]);
      setSelectedSuggestion("");
      setActiveSuggestion(0);
    }
  };

  const handleFetch = async (query: string) => {
    const rawResults = await fetchAndMergeSearchResults(query);
    setSuggestions(rawResults);
    setLoading(false);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "ArrowDown" && activeSuggestion < suggestions.length) {
      setActiveSuggestion(activeSuggestion + 1);
    } else if (event.key === "ArrowUp" && activeSuggestion > 1) {
      setActiveSuggestion(activeSuggestion - 1);
    } else if (event.key === "Enter") {
      const selectedSuggestion = suggestions[activeSuggestion - 1];
      setSearchedValue(selectedSuggestion.name);
      setSelectedSuggestion(selectedSuggestion.name);
      setSuggestions([]);
      setActiveSuggestion(0);
      onSelect(selectedSuggestion);
    }
  };

  const handleClick = (result: SearchResult) => {
    setSearchedValue(result.name);
    setSuggestions([]);
    setSelectedSuggestion(result.name);
    setActiveSuggestion(0);
    onSelect(result);
  };

  const debouncedFetch = useMemo(() => debounce(handleFetch, 500), []);

  useEffect(() => {
    if (inputSearchRef) {
      inputSearchRef.focus();
    }
  }, [inputSearchRef]);

  return {
    searchedValue,
    loading,
    searching,
    suggestions,
    selectedSuggestion,
    activeSuggestion,
    handleChange,
    handleKeyDown,
    handleClick,
  };
};

export default useAutocomplete;
