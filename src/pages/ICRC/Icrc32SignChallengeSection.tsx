import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import Section from "../../components/Section";
import { buildJsonRpcRequest, parseJsonRpcResponse } from "./utils";
import { Icrc32SignChallengeRequest, Icrc32SignChallengeResult, IcrcMethods, IcrcPermissionState } from "./types";
import { IcrcContext } from "./context";

const Icrc32SignChallengeSection: FC = () => {
  const [challenge, setChallenge] = useState('TestChallenge')
  const [request, setRequest] = useState<any | null>(null)
  const [response, setResponse] = useState<any | null>(null)
  const { signerWindow, signerOrigin, signerPrincipal, icrc29Ready, icrc25Permissions, setShowHibitIdModal, getRequestId } = useContext(IcrcContext)
  const reqIdRef = useRef(0)

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const response = parseJsonRpcResponse<Icrc32SignChallengeResult>(event.data, reqIdRef.current)
      if (!response) {
        return
      }
      setResponse(response)
    } catch (e) {
      setResponse(e)
    } finally {
      setShowHibitIdModal(false)
    }
  }, [setShowHibitIdModal])

  const sendRequest = () => {
    setShowHibitIdModal(true)
    reqIdRef.current = getRequestId()
    const req = buildJsonRpcRequest<Icrc32SignChallengeRequest>(reqIdRef.current, IcrcMethods.ICRC32_SIGN_CHALLENGE, {
      principal: signerPrincipal,
      challenge
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
    <Section title="ICRC 32 Sign Challenge">
      <div className="flex gap-2">
        <div className="flex flex-col gap-2">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Principal</span>
            </div>
            <input className="input input-bordered w-full max-w-xs" value={signerPrincipal} disabled />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Challenge</span>
            </div>
            <input className="input input-bordered w-full max-w-xs" value={challenge} onChange={(e) => setChallenge(e.target.value)} />
          </label>
          <button
            className="btn btn-primary"
            onClick={sendRequest}
            disabled={
              !icrc29Ready
              || icrc25Permissions[IcrcMethods.ICRC32_SIGN_CHALLENGE] !== IcrcPermissionState.GRANTED
              || !signerPrincipal
              || !challenge
            }
          >
            Sign Challenge
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

export default Icrc32SignChallengeSection
