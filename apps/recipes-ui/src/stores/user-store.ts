/* eslint-disable @typescript-eslint/no-confusing-void-expression, no-unused-vars -- its fine zustand */
import { createStore } from 'zustand/vanilla';

export type UserState = {
  email: string;
  isGuest: boolean;
  useFractions: boolean;
  useImperial: boolean;
};

export type UserActions = {
  setEmail: (email: string) => void;
  setUseFractions: (useFractions: boolean) => void;
  setUseImperial: (useImperial: boolean) => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  email: '',
  isGuest: true,
  useFractions: true,
  useImperial: false,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setEmail: (email: string) => set(() => ({ email })),
    setUseFractions: (useFractions: boolean) => set(() => ({ useFractions })),
    setUseImperial: (useImperial: boolean) => set(() => ({ useImperial })),
  }));
};
