import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamePasswordToHashedPasswordInUserEntity1764693836410
  implements MigrationInterface
{
  name = 'RenamePasswordToHashedPasswordInUserEntity1764693836410';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "password" TO "hashedPassword"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "hashedPassword" TO "password"`,
    );
  }
}
