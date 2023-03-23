import debounce from 'lodash/debounce';

import { TOAST_DEBOUNCE_TIME } from 'constants/toasts';
import triggerToast from 'utils/triggerToast';

import { CurrentMode, CurrentStepIndex } from './types';

export const getButtonCtaLabel = (
  currentMode: CurrentMode,
  currentStepIndex: CurrentStepIndex,
  isLoading: boolean,
): string => {
  if (currentStepIndex === 3) {
    return 'Done';
  }
  if (isLoading) {
    return 'Waiting for approval...';
  }
  return currentMode === 'lock' ? 'Lock' : 'Unlock';
};

export const toastDebouncedUnlockValueTooBig = debounce(
  () =>
    triggerToast({
      message: "You can't unlock more than is locked.",
      title: 'Too big value',
      type: 'warning',
    }),
  TOAST_DEBOUNCE_TIME,
  { leading: true },
);

export const toastDebouncedLockValueTooBig = debounce(
  () =>
    triggerToast({
      message: "You can't lock more than is available in the wallet.",
      title: 'Too big value',
      type: 'warning',
    }),
  TOAST_DEBOUNCE_TIME,
  { leading: true },
);