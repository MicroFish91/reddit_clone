import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange, Provider } from "urql";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
import theme from "../theme";

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

// * https://formidable.com/open-source/urql/docs/basics/react-preact/
const client = createClient({
  url: "http://localhost:3000/graphql",
  // * https://formidable.com/open-source/urql/docs/graphcache/
  exchanges: [
    dedupExchange,
    // * https://formidable.com/open-source/urql/docs/graphcache/cache-updates/
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, _args, cache, _info) => {
            // cache.updateQuery({ query: MeDocument }, (data) => {});
            // * Poor typing by urql so we use our own wrapper
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, _args, cache, _info) => {
            // cache.updateQuery({ query: MeDocument }, (data) => {});
            // * Poor typing by urql so we use our own wrapper
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          registerUser: (_result, _args, cache, _info) => {
            // cache.updateQuery({ query: MeDocument }, (data) => {});
            // * Poor typing by urql so we use our own wrapper
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.registerUser.errors) {
                  return query;
                } else {
                  return {
                    me: result.registerUser.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include",
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
