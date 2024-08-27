import { FC, useEffect, useState } from "react";
import Section from "./Section";
import { ConnectedWallet, TonConnectUI } from "@tonconnect/ui";

const ConnectSection: FC<{ client: TonConnectUI }> = ({ client}) => {
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet | null>(null)
  
  const handleConnect = async () => {
    client.openModal()
  }

  const handleDisconnect = async () => {
    client.disconnect()
  }

  useEffect(() => {
    // register event listener
    const unsubscribeHandler = client.onStatusChange((wallet) => {
      // disconnected
      if (!wallet) {
        setConnectedWallet(null)
        return;
      }
      // connected
      setConnectedWallet(wallet)
    });

    return () => {
      unsubscribeHandler()
    }
  }, [client])

  return (
    <Section title="Connect Wallet">
      <div className="flex gap-2">
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
            onClick={handleDisconnect}
            disabled={!connectedWallet}
          >
            Disconnect
          </button>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="flex-1 overflow-hidden">
          <div className="font-bold">WalletAccount</div>
          <pre className="mt-2 bg-base-200 p-2 rounded-md overflow-auto">
            {JSON.stringify(connectedWallet?.account ?? '', null, 2)}
          </pre>
        </div>
      </div>
    </Section>
  )
}

export default ConnectSection;
