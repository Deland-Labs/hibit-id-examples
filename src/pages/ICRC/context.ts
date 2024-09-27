import React from "react";
import { IcrcPermissionState } from "./types";

export const IcrcContext = React.createContext<{
  iframeWindow: Window | null;
  icrc29Ready: boolean;
  icrc25Permissions: Record<string, IcrcPermissionState>
  setIcrc29Ready: (icrc29Ready: boolean) => void;
  setIcrc25Permissions: (icrc25Permissions: Record<string, IcrcPermissionState>) => void;
  getRequestId: () => number
}>({
  iframeWindow: null,
  icrc29Ready: false,
  icrc25Permissions: {},
  setIcrc29Ready: () => {},
  setIcrc25Permissions: () => {},
  getRequestId: () => 0,
})
