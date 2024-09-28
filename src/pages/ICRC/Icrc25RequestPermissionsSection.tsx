import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import Section from "../../components/Section";
import { buildJsonRpcRequest, parseJsonRpcResponse } from "./utils";
import { Icrc25RequestPermissionsRequest, Icrc25RequestPermissionsResult, IcrcMethods, IcrcPermissionState } from "./types";
import { IcrcContext } from "./context";

const Icrc25RequestPermissionsSection: FC = () => {
  const [request, setRequest] = useState<any | null>(null)
  const [response, setResponse] = useState<any | null>(null)
  const [selectedScopes, setSelectedScopes] = useState<IcrcMethods[]>([
    IcrcMethods.ICRC27_ACCOUNTS,
    IcrcMethods.ICRC32_SIGN_CHALLENGE,
    IcrcMethods.ICRC49_CALL_CANISTER,
  ])
  const { signerWindow, signerOrigin, icrc29Ready, getRequestId, setIcrc25Permissions } = useContext(IcrcContext)
  const reqIdRef = useRef(0)

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const response = parseJsonRpcResponse<Icrc25RequestPermissionsResult>(event.data, reqIdRef.current)
      if (!response) {
        return
      }
      setResponse(response)
      if (response.result) {
        const permissions: Record<string, IcrcPermissionState> = {}
        response.result.scopes.forEach((scope) => {
          permissions[scope.scope.method] = scope.state
        })
        setIcrc25Permissions(permissions)
      }
    } catch (e) {
      setResponse(e)
    }
  }, [setIcrc25Permissions])

  const sendRequest = () => {
    reqIdRef.current = getRequestId()
    const req = buildJsonRpcRequest<Icrc25RequestPermissionsRequest>(reqIdRef.current, IcrcMethods.ICRC25_REQUEST_PERMISSIONS, {
      scopes: selectedScopes.map((method) => ({ method }))
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
    <Section title="ICRC 25 Request Permissions">
      <div className="flex gap-2">
        <div className="flex flex-col gap-2">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">{IcrcMethods.ICRC27_ACCOUNTS}</span>
              <input type="checkbox" className="checkbox" checked={selectedScopes.includes(IcrcMethods.ICRC27_ACCOUNTS)} onChange={(e) => {
                if (e.target.checked) {
                  setSelectedScopes([...selectedScopes, IcrcMethods.ICRC27_ACCOUNTS])
                } else {
                  setSelectedScopes(selectedScopes.filter((method) => method !== IcrcMethods.ICRC27_ACCOUNTS))
                }
              }}/>
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">{IcrcMethods.ICRC32_SIGN_CHALLENGE}</span>
              <input type="checkbox" className="checkbox" checked={selectedScopes.includes(IcrcMethods.ICRC32_SIGN_CHALLENGE)} onChange={(e) => {
                if (e.target.checked) {
                  setSelectedScopes([...selectedScopes, IcrcMethods.ICRC32_SIGN_CHALLENGE])
                } else {
                  setSelectedScopes(selectedScopes.filter((method) => method !== IcrcMethods.ICRC32_SIGN_CHALLENGE))
                }
              }} />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">{IcrcMethods.ICRC49_CALL_CANISTER}</span>
              <input type="checkbox" className="checkbox" checked={selectedScopes.includes(IcrcMethods.ICRC49_CALL_CANISTER)} onChange={(e) => {
                if (e.target.checked) {
                  setSelectedScopes([...selectedScopes, IcrcMethods.ICRC49_CALL_CANISTER])
                } else {
                  setSelectedScopes(selectedScopes.filter((method) => method !== IcrcMethods.ICRC49_CALL_CANISTER))
                }
              }} />
            </label>
          </div>
          <button
            className="btn btn-primary"
            onClick={sendRequest}
            disabled={!icrc29Ready}
          >
            Request Permissions
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

export default Icrc25RequestPermissionsSection
