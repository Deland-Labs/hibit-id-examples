import { IcrcMethods, JsonRpcRequest, JsonRpcResponseSuccess } from "./types"

export const parseJsonRpcResponse = <T>(data: any, reqId: number): JsonRpcResponseSuccess<T> | null => {
  if (typeof data !== 'object') {
    console.debug('Invalid JSON-RPC response: malformed data, ignored')
    return null
  }
  if (data.jsonrpc !== '2.0') {
    console.debug('Invalid JSON-RPC response: invalid JRPC version, ignored')
    return null
  }
  if (data.id !== reqId) {
    console.debug('Invalid JSON-RPC response: unmatched request ID, ignored')
    return null
  }
  if (data.error) {
    throw data
  }
  return data as JsonRpcResponseSuccess<T>
}

export const buildJsonRpcRequest = <TRequest extends JsonRpcRequest>(id: number, method: IcrcMethods, params: TRequest['params']): TRequest => {
  return {
    id,
    jsonrpc: '2.0',
    method,
    params,
  } as TRequest
}
