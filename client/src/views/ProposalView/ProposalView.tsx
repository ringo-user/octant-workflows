import React, { ReactElement, Fragment, useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';

import Button from 'components/core/Button/Button';
import Description from 'components/core/Description/Description';
import Img from 'components/core/Img/Img';
import Loader from 'components/core/Loader/Loader';
import Svg from 'components/core/Svg/Svg';
import DonorsList from 'components/dedicated/DonorsList/DonorsList';
import ProposalRewards from 'components/dedicated/ProposalRewards/ProposalRewards';
import { navigationTabs as navigationTabsDefault } from 'constants/navigationTabs/navigationTabs';
import env from 'env';
import useIdsInAllocation from 'hooks/helpers/useIdsInAllocation';
import useCurrentEpoch from 'hooks/queries/useCurrentEpoch';
import useMatchedProposalRewards from 'hooks/queries/useMatchedProposalRewards';
import useProposalsIpfs from 'hooks/queries/useProposalsIpfs';
import useProposalsWithRewards from 'hooks/queries/useProposalsWithRewards';
import MainLayout from 'layouts/MainLayout/MainLayout';
import { ROOT_ROUTES } from 'routes/RootRoutes/routes';
import useAllocationsStore from 'store/allocations/store';
import { tick } from 'svg/misc';
import { chevronLeft } from 'svg/navigation';
import { ExtendedProposal } from 'types/proposals';
import triggerToast from 'utils/triggerToast';

import styles from './ProposalView.module.scss';

const getCustomNavigationTabs = () => {
  const navigationTabs = [...navigationTabsDefault];
  navigationTabs[0] = {
    ...navigationTabs[0],
    icon: chevronLeft,
    isActive: true,
  };
  return navigationTabs;
};

const ProposalView = (): ReactElement => {
  const { ipfsGateway } = env;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadedAddresses, setLoadedAddresses] = useState<string[]>([]);
  const [loadedProposals, setLoadedProposals] = useState<ExtendedProposal[]>([]);
  const { proposalAddress: proposalAddressUrl } = useParams();
  const { data: allocations, setAllocations } = useAllocationsStore();
  const { data: proposalsIpfs } = useProposalsIpfs(loadedAddresses!);
  const { data: currentEpoch } = useCurrentEpoch();
  const { data: matchedProposalRewards } = useMatchedProposalRewards();
  const proposalsWithRewards = useProposalsWithRewards();

  useEffect(() => {
    if (loadedAddresses.length === 0) {
      setLoadedAddresses([proposalAddressUrl!]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      proposalsIpfs &&
      proposalsIpfs.length > 0 &&
      loadedProposals.length !== proposalsIpfs.length
    ) {
      setLoadedProposals(proposalsIpfs);
      setIsLoading(false);
    }
  }, [loadedProposals, proposalsIpfs, setLoadedProposals]);

  const onLoadNextProposal = () => {
    // isLoading prevents onLoadNextProposal from being called infinitely.
    if (isLoading || loadedAddresses.length === 0 || loadedProposals.length === 0) {
      return;
    }

    setIsLoading(true);
    const initialElement = loadedProposals[0];
    const currentElement = proposalsWithRewards!.find(
      ({ address }) => address === loadedAddresses[loadedAddresses.length - 1],
    );
    const currentElementIndex = proposalsWithRewards.indexOf(currentElement!);
    const isFirstProposalLoaded = !!loadedProposals.find(
      ({ address }) => address === proposalsWithRewards![0].address,
    );

    if (
      currentElementIndex < proposalsWithRewards.length - 1 &&
      loadedProposals.length < proposalsWithRewards.length &&
      !isFirstProposalLoaded
    ) {
      const nextIndex = 0;
      const nextAddress = proposalsWithRewards[nextIndex].address;
      setLoadedAddresses(prevLoadedAddresses => [...prevLoadedAddresses, nextAddress]);
      return;
    }

    let nextIndex =
      currentElementIndex < proposalsWithRewards!.length - 1
        ? currentElementIndex + 1
        : (proposalsWithRewards!.length % currentElementIndex) - 1;
    let nextAddress = proposalsWithRewards[nextIndex].address;

    /**
     * During first iteration we want to skip initialElement.
     * When user enters project index number 2, next ones are 0, 1, 3, ..., n - 1, n, 0, 1, 2, ...
     */

    if (
      nextAddress !== initialElement.address ||
      loadedProposals.length >= proposalsWithRewards.length
    ) {
      setLoadedAddresses(prevLoadedAddresses => [...prevLoadedAddresses, nextAddress]);
      return;
    }

    nextIndex += 1;
    nextAddress = proposalsWithRewards[nextIndex].address;
    setLoadedAddresses(prevLoadedAddresses => [...prevLoadedAddresses, nextAddress]);
  };

  const shouldMatchedProposalRewardsBeAvailable =
    !!currentEpoch && ((currentEpoch > 1 && matchedProposalRewards) || currentEpoch === 1);
  const initialElement = loadedProposals[0] || {};

  if (!initialElement || !shouldMatchedProposalRewardsBeAvailable) {
    return (
      <MainLayout
        classNameBody={styles.bodyLayout}
        isHeaderVisible={false}
        isLoading
        navigationTabs={getCustomNavigationTabs()}
      />
    );
  }

  if (!initialElement || (initialElement && initialElement.isLoadingError)) {
    triggerToast({
      title: 'Loading of this proposal encountered a problem.',
      type: 'warning',
    });
    return (
      <Routes>
        <Route element={<Navigate to={ROOT_ROUTES.proposals.absolute} />} path="*" />
      </Routes>
    );
  }

  return (
    <MainLayout
      classNameBody={styles.bodyLayout}
      isHeaderVisible={false}
      navigationTabs={getCustomNavigationTabs()}
    >
      <InfiniteScroll
        hasMore
        initialLoad
        loader={
          <div key={-1} className={styles.loaderWrapper}>
            <Loader />
          </div>
        }
        loadMore={onLoadNextProposal}
        pageStart={0}
        useWindow
      >
        {loadedProposals.map(
          ({ address, description, name, profileImageCID, landscapeImageCID, website }, index) => {
            const buttonProps = allocations!.includes(address)
              ? {
                  Icon: <Svg img={tick} size={1.5} />,
                  label: 'Added to Allocate',
                }
              : {
                  label: 'Add to Allocate',
                };
            const proposalMatchedProposalRewards = proposalsWithRewards?.find(
              ({ address: matchedAddress }) => matchedAddress === address,
            );
            const { onAddRemoveFromAllocate } = useIdsInAllocation({
              allocations: allocations!,
              proposalName: name,
              setAllocations,
            });
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={`${address}-${index}`}>
                <div className={styles.imageLandscapeWrapper}>
                  <Img
                    className={styles.imageLandscape}
                    src={`${ipfsGateway}${landscapeImageCID}`}
                  />
                </div>
                <div className={styles.proposalHeader}>
                  <Img className={styles.imageProfile} src={`${ipfsGateway}${profileImageCID}`} />
                  <div className={styles.nameAndAllocationValues}>
                    <span className={styles.name}>{name}</span>
                    <ProposalRewards
                      proposalMatchedProposalRewards={proposalMatchedProposalRewards}
                    />
                  </div>
                </div>
                <div className={styles.buttonAllocateWrapper}>
                  <Button
                    className={styles.buttonAllocate}
                    isSmallFont
                    onClick={() => onAddRemoveFromAllocate(address)}
                    variant="secondary"
                    {...buttonProps}
                  />
                </div>
                <div className={styles.body}>
                  <Description text={description!} />
                  <Button className={styles.buttonWebsite} href={website!.url} variant="link">
                    {website!.label || website!.url}
                  </Button>
                </div>
                <DonorsList className={styles.donors} proposalAddress={address} />
              </Fragment>
            );
          },
        )}
      </InfiniteScroll>
    </MainLayout>
  );
};

export default ProposalView;
