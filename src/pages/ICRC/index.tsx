import { FC, useCallback, useRef, useState } from "react";
import HibitIdModal from "./HibitIdModal";
import { IcrcContext } from "./context";
import { IcrcPermissionState } from "./types";
import Icrc29Section from "./Icrc29Section";
import Icrc25RequestPermissionsSection from "./Icrc25RequestPermissionsSection";
import Icrc25PermissionsSection from "./Icrc25PermissionsSection";
import Icrc25SupportedStandardsSection from "./Icrc25SupportedStandardsSection";
import Icrc27AccountsSection from "./Icrc27AccountsSection";
import Icrc32SignChallengeSection from "./Icrc32SignChallengeSection";
import Icrc49CallCanisterSection from "./Icrc49CallCanisterSection";

const IcrcPage: FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null)
  const [signerOrigin, setSignerOrigin] = useState<string>('')
  const [signerPrincipal, setSignerPrincipal] = useState<string>('')
  const [icrc29Ready, setIcrc29Ready] = useState(false)
  const [icrc25Permissions, setIcrc25Permissions] = useState<Record<string, IcrcPermissionState>>({})
  const reqIdRef = useRef(1)

  const getRequestId = useCallback(() => {
    const id = reqIdRef.current
    reqIdRef.current += 1
    return id
  }, [])

  const setIcrc29Result = useCallback((ready: boolean, origin: string) => {
    setIcrc29Ready(ready)
    setSignerOrigin(origin)
  }, [])

  return (
    <IcrcContext.Provider value={{
      signerWindow: iframe?.contentWindow ?? null,
      signerOrigin,
      icrc29Ready,
      showHibitIdModal: showModal,
      signerPrincipal,
      setIcrc29Result,
      icrc25Permissions,
      setIcrc25Permissions,
      getRequestId,
      setShowHibitIdModal: setShowModal,
      setSignerPrincipal,
    }}>
      <div className="container p-6 mx-auto">
        <h1 className="flex justify-center items-center gap-2 font-bold text-xl">
          <img src={import.meta.env.BASE_URL + 'logo.png'} alt="logo" className="size-8" />
          <span>Hibit ID Dfinity ICRC Example</span>
        </h1>
        <main className="mt-8 flex flex-col gap-6">
          <Icrc29Section />
          <Icrc25RequestPermissionsSection />
          <Icrc25PermissionsSection />
          <Icrc25SupportedStandardsSection />
          <Icrc27AccountsSection />
          <Icrc32SignChallengeSection />
          <Icrc49CallCanisterSection />
          <HibitIdModal ref={setIframe} open={showModal} />
        </main>
      </div>
    </IcrcContext.Provider>
  )
}

export default IcrcPage
