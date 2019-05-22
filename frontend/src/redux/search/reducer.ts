import { SEARCH } from './constants';

const initialState = {};

interface IAction {
  type: string
  data?: any
}

const reducer = (state = { ...initialState }, action: IAction) => {
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
