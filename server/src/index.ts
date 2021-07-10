import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import redis from "redis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, COOKIE_PW, __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
// import sendEmail from "./utils/sendEmail";

const main = async () => {
  // sendEmail("somebody@somebody.com", "yo");
  const orm = await MikroORM.init(mikroConfig);

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  const app = express();

  // ? Deletes all existing user rows
  // await orm.em.nativeDelete(User, {});

  // ? Drop Tables
  // const generator = orm.getSchemaGenerator();
  // const dropDump = await generator.dropSchema();

  // ? Runs table migrations
  // await orm.getMigrator().up();

  // * https://www.npmjs.com/package/cors#configuration-options
  app.use(
    cors({
      origin: "http://localhost:3001",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      // * https://github.com/tj/connect-redis#redisstoreoptions
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      // * https://github.com/expressjs/cookie-session#cookiesessionoptions
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: "lax", // csrf
        httpOnly: true,
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: COOKIE_PW,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  const port: string | number = process.env.PORT || 3000;

  // localhost:3000/graphql
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

main();
