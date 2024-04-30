import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResumeWorfklowTimer1779949863759 implements MigrationInterface {
	name = 'UpdateResumeWorfklowTimer1779949863759';

	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" ADD COLUMN status varchar`);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" DROP COLUMN status`);
	}
}
