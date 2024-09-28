import React from "react";
import { IcrcPermissionState } from "./types";

export const IcrcContext = React.createContext<{
  signerWindow: Window | null;
  signerOrigin: string;
  icrc29Ready: boolean;
  icrc25Permissions: Record<string, IcrcPermissionState>
  showHibitIdModal: boolean
  signerPrincipal: string
  setIcrc29Result: (icrc29Ready: boolean, origin: string) => void;
  setIcrc25Permissions: (icrc25Permissions: Record<string, IcrcPermissionState>) => void;
  getRequestId: () => number
  setShowHibitIdModal: (showHibitIdModal: boolean) => void
  setSignerPrincipal: (signerPrincipal: string) => void
}>({
  signerWindow: null,
  signerOrigin: '',
  icrc29Ready: false,
  icrc25Permissions: {},
  showHibitIdModal: false,
  signerPrincipal: '',
  setIcrc29Result: () => {},
  setIcrc25Permissions: () => {},
  getRequestId: () => 0,
  setShowHibitIdModal: () => {},
  setSignerPrincipal: () => {},
})
