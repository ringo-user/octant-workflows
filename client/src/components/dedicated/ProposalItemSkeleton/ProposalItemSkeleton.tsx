import React, { ReactElement } from 'react';

import styles from './ProposalItemSkeleton.module.scss';

const ProposalItemSkeleton = (): ReactElement => {
  return (
    <div className={styles.root}>
      <div className={styles.image} />
      <div className={styles.title} />
      <div className={styles.description} />
      <div className={styles.description} />
      <div className={styles.description} />
      <div className={styles.proposalRewards}>
        <div>
          <div className={styles.row} />
          <div className={styles.row} />
        </div>
        <div>
          <div className={styles.row} />
          <div className={styles.row} />
        </div>
      </div>
    </div>
  );
};

export default ProposalItemSkeleton;