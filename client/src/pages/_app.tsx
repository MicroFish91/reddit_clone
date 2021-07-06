import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { createClient, Provider } from "urql";
import theme from "../theme";

// https://formidable.com/open-source/urql/docs/basics/react-preact/
const client = createClient({
  url: "http://localhost:3000/graphql",
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
