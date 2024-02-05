import React, { ReactElement, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

import MetricsGrid from 'components/Metrics/MetricsGrid';
import MetricsHeader from 'components/Metrics/MetricsHeader';
import TipTile from 'components/shared/TipTile';
import { METRICS_PERSONAL_ID } from 'constants/metrics';
import useMediaQuery from 'hooks/helpers/useMediaQuery';
import useCryptoValues from 'hooks/queries/useCryptoValues';
import useIndividualReward from 'hooks/queries/useIndividualReward';
import useUserAllocations from 'hooks/queries/useUserAllocations';
import useWithdrawals from 'hooks/queries/useWithdrawals';
import useSettingsStore from 'store/settings/store';

import styles from './MetricsPersonal.module.scss';
import MetricsPersonalGridAllocations from './MetricsPersonalGridAllocations';
import MetricsPersonalGridDonationsProgressBar from './MetricsPersonalGridDonationsProgressBar';
import MetricsPersonalGridTotalRewardsWithdrawals from './MetricsPersonalGridTotalRewardsWithdrawals';

const MetricsPersonal = (): ReactElement => {
  const { isConnected } = useAccount();
  const { isDesktop } = useMediaQuery();
  const [isConnectWalletTipTileOpen, setIsConnectWalletTipTileOpen] = useState(!isConnected);
  const { i18n, t } = useTranslation('translation', { keyPrefix: 'views.metrics' });

  const {
    data: { displayCurrency },
  } = useSettingsStore(({ data }) => ({
    data: {
      displayCurrency: data.displayCurrency,
    },
  }));
  const { isFetching: isFetchingCryptoValues } = useCryptoValues(displayCurrency);
  const { isFetching: isFetchingIndividualReward } = useIndividualReward();
  const { isFetching: isFetchingWithdrawals } = useWithdrawals();
  const { isFetching: isFetchingUserAllocations } = useUserAllocations();

  const isLoading =
    isFetchingCryptoValues ||
    isFetchingIndividualReward ||
    isFetchingWithdrawals ||
    isFetchingUserAllocations;

  return (
    <div className={styles.root} id={METRICS_PERSONAL_ID}>
      <div className={styles.divider} />
      <MetricsHeader title={t('yourMetrics')} />
      {isConnected ? (
        <MetricsGrid className={styles.grid} dataTest="MetricsPersonal__MetricsGrid">
          <MetricsPersonalGridAllocations isLoading={isLoading} />
          <MetricsPersonalGridTotalRewardsWithdrawals isLoading={isLoading} />
          <MetricsPersonalGridDonationsProgressBar isLoading={isLoading} />
        </MetricsGrid>
      ) : (
        <TipTile
          dataTest="MetricsPersonal__TipTile--connectWallet"
          image="images/tip-connect-wallet.webp"
          infoLabel={i18n.t('common.octantTips')}
          isOpen={isConnectWalletTipTileOpen}
          onClose={() => setIsConnectWalletTipTileOpen(false)}
          text={
            <Trans
              // eslint-disable-next-line react/jsx-no-useless-fragment
              components={[isDesktop ? <br /> : <></>]}
              i18nKey="views.metrics.connectWalletTip.text"
            />
          }
          title={t('connectWalletTip.title')}
        />
      )}
    </div>
  );
};

export default MetricsPersonal;