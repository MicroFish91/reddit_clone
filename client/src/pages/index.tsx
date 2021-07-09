import React from "react";
import NavBar from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";

const Index = ({}) => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      <div>Hello World</div>
      <br />
      {data?.posts.map((post) => (
        <div key={post._id}>{post.title}</div>
      ))}
    </>
  );
};

export default createUrqlClient(Index, { ssr: true });
