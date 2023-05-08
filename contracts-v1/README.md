## Introduction

Contracts-v1 is a part of gradual rollout of Octant. It contains a minimal set of contracts needed to make Octant work. Rest of functionality is currently implemented on the server (see $ROOT/backend).

## Configuration

Ensure that the `.env`  file is present. See `.env.template`.

## Clean
```bash
yarn clean
```

## Compile
```bash
yarn compile
```

## Test
```bash
yarn test
```

## Format and lint
```bash
yarn format
yarn lint
```

## Documentation
Generate contracts documentation:
```bash
yarn docs
```
Go to `.docs` and open the `index.html` file in your browser.

## Deployment

---

**WARNING:** As of 2023-03-04 local environment runs into multiple issues when requesting data from contracts, making allocations or withdrawing funds. Please consider it as not stable.

---
### Local

1. In one terminal (continuous process):
```bash
yarn start-node
```
2. In second terminal:
```bash
yarn deploy:localhost
yarn prepare-local-test-env
```
`yarn prepare-local-test-env` outputs Alice's address, e.g.:
> Alice's address is  0x70997970C51812dc3A010C7d01b50e0d17dc79C8

This address can be used to retrieve account's private key from the beginning of `yarn start-node` output, search for e.g.:

```bash
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690
```

3. Add default Hardhat wallet to the MetaMask account. To do so, create new account in the browser with MetaMask plugin installed. Then either use private key mentioned above or use default mnemonic phrase `test test test test test test test test test test test junk` (if you didn't previously) to add it. Alice, which is used locally, should be one of the accounts in this wallet, probably number 2.
4. If needed, start frontend client by entering `client` directory and running `yarn dev:localcontracts`.

### Goerli testnet
```bash
yarn deploy:goerli
yarn verify:goerli
```

## GLM Faucet (Goerli)
Update `.env` with your private key:
```bash
GOERLI_PRIVATE_KEY=<your private key>
```
Send Test GLM.
```bash
npx hardhat --network goerli send-glm --recipient <recipient address>
```

## Publish typechain types
Login to Octant npm account, update a version in `typechain/package.json` and run following commands:
```bash
yarn compile
cd typechain
npm publish
```

## Known technical problems

Root `package.json` `yarn postinstall` command replaces `@nomiclabs/hardhat-ethers` with `hardhat-deploy-ethers`. This is due to the fact that the first package, although essential declares different methods for `ethers` than the latter package, causing unexpected type collision.