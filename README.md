npm init -y

Typescript Config:
-yarn add -D @types/node typscript ts-node
-ts-config: npx tsconfig.json


Mikro-Orm:
yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg

after setting config, create migrations using:
npx mikro-orm migration:create