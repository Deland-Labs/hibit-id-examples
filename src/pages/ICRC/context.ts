import React from "react";
import { IcrcPermissionState } from "./types";

export const IcrcContext = React.createContext<{
  signerWindow: Window | null;
  signerOrigin: string;
  icrc29Ready: boolean;
  icrc25Permissions: Record<string, IcrcPermissionState>
  setIcrc29Result: (icrc29Ready: boolean, origin: string) => void;
  setIcrc25Permissions: (icrc25Permissions: Record<string, IcrcPermissionState>) => void;
  getRequestId: () => number
}>({
  signerWindow: null,
  signerOrigin: '',
  icrc29Ready: false,
  icrc25Permissions: {},
  setIcrc29Result: () => {},
  setIcrc25Permissions: () => {},
  getRequestId: () => 0,
})
