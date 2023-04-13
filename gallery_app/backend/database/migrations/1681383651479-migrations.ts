import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1681383651479 implements MigrationInterface {
    name = 'Migrations1681383651479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "refreshToken" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "refreshToken" DROP DEFAULT`);
    }

}
