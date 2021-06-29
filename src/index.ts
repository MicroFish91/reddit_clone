import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import mikroConfig from './mikro-orm.config'

const main = async () => {
    const orm = MikroORM.init(mikroConfig);
    await orm.getMigrator().up(); // Runs table migrations

    const post = orm.em.create(Post, {title: 'my first post'});
    await orm.em.persistAndFlush(post);

}

main();