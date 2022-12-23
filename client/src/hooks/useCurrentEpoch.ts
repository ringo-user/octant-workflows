import { BigNumber } from 'ethers';
import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';

import useContractEpochs from './contracts/useContractEpochs';

export default function useCurrentEpoch(
  options?: UseQueryOptions<BigNumber | undefined, unknown, number | undefined, string[]>,
): UseQueryResult<number | undefined> {
  const contractEpochs = useContractEpochs();

  return useQuery(['currentEpoch'], () => contractEpochs?.getCurrentEpoch(), {
    enabled: !!contractEpochs,
    select: response => response?.toNumber(),
    ...options,
  });
}