import type {
  MeasurementFormat,
  NumberFormat,
  UiTheme,
  UserEntity,
} from '@repo/codegen/model';
import { usersControllerUpdateUserV1 } from '@repo/codegen/users';
import { createStore } from 'zustand/vanilla';

export type UserState = Omit<UserEntity, 'createdAt' | 'updatedAt' | 'diet'>;

export type UserActions = {
  setNumberFormat: (_value: NumberFormat) => Promise<void>;
  setMeasurementFormat: (_value: MeasurementFormat) => Promise<void>;
  setUiTheme: (_value: UiTheme) => Promise<void>;
  // setDiet: (_value: UserEntityDiet) => Promise<void>;
  setUseGuest: () => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  id: '',
  email: '',
  name: '',
  handle: '',
  numberFormat: 'default',
  measurementFormat: 'default',
  uiTheme: 'system',
  imageUrl: '',
  // diet: null,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set, get) => ({
    ...initState,
    setNumberFormat: async (numberFormat: NumberFormat) => {
      const id = get().id;
      if (id) {
        await usersControllerUpdateUserV1(id, { numberFormat });
      } else {
        localStorage.setItem('useFractions', numberFormat.toString());
      }
      set(() => ({ numberFormat }));
    },
    setMeasurementFormat: async (measurementFormat: MeasurementFormat) => {
      const id = get().id;
      if (id) {
        await usersControllerUpdateUserV1(id, { measurementFormat });
      } else {
        localStorage.setItem('measurementFormat', measurementFormat);
      }
      set(() => ({ measurementFormat }));
    },
    setUiTheme: async (uiTheme: UiTheme) => {
      const id = get().id;
      if (id) {
        await usersControllerUpdateUserV1(id, { uiTheme });
      } else {
        localStorage.setItem('uiTheme', uiTheme);
      }
      set(() => ({ uiTheme }));
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
