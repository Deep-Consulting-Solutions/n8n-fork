import type { MigrationContext, ReversibleMigration } from '@db/types';


export class UpdateResumeWorfklowTimer1879949869859 implements ReversibleMigration {
	name = 'UpdateResumeWorfklowTimer1879949869859';

	async up({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" ADD COLUMN "waitNodeId" varchar`);
	}

	async down({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" DROP COLUMN "waitNodeId"`);
	}
}
