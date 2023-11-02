import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddGroup1693172917284 implements MigrationInterface {
  name = 'AddGroup1693172917284'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "user_group" ("userId" text NOT NULL, "groupId" text NOT NULL, CONSTRAINT "PK_d9a1801971c4c66927d77560e73" PRIMARY KEY ("userId", "groupId"))')
    await queryRunner.query('ALTER TABLE "user_group" ADD CONSTRAINT "FK_3d6b372788ab01be58853003c93" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "user_group" ADD CONSTRAINT "FK_31e541c93fdc0bb63cfde6549b7" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user_group" DROP CONSTRAINT "FK_31e541c93fdc0bb63cfde6549b7"')
    await queryRunner.query('ALTER TABLE "user_group" DROP CONSTRAINT "FK_3d6b372788ab01be58853003c93"')
    await queryRunner.query('DROP TABLE "user_group"')
  }
}
