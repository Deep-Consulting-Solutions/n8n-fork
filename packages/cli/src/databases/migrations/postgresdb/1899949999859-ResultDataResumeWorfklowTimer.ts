import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResultDataResumeWorfklowTimer1899949999859 implements MigrationInterface {
	name = 'ResultDataResumeWorfklowTimer1899949999859';

	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" ADD COLUMN "resultData" jsonb DEFAULT '{}'::jsonb`);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" DROP COLUMN "resultData"`);
	}
}
