# Autocomplete reusable component

Reusable and self-contained autocomplete component that fetch suggestions from GitHub repositories and users.

Live at: https://joaoricardo15.github.io/autocomplete/

\*\*\* Search for '_joao123_' to trigger an error.

### Business criteria:

- Minimal chars number to initialize search: 3.
- Result items are combined and displayed alphabetically using repository and profile
  name as ordering keys.
- Number of result items are limited to 50 per request.
- The component has an visual feedback for when the data is being fetched, the
  results are empty, or the request resulted in an error.
- The component supports keyboard strokes (up and down arrows to browse the results,
  enter to open a new tab with the repository/user page).
- Displays a meaningful snippet of testing abilities.

### Bonus features:

- Debounce function using _useMemo_ (better performance, less requests to server)
- Support custumized themes (only main color)
- Centralized error handling using _react-error-boundary_
- Component unit tests + Business logic tests
