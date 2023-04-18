import axios from "axios";
import {
  Repository,
  SearchResult,
  SearchResultTypes,
  User,
} from "./interfaces";

const GIT_HUB_SEARCH_API = "https://api.github.com/search";

const searchGithubObjects = async <ObjectType>(
  objectName: string,
  query: string
): Promise<ObjectType[]> => {
  return axios
    .get(`${GIT_HUB_SEARCH_API}/${objectName}`, {
      headers: {
        // TODO - This is not safe, solution is to use a proxy server
        Authorization: `Bearer ${window.atob(
          process.env.REACT_APP_GITHUB_TOKEN || ""
        )}`,
      },
      params: { q: encodeURIComponent(query), per_page: 50 },
    })
    .then((response) => {
      if (response.status === 200) return response.data.items;
      throw new Error(response.data);
    })
    .catch((error) => {
      if (error.response.status === 403)
        throw new Error("GitHub rate limit exceeded");
      if (error.response.status === 401)
        throw new Error("GitHub API key is invalid");
      throw error;
    });
};

export const fetchAndMergeSearchResults = async (
  q: string
): Promise<SearchResult[]> => {
  const [users, repositories] = await Promise.all([
    searchGithubObjects<User>("users", q),
    searchGithubObjects<Repository>("repositories", q),
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
  ].sort((a, b) => a.name.localeCompare(b.name));
};
