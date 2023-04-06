import { useQueries, UseQueryResult } from 'react-query';

import { apiGetProposal } from 'api/calls/proposals';
import { QUERY_KEYS } from 'api/queryKeys';
import { BackendProposal, ExtendedProposal } from 'types/proposals';

import useProposalsCid from './useProposalsCid';
import useProposalsContract from './useProposalsContract';

export default function useProposalsIpfs(proposalsAddresses?: string[]): {
  data: ExtendedProposal[];
  isLoading: boolean;
  refetch: () => void;
} {
  const { data: proposalsCid, isLoading: isLoadingProposalsCid } = useProposalsCid();
  const { refetch } = useProposalsContract();

  const proposalsIpfsResults: UseQueryResult<BackendProposal>[] = useQueries(
    (proposalsAddresses || []).map(address => ({
      enabled: !!address && !!proposalsCid,
      queryFn: () => apiGetProposal(`${proposalsCid}${address}`),
      queryKey: QUERY_KEYS.proposalsIpfsResults(address),
    })),
  );

  const isProposalsIpfsResultsLoading =
    isLoadingProposalsCid ||
    proposalsIpfsResults.length === 0 ||
    proposalsIpfsResults.some(({ isLoading }) => isLoading);

  if (isProposalsIpfsResultsLoading) {
    return {
      data: [],
      isLoading: isProposalsIpfsResultsLoading,
      refetch,
    };
  }

  const proposalsIpfsResultsWithAddresses = proposalsIpfsResults.map<ExtendedProposal>(
    (proposal, index) => ({
      address: proposalsAddresses![index],
      isLoadingError: proposal.isError,
      ...(proposal.data || {}),
    }),
  );

  return {
    data: proposalsIpfsResultsWithAddresses,
    isLoading: false,
    refetch,
  };
}
