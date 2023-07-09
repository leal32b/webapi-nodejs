import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class Identity1688916285388 implements MigrationInterface {
  name = 'Identity1688916285388'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "group" ("id" text NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_8a45300fd825918f3b40195fbdc" UNIQUE ("name"), CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TABLE "user" ("id" text NOT NULL, "email" text NOT NULL, "emailConfirmed" boolean NOT NULL, "locale" text NOT NULL, "name" text NOT NULL, "password" text NOT NULL, "token" text NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "user"')
    await queryRunner.query('DROP TABLE "group"')
  }
}
