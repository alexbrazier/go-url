import { FLASH_CLEAR, FLASH_MESSAGE } from './constants';

export const displayFlashError = message => ({
  type: FLASH_MESSAGE,
  variant: 'error',
  message,
});

export const displayFlashSuccess = message => ({
  type: FLASH_MESSAGE,
  variant: 'success',
  message,
});

export const clearFlash = () => ({
  type: FLASH_CLEAR,
});
