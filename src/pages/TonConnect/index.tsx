import { injectHibitIdTonConnect } from "@deland-labs/hibit-id-sdk"
import '@deland-labs/hibit-id-sdk/dist/style.css';
import { CHAIN, TonConnect, TonConnectUI } from "@tonconnect/ui"
import { useEffect, useState } from "react"
import ProviderInfoSection from "./ProviderInfoSection";
import ConnectSection from "./ConnectSection";
import SendTransactionSection from "./SendTransactionSection";

function TonConnectPage() {
  const [tonConnectUi, setTonConnectUi] = useState<TonConnectUI | null>(null)

  useEffect(() => {
    // inject provider before connect call
    injectHibitIdTonConnect(CHAIN.TESTNET)

    // init tonconnect sdk 
    const baseUrl = new URL(import.meta.env.BASE_URL, location.origin)
    const connector = new TonConnect({
      walletsListSource: `${baseUrl}wallets.json`,
    })
    const client: TonConnectUI = (window as any).tonCache || new TonConnectUI({
      manifestUrl: `${baseUrl}tonconnect-manifest.json`,
      connector,
    });
    (window as any).tonCache = client
    setTonConnectUi(client)
  }, [])

  return (
    <div className="container p-6 mx-auto">
      <h1 className="flex justify-center items-center gap-2 font-bold text-xl">
        <img src={import.meta.env.BASE_URL + 'logo.png'} alt="logo" className="size-8" />
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

export default TonConnectPage
