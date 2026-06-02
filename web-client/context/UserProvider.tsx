"use client"

import { getUser, logoutUser, resetUserApi } from "./api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext} from "react";

export type User = {
  username: string;
  email: string;
  accessToken: string;
  profilePicture: string;
  credits: number;
  _id: string;
  provider: string;
}
interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  resetUser: () => void;
}

export const userContext = createContext<UserContextType | null>(null);



export const UserProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();

  //1. Fetch user data using useQuery
  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['getUser'],
    queryFn: getUser
  })

  // 2. Derive your state directly from the query cache
  const user = data?.SUCCESS && data?.DATA ? data.DATA.user : null;
  const isAuthenticated = !!user;
  const error = queryError ? String(queryError) : null;


  const resetUser = async () => {
    await resetUserApi();
    // Invalidate forces all tabs looking at 'getUser' to refetch next time they are focused
    queryClient.invalidateQueries({ queryKey: ['getUser'] }); 
  };

  const doLogout = useMutation({
    mutationFn: async () => {
      const res = await logoutUser();
      return res;
    },
    onSuccess: (res: any) => {
      if (!res.SUCCESS) return;
      // Clear the cache instantly. This forces 'user' to become null.
      queryClient.setQueryData(['getUser'], null); 
      // Also invalidate so other tabs know the data is gone
      queryClient.invalidateQueries({ queryKey: ['getUser'] });
      window.location.href = '/';
    }
  });


  const logout = useCallback(() => {
    doLogout.mutate();
  }, [doLogout]);

  return (
   <userContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      error, 
      logout, 
      resetUser 
    }}>
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
