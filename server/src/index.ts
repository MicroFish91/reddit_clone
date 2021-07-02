import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import express from 'express';
import session from 'express-session';
import redis from 'redis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { __cookiePW__, __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { MyContext } from './types';

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();
    const app = express();

    // await orm.getMigrator().up(); // Runs table migrations

    app.use(
        session({
            name: 'qid',
            // https://github.com/tj/connect-redis#redisstoreoptions
            store: new RedisStore({ 
                client: redisClient,
                disableTouch: true
            }),
            // https://github.com/expressjs/cookie-session#cookiesessionoptions
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                sameSite: 'lax', // csrf
                httpOnly: true,
                secure: __prod__ // cookie only works in https
            },
            saveUninitialized: false,
            secret: __cookiePW__,
            resave: false
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    });

    apolloServer.applyMiddleware({ app });

    const port: string | number = process.env.PORT || 3000;

    // localhost:3000/graphql
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

main();