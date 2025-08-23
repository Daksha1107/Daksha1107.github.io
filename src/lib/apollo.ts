import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_HTTP,
});

const wsLink = typeof window !== 'undefined' ? new GraphQLWsLink(
  createClient({
    url: process.env.NEXT_PUBLIC_HASURA_WS || '',
    connectionParams: () => ({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
      },
    }),
  })
) : null;

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const splitLink = typeof window !== 'undefined' && wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      authLink.concat(httpLink)
    )
  : authLink.concat(httpLink);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          messages: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          chats: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'ignore',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});