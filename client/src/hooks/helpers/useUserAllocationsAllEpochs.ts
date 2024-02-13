import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { parseUnits } from 'ethers/lib/utils';
import { useAccount } from 'wagmi';

import { apiGetUserAllocations, Response as ApiResponse } from 'api/calls/userAllocations';
import { QUERY_KEYS } from 'api/queryKeys';
import useCurrentEpoch from 'hooks/queries/useCurrentEpoch';
import { UserAllocationElement } from 'hooks/queries/useUserAllocations';

export type ResponseItem = {
  elements: (UserAllocationElement & { epoch: number })[];
  hasUserAlreadyDoneAllocation: boolean;
  isManuallyEdited: boolean;
};

export type Response = ResponseItem[];

export default function useUserAllocationsAllEpochs(): { data: Response; isFetching: boolean } {
  const { address } = useAccount();
  const { data: currentEpoch, isFetching: isFetchingCurrentEpoch } = useCurrentEpoch();

  const userAllocationsAllEpochs: UseQueryResult<ApiResponse>[] = useQueries({
    queries: [...Array(currentEpoch).keys()].map(epoch => ({
      enabled: !!address && currentEpoch !== undefined && currentEpoch > 1,
      queryFn: () => apiGetUserAllocations(address as string, epoch),
      queryKey: QUERY_KEYS.userAllocations(epoch),
      retry: false,
    })),
  });

  const isFetchingUserAllAllocations =
    !address ||
    isFetchingCurrentEpoch ||
    userAllocationsAllEpochs.length === 0 ||
    userAllocationsAllEpochs.some(({ isFetching }) => isFetching);

  if (isFetchingUserAllAllocations) {
    return {
      data: [],
      isFetching: isFetchingUserAllAllocations,
    };
  }

  return {
    data: userAllocationsAllEpochs.map(({ data }, index) => {
      const userAllocationsFromBackend = data!.allocations.map(element => ({
        address: element.address,
        epoch: index,
        value: parseUnits(element.amount, 'wei'),
      }));

      return {
        elements: userAllocationsFromBackend.filter(({ value }) => !value.isZero()),
        hasUserAlreadyDoneAllocation: !!userAllocationsFromBackend?.length,
        isManuallyEdited: !!data!.isManuallyEdited,
      };
    }),
    isFetching: false,
  };
}
