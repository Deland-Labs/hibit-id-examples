import { injectHibitIdTonConnect } from "@deland-labs/hibit-id-sdk"
import '@deland-labs/hibit-id-sdk/dist/style.css';
import { CHAIN, TonConnect, TonConnectUI } from "@tonconnect/ui"
import { useEffect, useState } from "react"
import ProviderInfoSection from "./components/ProviderInfoSection";
import ConnectSection from "./components/ConnectSection";
import SendTransactionSection from "./components/SendTransactionSection";

function App() {
  const [tonConnectUi, setTonConnectUi] = useState<TonConnectUI | null>(null)

  useEffect(() => {
    // inject provider before connect call
    injectHibitIdTonConnect(CHAIN.TESTNET)

    // init tonconnect sdk 
    const connector = new TonConnect({
      walletsListSource: `${location.origin}/wallets.json`
    })
    const client: TonConnectUI = (window as any).tonCache || new TonConnectUI({
      manifestUrl: `${location.origin}/tonconnect-manifest.json`,
      connector,
    });
    (window as any).tonCache = client
    setTonConnectUi(client)
  }, [])

  return (
    <div className="container p-6 mx-auto">
      <h1 className="flex justify-center items-center gap-2 font-bold text-xl">
        <img src="/logo.png" alt="logo" className="size-8" />
        <span>Hibit ID TonConnect Example</span>
      </h1>
      <main className="mt-8 flex flex-col gap-6">
        <ProviderInfoSection />

        {tonConnectUi && (
          <>
            <ConnectSection client={tonConnectUi} />
            <SendTransactionSection client={tonConnectUi} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
