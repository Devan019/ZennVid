"use client"

import { getUser, logoutUser } from "@/lib/apiProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

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
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const userContext = createContext<UserContextType | null>(null);



export const UserProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const UserQuery = useQuery({
    queryKey: ['getUser'],
    queryFn: getUser,
    enabled: false,
  })

  async function fetchUser() {
    setIsLoading(true);
    setError(null);
    const { data } = await UserQuery.refetch();
    if (!data.SUCCESS) {
      toast.error(data.MESSAGE);
      return;
    }
    toast.success(data.MESSAGE);
    if (data?.DATA) { 
      setUser(data.DATA.user);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    if (!user && !isAuthenticated) {
      fetchUser();
    }
  }, [user, isLoading]);

  const doLogout = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      setError(null);
      const data = await logoutUser();
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return data;
    },
    onSuccess: (data: any) => {
      if (!data.SUCCESS) {
        toast.error(data.MESSAGE);
        return;
      }
      toast.success(data.MESSAGE);
      setUser(null);
      setIsAuthenticated(false);
    },
    onError: (error: any) => {
      setError(error.message || "Failed to logout");
    },
  });


  const logout = useCallback(() => {
    doLogout.mutate();
    window.location.href = '/';
  }, [doLogout]);

  return (
    <userContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, isLoading, setIsLoading, error, setError, logout }}>
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
