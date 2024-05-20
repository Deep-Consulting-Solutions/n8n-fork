import type { MigrationContext, ReversibleMigration } from '@db/types';

export class addConstarinToSvaeRequestLog1694091729096 implements ReversibleMigration {
	name = 'addConstarinToSvaeRequestLog1694091729096';

	public async up({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
		await queryRunner.query(
			`
			ALTER TABLE ${tablePrefix}save_request_log ALTER COLUMN "workflowId" TYPE VARCHAR(36)
			`,
		);	
		await queryRunner.query(
			`
				ALTER TABLE ${tablePrefix}save_request_log ADD CONSTRAINT "FK_9a3caef176a6bd386c9ca3b3799" FOREIGN KEY ("workflowId") REFERENCES "workflow_entity"("id") ON DELETE NO ACTION ON UPDATE NO action
			`,
		);
	}

	public async down({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE ${tablePrefix}save_request_log DROP CONSTRAINT IF EXISTS "FK_9a3caef176a6bd386c9ca3b3799";`,
		);
		await queryRunner.query(
			`
			ALTER TABLE ${tablePrefix}save_request_log ALTER COLUMN "workflowId" TYPE integer
			`,
		);
	}
}
