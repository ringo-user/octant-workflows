// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
require('dotenv').config();

const PROPOSALS_CID =
  process.env.PROPOSALS_CID || 'QmR3ZDNCdJbcQxy89JgNRZDEx3qDyDSu49Db9mxCEv2Snd/';
const PROPOSAL_ADDRESSES = process.env.PROPOSAL_ADDRESSES || [
  '0x5a873cB89BAd323b1acfd998C36aAc6b1a90a91d',
  '0x519a0307b7364D21aB1227bf37689271233B3F93',
  '0x839a14166Af647F9DD5CdeA616c0354286Cc1593',
  '0x6d614D51D1Ed4eE97A37614F431771Fdb92D5Ae7',
  '0x13aB14d9f8a40a0a19f7c8Ba8B23a3F12D25fD12',
  '0x608309bF063599DdaaF79409879917032377AC44',
  '0xBfD2704FEbD0d6A3f82Ed338731Fdf63077F76Fa',
  '0xdE49c0928ECC3cfb5d07F69f5C82949168Fc6805',
  '0xeAe7825257E71ba345FFcC54D0581ccE819738B9',
  '0x50b641Fb1CC42bE8a292263c68f0612b8182dA51',
];
const GOERLI_URL = process.env.GOERLI_URL || '';
const GOERLI_PRIVATE_KEY =
  process.env.GOERLI_PRIVATE_KEY ||
  '0000000000000000000000000000000000000000000000000000000000000000';
const GOERLI_GNT = process.env.GOERLI_GNT || '0x9d90f1Df10b797DB0D6368eCBFd8961798be5558';
const GOERLI_GLM = process.env.GOERLI_GLM || '0x4914bdFfFA96a3936304705eE41C2F5CbcAD7774';
const GOERLI_GLM_FAUCET =
  process.env.GOERLI_GLM_FAUCET || '0x7236eA6198F4eF69355DC5CB25F7f09E5439f754';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const EPOCH_DURATION = Number(process.env.EPOCH_DURATION) || 600;
const DECISION_WINDOW = Number(process.env.DECISION_WINDOW) || 600;
const IS_GAS_REPORTING_ENABLED = Boolean(process.env.IS_GAS_REPORTING_ENABLED) || true;
const MULTISIG_ADDRESS =
  process.env.MULTISIG_ADDRESS || '0x2cF28ec7f4B6CbF8CC052f56D9901a8a4AdFfd6c';

export {
  PROPOSALS_CID,
  PROPOSAL_ADDRESSES,
  MULTISIG_ADDRESS,
  GOERLI_URL,
  GOERLI_PRIVATE_KEY,
  GOERLI_GNT,
  GOERLI_GLM,
  GOERLI_GLM_FAUCET,
  ETHERSCAN_API_KEY,
  EPOCH_DURATION,
  DECISION_WINDOW,
  IS_GAS_REPORTING_ENABLED,
};