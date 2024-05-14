import type { MigrationContext, ReversibleMigration } from '@db/types';


export class IdResumeWorkflowTimer1899999999969 implements ReversibleMigration {
	name = 'IdResumeWorkflowTimer1899999999969';

	async up({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" ALTER COLUMN "id" TYPE varchar USING "executionId"::varchar`);
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" ALTER COLUMN "executionId" TYPE varchar USING "executionId"::varchar`);
	}

	async down({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
	}
}
