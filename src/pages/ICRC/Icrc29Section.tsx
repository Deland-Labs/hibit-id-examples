import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import Section from "../../components/Section";
import { buildJsonRpcRequest, parseJsonRpcResponse } from "./utils";
import { Icrc29StatusRequest, Icrc29StatusResult, IcrcMethods } from "./types";
import { IcrcContext } from "./context";

const Icrc29Section: FC = () => {
  const [request, setRequest] = useState<any | null>(null)
  const [response, setResponse] = useState<any | null>(null)
  const [polling, setPolling] = useState(false)
  const { iframeWindow, getRequestId, setIcrc29Ready } = useContext(IcrcContext)
  const reqIdRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timer | null>(null)

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const response = parseJsonRpcResponse<Icrc29StatusResult>(event.data, reqIdRef.current)
      if (!response) {
        return
      }
      setResponse(response)
      clearInterval(intervalRef.current!)
      setPolling(false)
      if (response?.result === 'ready') {
        setIcrc29Ready(true)
      }
    } catch (e) {
      setResponse(e)
    }
  }, [setIcrc29Ready])

  const startPolling = () => {
    setPolling(true)
    intervalRef.current = setInterval(() => {
      reqIdRef.current = getRequestId()
      const req = buildJsonRpcRequest<Icrc29StatusRequest>(reqIdRef.current, IcrcMethods.ICRC29_STATUS, undefined)
      setRequest(req)
      iframeWindow?.postMessage(
        req,
        '*',
      )
    }, 1000)
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [handleMessage])

  return (
    <Section title="ICRC 29 Status">
      <div className="flex gap-2">
        <div className="flex flex-col gap-2">
          <button
            className="btn btn-primary"
            onClick={startPolling}
            disabled={polling}
          >
            Start polling
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

export default Icrc29Section
