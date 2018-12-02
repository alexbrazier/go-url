import { SEARCH } from './constants';

const initialState = {};

const reducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case SEARCH:
      return {
        results: action.data,
      };
    default:
      return state;
  }
};

export default reducer;
