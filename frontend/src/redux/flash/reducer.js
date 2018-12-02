import { FLASH_CLEAR, FLASH_MESSAGE } from './constants';

const initialState = {};

const reducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case FLASH_MESSAGE:
      return {
        variant: action.variant,
        message: action.message,
      };
    case FLASH_CLEAR:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default reducer;
