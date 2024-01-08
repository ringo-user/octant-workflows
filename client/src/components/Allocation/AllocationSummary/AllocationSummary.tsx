import cx from 'classnames';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import AllocationSummaryProject from 'components/Allocation/AllocationSummaryProject';
import BoxRounded from 'components/ui/BoxRounded';
import Sections from 'components/ui/BoxRounded/Sections/Sections';
import { SectionProps } from 'components/ui/BoxRounded/Sections/types';
import useAllocateSimulate from 'hooks/mutations/useAllocateSimulate';
import useIndividualReward from 'hooks/queries/useIndividualReward';
import useAllocationsStore from 'store/allocations/store';
import getFormattedEthValue from 'utils/getFormattedEthValue';

import styles from './AllocationSummary.module.scss';
import AllocationSummaryProps from './types';

const AllocationSummary: FC<AllocationSummaryProps> = ({ allocationValues }) => {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'components.dedicated.allocationSummary',
  });
  const { data: individualReward } = useIndividualReward();
  const { rewardsForProposals } = useAllocationsStore(state => ({
    rewardsForProposals: state.data.rewardsForProposals,
  }));
  const {
    data: allocationSimulated,
    mutateAsync: mutateAsyncAllocateSimulate,
    isLoading: isLoadingAllocateSimulate,
  } = useAllocateSimulate();

  const allocationSimulatedMatchingFundSum = allocationSimulated?.matched.reduce((acc, curr) => {
    return acc.add(parseUnits(curr.value, 'wei'));
  }, BigNumber.from(0));

  const allocationValuesPositive = allocationValues.filter(
    ({ value }) => !parseUnits(value).isZero(),
  );
  const areAllocationValuesPositive = allocationValuesPositive?.length > 0;

  const personalAllocation = individualReward?.sub(rewardsForProposals);

  const rewardsForProposalsToDisplay = getFormattedEthValue(rewardsForProposals, true, true);
  const allocationSimulatedMatchingFundSumToDisplay = allocationSimulatedMatchingFundSum
    ? getFormattedEthValue(allocationSimulatedMatchingFundSum).value
    : undefined;
  const totalImpactToDisplay = getFormattedEthValue(
    allocationSimulatedMatchingFundSum
      ? allocationSimulatedMatchingFundSum.add(rewardsForProposals)
      : rewardsForProposals,
  );
  const personalToDisplay = individualReward
    ? getFormattedEthValue(individualReward?.sub(rewardsForProposals)).fullString
    : undefined;

  const sections: SectionProps[] = [
    {
      childrenLeft: (
        <div className={styles.leftSection}>
          <div className={styles.label}>{i18n.t('common.totalDonated')}</div>
          <div className={styles.label}>
            {t('matchFunding')}
            <span className={styles.matchFundingLeverage}>
              {allocationSimulated ? parseInt(allocationSimulated.leverage, 10) : 0}x
            </span>
          </div>
        </div>
      ),
      childrenRight: (
        <div className={styles.rightSection}>
          <div className={styles.value}>{rewardsForProposalsToDisplay.value}</div>
          <div
            className={cx(styles.value, !!allocationSimulatedMatchingFundSum && styles.isLoading)}
          >
            {allocationSimulatedMatchingFundSumToDisplay}
          </div>
        </div>
      ),
      className: styles.section,
    },
    {
      childrenLeft: <div className={styles.label}>{t('totalImpact')}</div>,
      childrenRight: <div className={styles.value}>{totalImpactToDisplay.fullString}</div>,

      className: styles.section,
    },
  ];

  useEffect(() => {
    if (areAllocationValuesPositive) {
      mutateAsyncAllocateSimulate(allocationValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BoxRounded
        className={cx(
          styles.root,
          areAllocationValuesPositive && styles.areAllocationValuesPositive,
        )}
        hasPadding={false}
        isVertical
      >
        {areAllocationValuesPositive && (
          <div className={styles.projects}>
            {allocationValuesPositive?.map(({ address, value }) => (
              <AllocationSummaryProject
                key={address}
                address={address}
                amount={parseUnits(value)}
                isLoadingAllocateSimulate={isLoadingAllocateSimulate}
                simulatedMatched={
                  allocationSimulated?.matched.find(element => element.address === address)?.value
                }
                value={value}
              />
            ))}
          </div>
        )}
        <Sections sections={sections} variant="small" />
      </BoxRounded>
      {personalAllocation?.isZero() !== true && (
        <BoxRounded className={styles.personalRewardBox}>
          <div className={styles.personalReward}>
            <div className={styles.label}>{i18n.t('common.personal')}</div>
            <div className={styles.value}>{personalToDisplay}</div>
          </div>
        </BoxRounded>
      )}
    </>
  );
};

export default AllocationSummary;
