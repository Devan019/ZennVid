"use client"

import { getUser } from "@/lib/apiProvider";
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  username: string;
  email: string;
  accessToken?: string;
  profilePicture?: string;
  points?: number;
  _id?: string;
  provider?: string;
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
}

export const userContext = createContext<UserContextType | null>(null);



export const UserProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      setError(null);
      const data = await getUser();
      console.log("User data fetched:", data);
      if (data) {
        setUser(data.DATA);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
      return data;
    },
    onSuccess: (data) => {
      console.log("User fetched successfully:", data);
    },
    onError: (error: any) => {
      console.log("Error fetching user:", error);
      setError(error.message || "Failed to fetch user");
      setIsAuthenticated(false);
    },
    onSettled:() =>{
      setIsLoading(false)
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(true);
      userMutation.mutate();
      setIsLoading(false);
    }
  }, []);

  return (
    <userContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, isLoading, setIsLoading, error, setError }}>
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
