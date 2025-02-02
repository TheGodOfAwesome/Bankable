"use client";

import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, Suspense } from "react";

export const Providers = (props: PropsWithChildren) => {
  const queryClient = new QueryClient();
 
  const client = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID });

  
  const thirdwebProps = { // make sure all required component's inputs/Props keys&types match
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    activeChain: baseSepolia
  }

  return (
    <Suspense>
        <QueryClientProvider client={queryClient}>
            <ThirdwebProvider
                // clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
                // activeChain={baseSepolia}
                {...thirdwebProps}
            >
                {props.children}
            </ThirdwebProvider>
        </QueryClientProvider>
    </Suspense>
  );
};