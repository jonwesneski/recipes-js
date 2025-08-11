import type { UserEntity, UserEntityDiet } from '@repo/codegen/model';
import { createStore } from 'zustand/vanilla';

export type UserState = Omit<UserEntity, 'createdAt' | 'updatedAt'>;

export type UserActions = {
  setUseFractions: (_useFractions: boolean) => void;
  setUseImperial: (_useImperial: boolean) => void;
  setUseDarkMode: (_useDarkMode: boolean) => void;
  setDiet: (_diet: UserEntityDiet) => void;
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
    setUseFractions: (useFractions: boolean) => set(() => ({ useFractions })),
    setUseImperial: (useImperial: boolean) => set(() => ({ useImperial })),
    setUseDarkMode: (useDarkMode: boolean) => set(() => ({ useDarkMode })),
    setDiet: (diet: UserEntityDiet) => set(() => ({ diet })),
  }));
};
