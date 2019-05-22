import { FLASH_CLEAR, FLASH_MESSAGE } from './constants';

const initialState = {};

interface IAction {
  type: string
  variant?: string
  message?: string
}

const reducer = (state = { ...initialState }, action: IAction) => {
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
