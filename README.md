# Server

1. [Initialize project and set up Typescript](#Project-Config)
2. [Mikro-ORM Setup](#Mikro-ORM-Setup)
3. [GraphQL Setup](#GraphQL-Setup)
4. [Redis Caching for user login cookies](#Redis-Caching)

## Project Config

- npm init -y
- yarn add -D @types/node typscript ts-node
- npx tsconfig.json
- Set up package.json scripts

## Mikro-ORM Setup

- https://mikro-orm.io/docs/installation
- yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg
- Set up Config files

- Create Migrations:
  - npx mikro-orm migration:create <br /> <br />

- Add Tables Via SQL Migration <br />
```await orm.getMigrator().up();```

- To manually add rows

```const post = orm.em.create(Post, { title: 'my first post' }); ``` <br />
```await orm.em.persistAndFlush(post);```

 - If using Query Builder/Knex to inject more manual style SQL, need to import Entity Manager

 ``` import { EntityManager } from "@mikro-orm/postgresql"; ``` <br /> <br />
 ``` const result = await (em as EntityManager) ``` <br />
 ```       .createQueryBuilder(User) ``` <br />
 ```       .getKnexQuery() ``` <br />
 ```       .insert({ ``` <br />
 ```         username: options.username, ``` <br />
 ```         password: hashedPassword, ``` <br />
 ```         created_at: new Date(), ``` <br />
 ```         updated_at: new Date(), ``` <br />
 ```       }) ``` <br />
 ```       .returning("*"); ``` <br />

## GraphQL Setup

- Setup Apollo server to implement GraphQL API, route through express <br />
``` const apolloServer = new ApolloServer({ ``` <br />
```    schema: await buildSchema({ ``` <br />
```      resolvers: [HelloResolver, PostResolver, UserResolver], ``` <br />
```      validate: false, ``` <br />
```    }), ``` <br />
```    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }), ``` <br />
```  }); ``` <br />
- Hooking up resolvers will set up basic graphQL queries and mutations
- Go to 'http://localhost:xxxx/graphql for queries and mutations playground

## Redis Caching

- General Breakdown: Steps for reading user through session cookies & redis:

  1. Send session data to redis (key: value pair)
  sess:qwdjafklejafjea -> { userId: 1 }

  2. Expression middleware will set signed cookie on browser
  qwdjafklejafjeaaafgeagzxcbdea

  3. When user makes a request, the cookie is sent to the server

  4. Server unsigns/decrypts the cookie using the secret that we initially specified
  qwdjafklejafjeaaafgeagzxcbdea -> sess:qwdjafklejafjea

  5. Make a request to redis to get data
  sess:qwdjafklejafjea -> { userId: 1 }

  6. Stores the retrieved data on req.session
  req.session.userId = 1;

- for cookies - graphQL settings: <br />
```"request.credentials": "include"```

- Commands (For Windows - Run via Ubuntu on VM first): <br />
```sudo service redis-server start``` <br />
```sudo service redis-server stop``` <br />
```sudo service redis-server restart``` <br />

<br /> <br />

# Client

## General Steps

1. [Build react-app with a typescript template](#Starting-with-a-Typescript-Template)
2. [Optional: Setting up ChakraUI](#Setting-up-Chakra-UI)
3. [Hook up urql for graphql queries](#Hook-up-urql-for-graphql-queries)
4. [Initialize graphql codegen: generates typescript types for our queries/urql hooks](#Graphql-codgen-Initialization)
5. [SSR with Next-Urql](SSR-with-Next-Urql)

## Starting with a Typescript Template

Normal:

- yarn create react-app [app-name] --template typescript
- create-react-app [app-name] --typescript

Chakra + next.js

- https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui
- yarn create next-app --example with-chakra-ui with-chakra-ui-app

## Setting up Chakra UI

- https://chakra-ui.com/docs/getting-started
- Forms using Formik:  https://chakra-ui.com/docs/form/form-control#usage-with-form-libraries
- Special Formik Hooks:
``` const [field, { error }] = useField(props); ```


## Hook up urql for graphql queries

- https://formidable.com/open-source/urql/docs/basics/react-preact/

`const client = createClient({ ` <br />
` url: "http://localhost:xxxx/graphql",` <br />
` fetchOptions: {` <br />
` credentials: "include",` <br />
` },` <br />
`});` <br />

- Special Hooks:

`const [, register] = useMutation(REGISTER_MUT);`

- Make sure cors is set up properly

## Graphql-codegen Initialization

- https://www.graphql-code-generator.com/docs/getting-started/installation

- yarn add -D @graphql-codegen/cli

- yarn add -D @graphql-codegen/typescript-urql

<br />

- yarn graphql-codegen init:

  &nbsp;&nbsp;&nbsp; - What type of application are you building? React

  &nbsp;&nbsp;&nbsp; - Where is your schema?: 'http://localhost:xxxx/graphql'

  &nbsp;&nbsp;&nbsp; - Where are your operations and fragments?: 'src/graphql/**/*.graphql'

  &nbsp;&nbsp;&nbsp; - Pick plugins: TypeScript (required by other typescript plugins), TypeScript Operations (operations and fragments)

  &nbsp;&nbsp;&nbsp; - Where to write the output: 'src/generated/graphql.tsx'

  &nbsp;&nbsp;&nbsp; - Do you want to generate an introspection file? No

  &nbsp;&nbsp;&nbsp; - How to name the config file? 'codegen.yml'

  &nbsp;&nbsp;&nbsp; - What script in package.json should run the codegen? gen

<br />

- under codegen.yml > plugins, add: "typescript-urql"

- 'yarn gen' will look in graphql folder and convert code into 'generated' folder

- allows us to replace usemutation with custom hooks

- see register 'register.graphql' vs 'login.graphql" for example of two ways to do the same thing

## Setting up SSR with Next-Urql

- https://formidable.com/open-source/urql/docs/advanced/server-side-rendering/#nextjs

- see newly generated createUrqlClient, allows us to wrap components and pass {ssr: true}

- we can remove <provider> from main app when we use next-urql

- Sample SSR Breakdown:
  1. me -> browse http:localhost:xxxx
  2. -> next.js server
  3. -> request graphql server localhost:xxxx
  4. -> sending back to your browser

- After you've loaded a single page, next.js will not SSR render (will default back to client-side render)

- SSR Rendering Big Pro on Google SEO

- Running a ME query will return null because next server does not have a cookie stored to send back to server for verification
  - to keep SSR from running through Next.js server, put in the pause command in the hook query: <br />
  ``` const [{ data, fetching }] = useMeQuery({ ``` <br />
  ```  pause: true, ``` <br />
  ``` }); ``` <br />
  - We only want the query to pause while we we are routing through the Next server, so we can use the following (windows is undefined on Next server): <br />
  ``` export const isServer = () => typeof window === "undefined"; ``` <br />
  ``` pause: isServer(), ``` <br />


## To Sort

- URQL by default does not come with a normalized cache, they have it set up in a separate package called graphcache
- We can update this cache to allow the page to reload based on certain information changes, otherwise things like the login/logout will not refresh the page dynamically without manual reload
- https://formidable.com/open-source/urql/docs/graphcache/normalized-caching/ <br />
``` @urql/exchange-graphcache ``` <br /> <br />
``` cacheExchange({ ``` <br />
```      updates: { ``` <br />
```        Mutation: { ``` <br />
```          logout: (_result, _args, cache, _info) => { ``` <br />
``` .... ``` <br />


- Routing using nextlink <br />
``` import NextLink from "next/link"; ``` <br /> <br />
``` <NextLink href="/login"> ```<br />
```          <Link mr={2}>Login</Link> ```<br />
```        </NextLink> ```<br />

