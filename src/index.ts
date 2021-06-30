import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import mikroConfig from './mikro-orm.config';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up(); // Runs table migrations

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({ em: orm.em })
    });

    apolloServer.applyMiddleware({ app });

    const port: string | number = process.env.PORT || 3000;

    // localhost:3000/graphql
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

main();