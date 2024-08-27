import { FC } from "react";
import Section from "./Section";

const ProviderInfoSection: FC = () => {
  return (
    <Section title="Wallet Provider Info">
      <div className="flex gap-2">
        <div className="flex-1 overflow-hidden">
          <div className="font-bold">DeviceInfo</div>
          <pre className="mt-2 bg-base-200 p-2 rounded-md overflow-auto">
            {JSON.stringify((window as any).hibitid?.tonconnect.deviceInfo ?? '', null, 2)}
          </pre>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="font-bold">WalletInfo</div>
          <pre className="mt-2 bg-base-200 p-2 rounded-md overflow-auto">
            {JSON.stringify((window as any).hibitid?.tonconnect.walletInfo ?? '', null, 2)}
          </pre>
        </div>
      </div>
    </Section>
  )
}

export default ProviderInfoSection;
