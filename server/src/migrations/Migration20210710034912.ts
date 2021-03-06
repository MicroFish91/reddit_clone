import { Migration } from "@mikro-orm/migrations";

export class Migration20210710034912 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" text not null, "password" text not null);'
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");'
    );

    this.addSql(
      'create table "post" ("_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);'
    );
  }
}
