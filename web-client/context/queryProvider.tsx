"use client"
import { createContext, useContext } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()


interface QueryProviderContext {
  queryClient: QueryClient;
}
export type { QueryProviderContext };

export const QueryProvider = createContext<QueryProviderContext | undefined>(undefined);

export const QueryClientProviderWrapper = ({children}:{
  children: React.ReactNode;
}) => {
  return(
    <QueryProvider.Provider value={{ queryClient }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </QueryProvider.Provider>
  )
}

export default function useQueryClient(): QueryClient {
  const context = useContext(QueryProvider);
  if (!context) {
    throw new Error("useQueryClient must be used within a QueryProvider");
  }
  return context.queryClient;
}