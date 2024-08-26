/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectHibitIdTonConnect } from "@deland-labs/hibit-id-sdk"
import '@deland-labs/hibit-id-sdk/dist/style.css';
import { CHAIN, ConnectedWallet, TonConnect, TonConnectUI } from "@tonconnect/ui"
import { useEffect, useState } from "react"

function App() {
  const [tonConnectUi, setTonConnectUi] = useState<TonConnectUI | null>(null)
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet | null>(null)

  useEffect(() => {
    // inject provider before connect call
    injectHibitIdTonConnect(CHAIN.TESTNET)

    // init tonconnect sdk
    const connector = new TonConnect({
      walletsListSource: `${location.origin}/wallets.json`
    })
    const client: TonConnectUI = (window as any).tonCache || new TonConnectUI({
      // manifestUrl: `${location.origin}/tonconnect-manifest.json`,
      connector,
    });
    (window as any).tonCache = client
    setTonConnectUi(client)

    // register event listener
    const unsubscribeHandler = client.onStatusChange((wallet) => {
      // disconnected
      if (!wallet) {
        // TODO:
        return;
      }
      // connected
      setConnectedWallet(wallet)
    });

    return () => {
      unsubscribeHandler()
    }
  }, [])

  const handleConnect = async () => {
    // tonConnectUi?.openSingleWalletModal('hibitid')
    tonConnectUi?.openModal()
  }

  return (
    <div className="container p-6 mx-auto">
      <h1 className="flex items-center gap-2 font-bold">
        <img src="/logo.png" alt="logo" className="size-8" />
        <span>Hibit ID TonConnect Example</span>
      </h1>
      <main className="mt-6 flex flex-col gap-6">
        <div className="form-control w-full">
          <div className="label">
            <span className="label-text text-lg font-bold">Connect</span>
          </div>
          <div className="p-4 flex gap-2 border rounded-lg overflow-hidden">
            <div className="flex flex-col gap-2">
              <button
                className="btn btn-primary"
                onClick={handleConnect}
                disabled={!!connectedWallet}
              >
                Connect
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConnect}
                disabled={!connectedWallet}
              >
                Disconnect
              </button>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="flex-1 overflow-hidden">
              <div className="font-bold">WalletInfo:</div>
              <pre className="mt-2 bg-base-200 p-2 rounded-md overflow-auto">
                {JSON.stringify(connectedWallet?.account ?? '', null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
