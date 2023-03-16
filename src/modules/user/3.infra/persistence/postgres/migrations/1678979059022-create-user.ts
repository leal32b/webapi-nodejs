import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class createUser1678979059022 implements MigrationInterface {
  name = 'createUser1678979059022'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "users" ("id" text NOT NULL, "email" text NOT NULL, "emailConfirmed" boolean NOT NULL, "name" text NOT NULL, "language" text NOT NULL, "password" text NOT NULL, "token" text NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users"')
  }
}
