"use client";

import {ClerkProvider} from "@clerk/nextjs";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Provider = ({children}: { children: React.ReactNode }) => {
    return (
        <ClerkProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ClerkProvider>
    );
};