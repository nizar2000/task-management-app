import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { RetryLink } from '@apollo/client/link/retry';

export const createApolloClient = (token) => {
  const batchHttpLink = new BatchHttpLink({
    uri: 'https://backend-jke87vgie-nizarabidi1919-gmailcoms-projects.vercel.app/graphql',
    credentials: 'same-origin',
    batchMax: 10, // Maximum of 10 requests per batch
    batchInterval: 10, // Batch requests within a 10ms window
  });
  

  const retryLink = new RetryLink({
    attempts: {
      max: 3, // Retry a maximum of 3 times
      retryIf: (error, _operation) => !!error, // Retry only if there's an error
    },
    delay: {
      initial: 300, // Start with 300ms delay
      max: 2000, // Maximum delay of 2 seconds
      jitter: true, // Add randomness to prevent thundering herd
    },
  });
  

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));

  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          reminders: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...incoming];
            },
          },
          tasks: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...incoming];
            },
          },
        },
      },
    },
  });

  return new ApolloClient({
    link: retryLink.concat(authLink).concat(batchHttpLink),
    cache: cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network', // Ensures data is first served from the cache and then updated from the network
      },
      query: {
        fetchPolicy: 'cache-first', // Use cache first to reduce load on the server
      },
    },
  });
};
