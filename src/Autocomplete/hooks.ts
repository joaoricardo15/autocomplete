import { SetStateAction, useEffect, useMemo, useState } from "react";
import { debounce } from "@mui/material";
import { fetchAndMergeSearchResults } from "./api";
import { SearchResult } from "./interfaces";

const useAutocomplete = (
  onChange: (query: string) => void,
  onSelect: (result: SearchResult) => void,
  onError: (errorMessage: string) => void,
  inputSearchRef: HTMLInputElement | null
) => {
  const [searchedValue, setSearchedValue] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const clearState = () => {
    setLoading(false);
    setSearching(false);
    setSuggestions([]);
    setActiveSuggestion(0);
    setSelectedSuggestion("");
  };

  const selectSuggestion = (suggestion: SearchResult) => {
    onSelect(suggestion);
    setSuggestions([]);
    setActiveSuggestion(0);
    setSearchedValue(suggestion.name);
    setSelectedSuggestion(suggestion.name);
  };

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
      setActiveSuggestion(0);
      setSelectedSuggestion("");
      debouncedFetch(query);
    } else {
      clearState();
    }
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

      if (selectedSuggestion) {
        selectSuggestion(selectedSuggestion);
      }
    }
  };

  const handleClick = (suggestion: SearchResult) => {
    selectSuggestion(suggestion);
  };

  const debouncedFetch = useMemo(
    () =>
      debounce(async (query: string) => {
        try {
          const rawResults = await fetchAndMergeSearchResults(query);
          setSuggestions(rawResults);
          setLoading(false);
        } catch (error) {
          onError("Error fetching results");
          setSearchedValue("");
          clearState();
          throw error;
        }
      }, 500),
    [onError]
  );

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
