import type { MigrationContext, ReversibleMigration } from '@db/types';


export class UpdateResumeWorfklowTimer1779949863759 implements ReversibleMigration {
	name = 'UpdateResumeWorfklowTimer1779949863759';

	async up({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" ADD COLUMN status varchar`);
	}

	async down({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
		await queryRunner.query(`ALTER TABLE "resume_workflow_timer" DROP COLUMN status`);
	}
}
