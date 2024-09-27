import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import Section from "../../components/Section";
import { buildJsonRpcRequest, parseJsonRpcResponse } from "./utils";
import { Icrc29StatusRequest, Icrc29StatusResult, IcrcMethods } from "./types";
import { IcrcContext } from "./context";

const Icrc29Section: FC = () => {
  const [request, setRequest] = useState<any | null>(null)
  const [response, setResponse] = useState<any | null>(null)
  const { iframeWindow, getRequestId } = useContext(IcrcContext)
  const reqIdRef = useRef(0)

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const response = parseJsonRpcResponse<Icrc29StatusResult>(event.data, reqIdRef.current)
      setResponse(response)
    } catch (e) {
      setResponse(e)
    }
  }, [])

  const sendMessage = () => {
    reqIdRef.current = getRequestId()
    const req = buildJsonRpcRequest<Icrc29StatusRequest>(reqIdRef.current, IcrcMethods.ICRC29_STATUS, undefined)
    setRequest(req)
    iframeWindow?.postMessage(
      req,
      '*',
    )
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
            onClick={sendMessage}
          >
            Send message
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
