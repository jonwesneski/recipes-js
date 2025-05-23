import { ReactPortal } from 'react';
import { createStore } from 'zustand/vanilla';

type ModalType = {
  id: string;
  portal: ReactPortal;
};
export type ModalsState = {
  modals: ModalType[];
  modal: ModalType | null;
};

export type ModalActions = {
  addModal: (modal: ModalType) => void;
  removeModal: () => void; // remove first
  hasModal(id: string): boolean;
};

export type ModalStore = ModalsState & ModalActions;

export const defaultInitState: ModalsState = {
  modals: [],
  modal: null,
};

export const createModalStore = (initState: ModalsState = defaultInitState) => {
  return createStore<ModalStore>()((set, get) => ({
    ...initState,
    addModal: (modal: ModalType) =>
      set((state) => {
        const modals = [...state.modals, modal];
        let firstModal = state.modal;
        if (firstModal === null && modals.length === 1) {
          firstModal = modal;
        }
        return { modals, modal: firstModal };
      }),
    removeModal: () =>
      set((state) => {
        const modals = [...state.modals];
        modals.shift();
        let firstModal = state.modal;
        if (modals.length === 0) {
          firstModal = null;
        }
        return { modals, modal: firstModal };
      }),
    hasModal: (id: string) => {
      return get().modals.some((modal) => modal.id === id);
    },
  }));
};
