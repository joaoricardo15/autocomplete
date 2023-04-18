import { useEffect, useRef } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material";
import { Card, Input, LinearProgress, Typography } from "@mui/material";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { SearchResult, SearchResultTypes } from "./interfaces";
import useAutocomplete from "./hooks";
import ErrorProvider from "./error";

export interface AutocompleteInputProps {
  color?: string;
  placeholder?: string;
  noResultsText?: string;
  onChange?: (value: string) => void;
  onSelect?: (result: SearchResult) => void;
  onError?: (errorMessage: string) => void;
}

const Autocomplete = ({
  color,
  placeholder = "Search",
  noResultsText = "No results...",
  onChange = () => null,
  onSelect = () => null,
  onError = () => null,
}: AutocompleteInputProps) => {
  const inputSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.focus();
    }
  }, []);

  const {
    searchedValue,
    searching,
    loading,
    suggestions,
    selectedSuggestion,
    activeSuggestion,
    handleChange,
    handleKeyDown,
    handleClick,
  } = useAutocomplete(onChange, onSelect, onError, inputSearchRef.current);

  const theme = createTheme({
    palette: {
      ...(color && {
        primary: {
          main: color,
        },
      }),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ErrorProvider>
        <Input
          fullWidth
          ref={inputSearchRef}
          value={searchedValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          inputProps={{ "data-testid": "input" }}
        />
        {searching && (
          <Card>
            {loading ? (
              <LinearProgress data-testid="loading" />
            ) : !suggestions.length &&
              searchedValue.length &&
              !selectedSuggestion.length ? (
              <Typography padding={1} data-testid="no-results-text">
                {noResultsText}
              </Typography>
            ) : (
              <>
                {suggestions.map((result: SearchResult, index) => (
                  <ResultItemContainer
                    key={index}
                    data-testid="result-item"
                    onClick={() => handleClick(result)}
                    className={index === activeSuggestion - 1 ? "active" : ""}
                  >
                    {result.type === SearchResultTypes.user ? (
                      <AccountCircleIcon />
                    ) : (
                      <CardMembershipIcon />
                    )}
                    <Typography marginLeft={1}>{result.name}</Typography>
                  </ResultItemContainer>
                ))}
              </>
            )}
          </Card>
        )}
      </ErrorProvider>
    </ThemeProvider>
  );
};

export default Autocomplete;

const ResultItemContainer = styled("div")(({ theme }) => ({
  display: "flex",
  padding: 5,
  "&:hover": {
    color: "white",
    cursor: "pointer",
    backgroundColor: theme.palette.primary.light,
  },
  "&.active": {
    color: "white",
    backgroundColor: theme.palette.primary.light,
  },
}));
