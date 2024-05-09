import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultTimeField1899999999859 implements MigrationInterface {
	name = 'AddDefaultTimeField1899999999859';

	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "workflow_test" ALTER COLUMN "createdAt" ADD DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "workflow_test" ALTER COLUMN "updatedAt" ADD DEFAULT now()`);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "workflow_test" ALTER COLUMN "updatedAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "workflow_test" ALTER COLUMN "createdAt" DROP DEFAULT`);
	}
}
