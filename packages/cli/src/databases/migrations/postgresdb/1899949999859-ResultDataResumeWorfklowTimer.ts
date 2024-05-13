import type { MigrationContext, ReversibleMigration } from '@db/types';


export class ResultDataResumeWorfklowTimer1899949999859 implements ReversibleMigration {
	name = 'ResultDataResumeWorfklowTimer1899949999859';

	async up({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" ADD COLUMN "resultData" jsonb DEFAULT '{}'::jsonb`);
	}

	async down({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" DROP COLUMN "resultData"`);
	}
}
