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

Initialize nextjs with chakra
https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui
yarn create next-app --example with-chakra-ui with-chakra-ui-app

for normal -
yarn create react-app [app-name] --template typescript
or
create-react-app [app-name] --typescript

## client

- urql for graphql queries
- graphql codegen: generates typescript types for our queries/urql hooks
