import { SEARCH } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const searchResults = data => ({
  type: SEARCH,
  data,
});
