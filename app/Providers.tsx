"use client";

import {ClerkProvider} from "@clerk/nextjs";
import {QueryCache, QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error:any) =>
            console.log(error),
    }),
})

export const Provider = ({children}: { children: React.ReactNode }) => {
    return (
        <ClerkProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ClerkProvider>
    );
};
