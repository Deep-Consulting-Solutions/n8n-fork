import type { MigrationContext, ReversibleMigration } from '@db/types';


export class ExecutionIdResumeWorkflowTimer1899949999969 implements ReversibleMigration {
	name = 'ExecutionIdResumeWorkflowTimer1899949999969';

	async up({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" ALTER COLUMN "executionId" TYPE uuid USING "executionId"::uuid`);
	}

	async down({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
	}
}
