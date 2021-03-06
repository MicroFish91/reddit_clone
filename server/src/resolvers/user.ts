import { EntityManager } from "@mikro-orm/postgresql";
import argon2 from "argon2";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { COOKIE_NAME } from "../constants";
import { User } from "../entities/User";

// Alternate way to define args
@InputType()
class UsernamePasswordInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, req.session.userId);
    return user;
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (!options.email.includes("@")) {
      return {
        errors: [
          {
            field: "email",
            message: "Invalid email",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    // const user = em.create(User, {
    //   email: options.email.toLowerCase(),
    //   password: hashedPassword,
    // });
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          email: options.email,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      user = result[0];
      // await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "email",
              message: "email already taken",
            },
          ],
        };
      }
    }
    req.session.userId = user._id;

    const reformattedUser: User = {
      _id: user._id,
      email: user.email,
      password: user.password,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    return { user: reformattedUser };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      email: options.email.toLowerCase(),
    });

    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "that email doesn't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password provided",
          },
        ],
      };
    }

    req.session.userId = user._id;
    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
