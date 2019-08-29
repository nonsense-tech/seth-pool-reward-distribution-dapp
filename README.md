# SETH Pool Reward Distribution DApp
## Description
[SIP-8](https://github.com/Synthetixio/SIPs/blob/master/SIPS/sip-8.md) proposes to formalise the distribution of staking rewards to Uniswap Liquidity Providers in the form of SNX tokens diverted from the inflationary supply. This DApp helps manage the process as proposed in SIP-8 through an m/n Gnosis multisig with a distributed set of signers from the set of sETH liquidity providers.

The dApp allows:
- Any signer to upload a CSV from the output of the sETH pool rewards validation script.
- Each additional signer to verify the tx data payload to ensure it has not been modified from the output of the validation script.
- Each signer to sign the tx once the payload has been confirmed as valid.
- Each Uniswap LP token holder to verify the rewards to be distributed to them

## Run
```
yarn
yarn start
```
