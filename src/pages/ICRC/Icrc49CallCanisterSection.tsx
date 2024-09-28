import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import Section from "../../components/Section";
import { buildJsonRpcRequest, parseJsonRpcResponse } from "./utils";
import { Icrc49CallCanisterRequest, Icrc49CallCanisterResult, IcrcMethods, IcrcPermissionState } from "./types";
import { IcrcContext } from "./context";

const Icrc49CallCanisterSection: FC = () => {
  const [canisterId, setCanisterId] = useState('')
  const [method, setMethod] = useState('')
  const [argBase64, setArgBase64] = useState('')
  const [request, setRequest] = useState<any | null>(null)
  const [response, setResponse] = useState<any | null>(null)
  const { signerWindow, signerOrigin, signerPrincipal, icrc29Ready, icrc25Permissions, setShowHibitIdModal, getRequestId } = useContext(IcrcContext)
  const reqIdRef = useRef(0)

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const response = parseJsonRpcResponse<Icrc49CallCanisterResult>(event.data, reqIdRef.current)
      if (!response) {
        return
      }
      setShowHibitIdModal(false)
      setResponse(response)
    } catch (e) {
      setResponse(e)
    }
  }, [setShowHibitIdModal])

  const sendRequest = () => {
    setShowHibitIdModal(true)
    reqIdRef.current = getRequestId()
    const req = buildJsonRpcRequest<Icrc49CallCanisterRequest>(reqIdRef.current, IcrcMethods.ICRC49_CALL_CANISTER, {
      sender: signerPrincipal,
      canisterId,
      method,
      arg: argBase64,
    })
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
    <Section title="ICRC 49 Call Canister">
      <div className="flex gap-2">
        <div className="flex flex-col gap-2">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Sender</span>
            </div>
            <input className="input input-bordered w-full max-w-xs" value={signerPrincipal} disabled />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Canister Id</span>
            </div>
            <input className="input input-bordered w-full max-w-xs" value={canisterId} onChange={(e) => setCanisterId(e.target.value)} />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Method</span>
            </div>
            <input className="input input-bordered w-full max-w-xs" value={method} onChange={(e) => setMethod(e.target.value)} />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Arg(base64)</span>
            </div>
            <input className="input input-bordered w-full max-w-xs" value={argBase64} onChange={(e) => setArgBase64(e.target.value)} />
          </label>
          <button
            className="btn btn-primary"
            onClick={sendRequest}
            disabled={
              !icrc29Ready
              || icrc25Permissions[IcrcMethods.ICRC49_CALL_CANISTER] !== IcrcPermissionState.GRANTED
              || !signerPrincipal
              || !canisterId
              || !method
            }
          >
            Call Canister
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

export default Icrc49CallCanisterSection
