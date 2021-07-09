import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../../generated/graphql";
import betterUpdateQuery from "../betterUpdateQuery";

export const logoutMutation = (_result, _args, cache, _info) => {
  // cache.updateQuery({ query: MeDocument }, (data) => {});
  // * Poor typing by urql so we use our own wrapper
  betterUpdateQuery<LogoutMutation, MeQuery>(
    cache,
    { query: MeDocument },
    _result,
    () => ({ me: null })
  );
};

export const loginMutation = (_result, _args, cache, _info) => {
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
};

export const registerMutation = (_result, _args, cache, _info) => {
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
};
