import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import Section from "../../components/Section";
import { buildJsonRpcRequest, parseJsonRpcResponse } from "./utils";
import { Icrc27AccountsRequest, Icrc27AccountsResult, IcrcMethods, IcrcPermissionState } from "./types";
import { IcrcContext } from "./context";

const Icrc27AccountsSection: FC = () => {
  const [request, setRequest] = useState<any | null>(null)
  const [response, setResponse] = useState<any | null>(null)
  const { signerWindow, signerOrigin, icrc29Ready, icrc25Permissions, setShowHibitIdModal, setSignerPrincipal, getRequestId } = useContext(IcrcContext)
  const reqIdRef = useRef(0)

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const response = parseJsonRpcResponse<Icrc27AccountsResult>(event.data, reqIdRef.current)
      if (!response) {
        return
      }
      setShowHibitIdModal(false)
      setResponse(response)
      setSignerPrincipal(response.result.accounts[0].owner)
    } catch (e) {
      setResponse(e)
    }
  }, [setShowHibitIdModal, setSignerPrincipal])

  const sendRequest = () => {
    setShowHibitIdModal(true)
    reqIdRef.current = getRequestId()
    const req = buildJsonRpcRequest<Icrc27AccountsRequest>(reqIdRef.current, IcrcMethods.ICRC27_ACCOUNTS, undefined)
    setRequest(req)
    signerWindow?.postMessage(
      req,
      signerOrigin,
    )
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [handleMessage])

  return (
    <Section title="ICRC 27 Accounts">
      <div className="flex gap-2">
        <div className="flex flex-col gap-2">
          <button
            className="btn btn-primary"
            onClick={sendRequest}
            disabled={!icrc29Ready || icrc25Permissions[IcrcMethods.ICRC27_ACCOUNTS] !== IcrcPermissionState.GRANTED}
          >
            Get Accounts
          </button>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="flex-1 overflow-hidden">
          <div>
            <div className="font-bold">request</div>
            <pre className="mt-2 bg-base-200 p-2 rounded-md overflow-auto">
              {JSON.stringify(request, null, 2)}
            </pre>
          </div>
          <div className="divider"></div>
          <div>
            <div className="font-bold">response</div>
            <pre className="mt-2 bg-base-200 p-2 rounded-md overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Icrc27AccountsSection
