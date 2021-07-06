## server

tsc tut: 2) demo configuration inheritance

npm init -y

Typescript Config:
-yarn add -D @types/node typscript ts-node
-ts-config: npx tsconfig.json

Mikro-Orm:
yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg

after setting config, create migrations using:
npx mikro-orm migration:create

const post = orm.em.create(Post, { title: 'my first post' });
await orm.em.persistAndFlush(post);

Redis:
sudo service redis-server start
sudo service redis-server stop
sudo service redis-server restart

for cookies - graphQL settings:
"request.credentials": "include"

Steps for reading user through session cookies & redis:

1 Send session data to redis (key: value pair)
sess:qwdjafklejafjea -> { userId: 1 }

2 Expression middleware will set signed cookie on browser
qwdjafklejafjeaaafgeagzxcbdea

3 When user makes a request, the cookie is sent to the server

4 Server unsigns/decrypts the cookie using the secret that we initially specified
qwdjafklejafjeaaafgeagzxcbdea -> sess:qwdjafklejafjea

5 Make a request to redis to get data
sess:qwdjafklejafjea -> { userId: 1 }

6 Stores the retrieved data on req.session
req.session.userId = 1;

<br /> <br />

# Client

## General Steps

1. [Build react-app with a typescript template](#Starting-with-a-Typescript-Template)
2. [Hook up urql for graphql queries](#Hook-up-urql-for-graphql-queries)
3. [Initialize graphql codegen: generates typescript types for our queries/urql hooks](#Graphql-codgen-Initialization)

## Starting with a Typescript Template

Normal:

- yarn create react-app [app-name] --template typescript
- create-react-app [app-name] --typescript

Chakra + next.js

- https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui
- yarn create next-app --example with-chakra-ui with-chakra-ui-app

https://www.graphql-code-generator.com/docs/getting-started/installation

<br />

## Hook up urql for graphql queries

- https://formidable.com/open-source/urql/docs/basics/react-preact/

`const client = createClient({ `
` url: "http://localhost:xxxx/graphql",`
` fetchOptions: {`
` credentials: "include",`
` },`
`});`

`const [, register] = useMutation(REGISTER_MUT);`

- Make sure cors is set up properly

## Graphql-codgen Initialization

- yarn add -D @graphql-codegen/cli

### yarn graphql-codegen init

- What type of application are you building? Application built with React
- Where is your schema?: (path or url) http://localhost:xxxx
- Where are your operations and fragments?: 'src/graphql/**/*.graphql'
- Pick plugins: TypeScript (required by other typescript plugins), TypeScript Operations (operations and fragments)
- Where to write the output: src/generated/graphql.tsx
- Do you want to generate an introspection file? No
- How to name the config file? codegen.yml
- What script in package.json should run the codegen? gen

  yarn add -D @graphql-codegen/typescript-urql

replace 'typescript-react-apollo' with 'typescript-urql' in the codegen.yml plugins section
