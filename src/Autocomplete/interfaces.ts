export interface User {
  login: string;
  html_url: string;
  // ... other properties
}

export interface Repository {
  name: string;
  html_url: string;
  // ... other properties
}

export enum SearchResultTypes {
  user = 0,
  repository = 1,
}

export interface SearchResult {
  name: string;
  url: string;
  type: SearchResultTypes;
}
