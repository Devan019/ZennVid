import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  username: string;
  email: string;
  accessToken?: string;
}

type AuthState = {
  user : User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login : (userData : User) => void;
  logout: () => void;
}

const useAuthStore =  create<AuthState>()(
  persist(
    (set,get) => ({
      user : null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setError(error) {
          set({error});
      },
      setIsAuthenticated(isAuthenticated) {
          set({isAuthenticated});
      },
      setIsLoading(isLoading) {
          set({isLoading});
      },
      setUser(user) {
          set({user});
      },
      login(userData) {
        set({user: userData, isAuthenticated: true, isLoading: false, error: null});
      },
      logout() {
        set({user: null, isAuthenticated: false, isLoading: false, error: null});
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage key
    }
  )
)