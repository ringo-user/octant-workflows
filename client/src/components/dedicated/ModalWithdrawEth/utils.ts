import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { object, string, ObjectSchema } from 'yup';

import { FormValues } from './types';

export const formInitialValues: FormValues = {
  valueToWithdraw: '',
};

export const validationSchema = (
  withdrawableUserEth: BigNumber | undefined,
): ObjectSchema<FormValues> =>
  object().shape({
    valueToWithdraw: string()
      .required("Value can't be empty")
      .test({
        name: 'value-in-range',
        skipAbsent: true,
        test(value, ctx) {
          const newValueBigNumber = parseUnits(value || '0');
          if (newValueBigNumber.gt(withdrawableUserEth!)) {
            return ctx.createError({ message: "You don't have that much to withdraw" });
          }

          return true;
        },
      }),
  });
