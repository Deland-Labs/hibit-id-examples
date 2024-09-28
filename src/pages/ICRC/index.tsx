import { FC, useCallback, useRef, useState } from "react";
import HibitIdModal from "./HibitIdModal";
import { IcrcContext } from "./context";
import { IcrcPermissionState } from "./types";
import Icrc29Section from "./Icrc29Section";
import Icrc25RequestPermissionsSection from "./Icrc25RequestPermissionsSection";

const IcrcPage: FC = () => {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null)
  const [signerOrigin, setSignerOrigin] = useState<string>('')
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
      setIcrc29Result,
      icrc25Permissions,
      setIcrc25Permissions,
      getRequestId,
    }}>
      <div className="container p-6 mx-auto">
        <h1 className="flex justify-center items-center gap-2 font-bold text-xl">
          <img src={import.meta.env.BASE_URL + 'logo.png'} alt="logo" className="size-8" />
          <span>Hibit ID Dfinity ICRC Example</span>
        </h1>
        <main className="mt-8 flex flex-col gap-6">
          <Icrc29Section />
          <Icrc25RequestPermissionsSection />
          <HibitIdModal ref={setIframe} open={false} />
        </main>
      </div>
    </IcrcContext.Provider>
  )
}

export default IcrcPage
