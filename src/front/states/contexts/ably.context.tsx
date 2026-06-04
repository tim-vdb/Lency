"use client";

import { createContext, useContext } from "react";
import type * as Ably from "ably";

export const AblyContext = createContext<Ably.Realtime | null>(null);

export function useAblyClient() {
  return useContext(AblyContext);
}
