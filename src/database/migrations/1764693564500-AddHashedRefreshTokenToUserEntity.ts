import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHashedRefreshTokenToUserEntity1764693564500
  implements MigrationInterface
{
  name = 'AddHashedRefreshTokenToUserEntity1764693564500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "hashedRefreshToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "hashedRefreshToken"`,
    );
  }
}
