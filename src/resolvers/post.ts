import { MyContext } from "src/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Post } from '../entities/Post';

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        const posts = await em.find(Post, {});
        return posts;
    }

    @Query(() => Post, { nullable: true })
    async post(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
    ):  Promise<Post | null> {
        const post = await em.findOne(Post, id);
        return post;
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post> {
        const post = em.create(Post, { title });
        await em.persistAndFlush(post);
        return post;
    }
}