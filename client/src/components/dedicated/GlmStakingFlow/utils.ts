import debounce from 'lodash/debounce';

import { TOAST_DEBOUNCE_TIME } from 'constants/toasts';
import triggerToast from 'utils/triggerToast';

import { CurrentMode, CurrentStepIndex } from './types';

export const getButtonCtaLabel = (
  currentMode: CurrentMode,
  currentStepIndex: CurrentStepIndex,
): string => {
  if (currentStepIndex === 3) {
    return 'Done';
  }
  return currentMode === 'deposit' ? 'Stake' : 'Unstake';
};

export const toastDebouncedUnstakeValueTooBig = debounce(
  () =>
    triggerToast({
      message: "You can't unstake more than is staked.",
      title: 'Too big value',
    }),
  TOAST_DEBOUNCE_TIME,
  { leading: true },
);

export const toastDebouncedStakeValueTooBig = debounce(
  () =>
    triggerToast({
      message: "You can't stake more than is available in the wallet.",
      title: 'Too big value',
    }),
  TOAST_DEBOUNCE_TIME,
  { leading: true },
);