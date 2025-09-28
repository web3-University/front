import { create } from "zustand";

import type { WalletProfile } from "@/lib/types";

type WalletState = {
  profile?: WalletProfile;
};

type WalletActions = {
  setProfile: (profile?: WalletProfile) => void;
};

export const useWalletStore = create<WalletState & WalletActions>((set) => ({
  profile: undefined,
  setProfile: (profile) => set({ profile }),
}));
