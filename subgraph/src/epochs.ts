import { Address, ethereum, log, Bytes } from '@graphprotocol/graph-ts';

import { Epochs } from '../generated/Epochs/Epochs';
import { Epoch } from '../generated/schema';

export function handleBlock(block: ethereum.Block): void {
  // TODO pass the address from config OCT-467
  const epochsContract = Epochs.bind(
    Address.fromString('0x86A032e5e5bEaaEB8eb0F625bEB5426D8B526719'),
  );
  const currentEpoch = epochsContract.try_getCurrentEpoch();
  if (currentEpoch.reverted) {
    log.info('Call to getCurrentEpoch() reverted!', []);
    return;
  }

  const epochNo = currentEpoch.value.toI32();
  let epoch = Epoch.load(Bytes.fromI32(epochNo));
  if (epoch == null) {
    epoch = new Epoch(Bytes.fromI32(epochNo));

    const decisionWindow = epochsContract.getDecisionWindow();
    const duration = epochsContract.getEpochDuration();
    const epochEnd = epochsContract.getCurrentEpochEnd();
    const epochStart = epochEnd.minus(duration);

    epoch.epoch = epochNo;
    epoch.fromTs = epochStart;
    epoch.toTs = epochEnd;
    epoch.duration = duration;
    epoch.decisionWindow = decisionWindow;

    epoch.save();
  }
}
