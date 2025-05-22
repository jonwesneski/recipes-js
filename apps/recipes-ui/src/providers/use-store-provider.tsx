'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import { type UserStore, createUserStore } from '../stores/user-store';

export type UserStoreApi = ReturnType<typeof createUserStore>;
export const UserStoreContext = createContext<UserStoreApi | null>(null);

export interface UserStoreProviderProps {
  children: ReactNode;
  initialState?: UserStore;
}

export const UserStoreProvider = ({ children, initialState }: UserStoreProviderProps) => {
    const storeRef = useRef<UserStoreApi | null>(null);
    
    if (!storeRef.current) {
        storeRef.current = createUserStore(initialState);
    }
    
    return (
        <UserStoreContext.Provider value={storeRef.current}>
            {children}
        </UserStoreContext.Provider>
    );
};

export const useUserStore = <T,>(
  selector: (store: UserStore) => T,
): T => {
    const store = useContext(UserStoreContext);
    if (!store) {
        throw new Error(`${useUserStore.name} must be used within a ${UserStoreProvider.name}`);
    }
    return useStore(store, selector);
};
