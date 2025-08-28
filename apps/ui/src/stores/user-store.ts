import type { UserEntity } from '@repo/codegen/model';
import { usersControllerUpdateUserV1 } from '@repo/codegen/users';
import { createStore } from 'zustand/vanilla';

export type UserState = Omit<UserEntity, 'createdAt' | 'updatedAt' | 'diet'>;

export type UserActions = {
  setUseFractions: (_useFractions: boolean) => Promise<void>;
  setUseImperial: (_useImperial: boolean) => Promise<void>;
  setUseDarkMode: (_useDarkMode: boolean) => Promise<void>;
  // setDiet: (_diet: UserEntityDiet) => Promise<void>;
  setUseGuest: () => void;
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
  imageUrl: '',
  // diet: null,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set, get) => ({
    ...initState,

    setUseFractions: async (useFractions: boolean) => {
      const id = get().id;
      if (id) {
        await usersControllerUpdateUserV1(id, { useFractions });
      } else {
        localStorage.setItem('useFractions', useFractions.toString());
      }
      set(() => ({ useFractions }));
    },
    setUseImperial: async (useImperial: boolean) => {
      const id = get().id;
      if (id) {
        await usersControllerUpdateUserV1(id, { useImperial });
      } else {
        localStorage.setItem('useImperial', useImperial.toString());
      }
      set(() => ({ useImperial }));
    },
    setUseDarkMode: async (useDarkMode: boolean) => {
      const id = get().id;
      if (id) {
        await usersControllerUpdateUserV1(id, { useDarkMode });
      } else {
        localStorage.setItem('useDarkMode', useDarkMode.toString());
      }
      set(() => ({ useDarkMode }));
    },
    // setDiet: async (diet: UserEntityDiet) => {
    //   await usersControllerUpdateUserV1(get().id, {});
    //   set(() => ({ diet }));
    // },
    setUseGuest: () => {
      localStorage.clear();
    },
  }));
};
