import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { __dbpw__, __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/
    },
    entities: [Post, User],
    dbName: 'reddit_clone',
    user: 'postgres',
    password: __dbpw__,
    type: 'postgresql',
    debug: !__prod__
} as Parameters<typeof MikroORM.init>[0];