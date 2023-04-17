import axios from "axios";
import {
  Repository,
  SearchResult,
  SearchResultTypes,
  User,
} from "./interfaces";

const GIT_HUB_SEARCH_API = "https://api.github.com/search";

const gitHubRequest = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
  },
  params: {
    per_page: 50,
    // sort: undefined, // Default is best match
    // order: undefined, // Default is desc,
    // page: undefined, // Default is 1
  },
});

const getUsers = (q: string): Promise<User[]> => {
  return gitHubRequest
    .get(`${GIT_HUB_SEARCH_API}/users`, { params: { q } })
    .then((response) => {
      return response.data.items;
    })
    .catch((error) => {
      console.log("getUsers error", error);
      return [];
    });
};

const getRepositories = (q: string): Promise<Repository[]> => {
  return gitHubRequest
    .get(`${GIT_HUB_SEARCH_API}/repositories`, { params: { q } })
    .then((response) => {
      return response.data.items;
    })
    .catch((error) => {
      console.log("getRepositories error", error);
      return [];
    });
};

export const fetchAndMergeSearchResults = async (
  q: string
): Promise<SearchResult[]> => {
  const [users, repositories] = await Promise.all([
    getUsers(q),
    getRepositories(q),
  ]);

  return [
    ...users.map((user: User) => ({
      name: user.login,
      url: user.html_url,
      type: SearchResultTypes.user,
    })),
    ...repositories.map((repository: Repository) => ({
      name: repository.name,
      url: repository.html_url,
      type: SearchResultTypes.repository,
    })),
  ].sort((a, b) => b.name.localeCompare(a.name));
};
