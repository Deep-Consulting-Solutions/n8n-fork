import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResumeWorfklowTimer1879949869859 implements MigrationInterface {
	name = 'UpdateResumeWorfklowTimer1879949869859';

	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" ADD COLUMN waitNodeId varchar`);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" DROP COLUMN waitNodeId`);
	}
}
