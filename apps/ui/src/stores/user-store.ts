/* eslint-disable no-unused-vars -- its fine zustand */
import type { UserEntity, UserEntityDiet } from '@repo/codegen/model';
import { createStore } from 'zustand/vanilla';

export type UserState = Omit<UserEntity, 'createdAt' | 'updatedAt'>;

export type UserActions = {
  setUser: (user: Partial<UserState>) => void;
  setUseFractions: (useFractions: boolean) => void;
  setUseImperial: (useImperial: boolean) => void;
  setUseDarkMode: (useDarkMode: boolean) => void;
  setDiet: (diet: UserEntityDiet) => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  id: '',
  email: '',
  name: '',
  handle: '',
  useFractions: false,
  useImperial: false,
  useDarkMode: false,
  diet: null,
  imageUrl: '',
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setUser: (user: Partial<UserState>) => () => ({ ...user }),
    setUseFractions: (useFractions: boolean) => set(() => ({ useFractions })),
    setUseImperial: (useImperial: boolean) => set(() => ({ useImperial })),
    setUseDarkMode: (useDarkMode: boolean) => set(() => ({ useDarkMode })),
    setDiet: (diet: UserEntityDiet) => set(() => ({ diet })),
  }));
};
