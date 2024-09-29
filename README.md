# Hibit ID Examples
This project showcases how to integrate Hibit ID into Dapp using chain specific protocols.
Currently support:
- TonConnect
- Dfinity ICRC 29 Window Post Message Transport

## TonConnect Example

### Installation

Before install packages, add following config to your `.npmrc`

```bash
@deland-labs:registry=https://gitlab.com/api/v4/projects/37663507/packages/npm/
```

Then install HibitID SDK and TonConnect SDK

```bash
yarn add @deland-labs/hibit-id-sdk @tonconnect/ui
```

### Usage

Since Hibit ID is an embedded wallet rather than a browser extension, the TonConnect provider needs to be manually injected first.

Then just follow TonConnect documents to integrate the wallet into your dapp.

```js
import { injectHibitIdTonConnect } from "@deland-labs/hibit-id-sdk"
// remember to import styles for the wallet
import '@deland-labs/hibit-id-sdk/dist/style.css';
import { CHAIN, TonConnect, TonConnectUI } from "@tonconnect/ui"

// manually inject wallet provider
injectHibitIdTonConnect(CHAIN.TESTNET)

// init tonconnect sdk 
const connector = new TonConnect({
  walletsListSource: `${location.origin}/wallets.json`
})
const client: TonConnectUI = (window as any).tonCache || new TonConnectUI({
  manifestUrl: `${location.origin}/tonconnect-manifest.json`,
  connector,
})

// client.openModal()
// client.sendTransaction()
// ...
```

## ICRC 29 Window Post Message Transport Example
Currently supported standards:
- ICRC 25
- ICRC 27
- ICRC 29
- ICRC 32
- ICRC 49

Refer to `relying party` directions in each standard definition of [Official Standards](https://github.com/dfinity/wg-identity-authentication/tree/main)
