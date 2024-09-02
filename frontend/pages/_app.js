import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '@/lib/client'; // Adjust the path if needed
import { AuthProvider } from '@/context/AuthContext';
import "@/styles/globals.css";
import { SessionProvider, useSession } from 'next-auth/react';
import React, { useMemo } from 'react';
import { appWithTranslation } from 'next-i18next';
import Loading from '@/components/loading';

const ApolloClientProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const client = useMemo(() => createApolloClient(token), [token]);

  if (status === 'loading') {
    return <Loading />;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

function MyApp({ Component, pageProps }) {
  return (
    <React.StrictMode>
      <SessionProvider session={pageProps.session}>
        <ApolloClientProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </ApolloClientProvider>
      </SessionProvider>
    </React.StrictMode>
  );
}

export default appWithTranslation(MyApp);
