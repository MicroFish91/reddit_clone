import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  // https://formidable.com/open-source/urql/docs/api/urql/#usequery
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body;

  if (fetching) {
    // Loading
    body = null;
  } else if (data?.me) {
    // Logged in
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant="link"
          isLoading={logoutFetching}
          onClick={() => logout()}
        >
          Logout
        </Button>
      </Flex>
    );
  } else {
    // Not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  }

  return (
    <Flex bgColor="Tomato" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default NavBar;
