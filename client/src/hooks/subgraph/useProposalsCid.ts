import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import request from 'graphql-request';
import _last from 'lodash/last';

import { QUERY_KEYS } from 'api/queryKeys';
import { QueryKeys } from 'api/queryKeys/types';
import env from 'env';
import { graphql } from 'gql/gql';
import { GetProjectsMetadataPerEpochesQuery } from 'gql/graphql';

type QueryData = string | null | undefined;

const GET_PROJECTS_METADATA_PER_EPOCHES = graphql(`
  query GetProjectsMetadataPerEpoches {
    projectsMetadataPerEpoches(orderBy: epoch, orderDirection: asc) {
      epoch
      proposalsCid
    }
  }
`);

export default function useProposalsCid(
  epoch: number,
  options?: UseQueryOptions<
    GetProjectsMetadataPerEpochesQuery,
    unknown,
    QueryData,
    QueryKeys['projectsMetadataPerEpoches']
  >,
): UseQueryResult<QueryData> {
  const { subgraphAddress } = env;

  return useQuery<
    GetProjectsMetadataPerEpochesQuery,
    any,
    QueryData,
    QueryKeys['projectsMetadataPerEpoches']
  >(
    QUERY_KEYS.projectsMetadataPerEpoches,
    async () => request(subgraphAddress, GET_PROJECTS_METADATA_PER_EPOCHES),
    {
      select: data => {
        // Returns proposalsCid for the current or previous (lower, nearest) epoch
        const epochProposalsCid = _last(
          data.projectsMetadataPerEpoches.filter(p => p.epoch <= epoch),
        )?.proposalsCid;

        return epochProposalsCid;
      },
      ...options,
    },
  );
}
