/* eslint-disable no-unused-vars -- its fine zustand */
import { type NutritionalFactsDto } from '@repo/recipes-codegen/model';
import { createStore } from 'zustand/vanilla';

export type UserState = {
  email: string;
  name: string;
  handle: string;
  useFractions: boolean;
  useImperial: boolean;
  useDarkMode: boolean;
  diet?: NutritionalFactsDto;
};

export type UserActions = {
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setHandle: (handle: string) => void;
  setUseFractions: (useFractions: boolean) => void;
  setUseImperial: (useImperial: boolean) => void;
  setUseDarkMode: (useDarkMode: boolean) => void;
  setDiet: (diet: NutritionalFactsDto) => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  email: '',
  name: '',
  handle: '',
  useFractions: false,
  useImperial: false,
  useDarkMode: false,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setEmail: (email: string) => set(() => ({ email })),
    setName: (name: string) => set(() => ({ name })),
    setHandle: (handle: string) => set(() => ({ handle })),
    setUseFractions: (useFractions: boolean) => set(() => ({ useFractions })),
    setUseImperial: (useImperial: boolean) => set(() => ({ useImperial })),
    setUseDarkMode: (useDarkMode: boolean) => set(() => ({ useDarkMode })),
    setDiet: (diet: NutritionalFactsDto) => set(() => ({ diet })),
  }));
};
