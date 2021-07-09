import { cacheExchange } from "@urql/exchange-graphcache";
import { SSRExchange, withUrqlClient } from "next-urql";
import { dedupExchange, fetchExchange } from "urql";
import {
  loginMutation,
  logoutMutation,
  registerMutation,
} from "./userMutations";

// * https://formidable.com/open-source/urql/docs/basics/react-preact/
const createUrqlClient = (Component: React.FC, { ssr } = { ssr: false }) => {
  // * https://formidable.com/open-source/urql/docs/advanced/server-side-rendering/#nextjs
  return withUrqlClient(
    (ssrExchange: SSRExchange) => ({
      url: "http://localhost:3000/graphql",
      // * https://formidable.com/open-source/urql/docs/graphcache/
      exchanges: [
        dedupExchange,
        // * https://formidable.com/open-source/urql/docs/graphcache/cache-updates/
        cacheExchange({
          updates: {
            Mutation: {
              logout: logoutMutation,
              login: loginMutation,
              registerUser: registerMutation,
            },
          },
        }),
        ssrExchange,
        fetchExchange,
      ],
      fetchOptions: {
        credentials: "include",
      },
    }),
    { ssr }
  )(Component);
};

export default createUrqlClient;
