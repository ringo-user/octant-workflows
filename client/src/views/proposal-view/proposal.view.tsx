import { BigNumber } from 'ethers';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import React, { ReactElement } from 'react';
import cx from 'classnames';

import { ROOT_ROUTES } from 'routes/root-routes/routes';
import { chevronLeft } from 'svg/navigation';
import { navigationTabs as navigationTabsDefault } from 'constants/navigationTabs/navigationTabs';
import { tick } from 'svg/misc';
import Button from 'components/core/button/button.component';
import Img from 'components/core/img/img.component';
import MainLayout from 'layouts/main-layout/main.layout';
import Svg from 'components/core/svg/svg.component';
import isAboveProposalDonationThresholdPercent from 'utils/isAboveProposalDonationThresholdPercent';
import triggerToast from 'utils/triggerToast';
import useBaseUri from 'hooks/useBaseUri';
import useIdInAllocation from 'hooks/useIdInAllocation';
import useIpfsProposals from 'hooks/useIpfsProposals';

import styles from './style.module.scss';

import useMatchedProposalRewards from '../../hooks/useMatchedProposalRewards';

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
  const { proposalId } = useParams();
  const proposalIdNumber = parseInt(proposalId!, 10);
  const [isAddedToAllocate, onAddRemoveFromAllocate] = useIdInAllocation(proposalIdNumber);
  const { data: baseUri } = useBaseUri();
  const { data: matchedProposalRewards } = useMatchedProposalRewards();
  const proposalMatchedProposalRewards = matchedProposalRewards?.find(
    ({ id }) => id.toString() === proposalId,
  );

  const [proposals] = useIpfsProposals(
    baseUri ? [{ id: BigNumber.from(proposalId!), uri: `${baseUri}${proposalId}` }] : undefined,
  );
  const [proposal] = proposals;

  if (!proposal || !proposalMatchedProposalRewards) {
    return (
      <MainLayout
        classNameBody={styles.bodyLayout}
        isHeaderVisible={false}
        isLoading
        navigationTabs={getCustomNavigationTabs()}
      />
    );
  }

  if (proposal.isLoadingError) {
    triggerToast({
      title: 'Loading of this proposal encountered a problem.',
    });
    return (
      <Routes>
        <Route element={<Navigate to={ROOT_ROUTES.proposals.absolute} />} path="*" />
      </Routes>
    );
  }

  const { description, landscapeImageUrl, name, profileImageUrl, website } = proposal;

  const buttonProps = isAddedToAllocate
    ? {
        Icon: <Svg img={tick} size={1.5} />,
        label: 'Added to Allocate',
        variant: 'secondaryGrey',
      }
    : {
        label: 'Add to Allocate',
        variant: 'secondary',
      };

  return (
    <MainLayout
      classNameBody={styles.bodyLayout}
      isHeaderVisible={false}
      landscapeImage={
        landscapeImageUrl && (
          <div className={styles.imageLandscapeWrapper}>
            <Img className={styles.imageLandscape} src={landscapeImageUrl} />
          </div>
        )
      }
      navigationTabs={getCustomNavigationTabs()}
    >
      <div className={styles.header}>
        <Img className={styles.imageProfile} src={profileImageUrl} />
        <div className={styles.nameAndAllocationValues}>
          <span className={styles.name}>{name}</span>
          <div className={styles.allocationValues}>
            <div>{proposalMatchedProposalRewards.sum} ETH</div>
            <div className={styles.separator} />
            <div
              className={cx(
                styles.percentage,
                isAboveProposalDonationThresholdPercent(
                  proposalMatchedProposalRewards.percentage,
                ) && styles.isAboveThreshold,
              )}
            >
              {proposalMatchedProposalRewards.percentage} %
            </div>
          </div>
        </div>
      </div>
      <Button
        className={styles.buttonAllocate}
        onClick={() => onAddRemoveFromAllocate(proposalIdNumber)}
        {...buttonProps}
      />
      <div className={styles.body}>
        <div>{description}</div>
        <Button className={styles.buttonWebsite} href={website.url} variant="link">
          {website.label || website.url}
        </Button>
      </div>
    </MainLayout>
  );
};

export default ProposalView;