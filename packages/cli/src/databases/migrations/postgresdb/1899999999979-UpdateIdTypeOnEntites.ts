import type { MigrationContext, ReversibleMigration } from '@db/types';


export class UpdateIdTypeOnEntites1899999999979 implements ReversibleMigration {
	name = 'UpdateIdTypeOnEntites1899999999979';

	async up({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
        await queryRunner.query(`ALTER TABLE "node_output" DROP CONSTRAINT "FK_workflow_test_id"`);
        await queryRunner.query(`ALTER TABLE "node_output" DROP CONSTRAINT "PK_node_output"`);
        await queryRunner.query(`ALTER TABLE "node_output" ALTER COLUMN "workflowTestId" TYPE varchar`);
		await queryRunner.query(`ALTER TABLE "workflow_test" ALTER COLUMN "id" TYPE varchar USING "id"::varchar`);
		await queryRunner.query(`ALTER TABLE "node_output" ALTER COLUMN "id" TYPE varchar USING "id"::varchar`);
        await queryRunner.query(`ALTER TABLE "server_incident" ALTER COLUMN "id" TYPE varchar USING "id"::varchar`);
        await queryRunner.query(`ALTER TABLE "data_recovery_activity" ALTER COLUMN "id" TYPE varchar USING "id"::varchar`);
        await queryRunner.query(`ALTER TABLE "node_output" ADD CONSTRAINT "PK_node_output" PRIMARY KEY ("workflowTestId", "nodeId")`);
        await queryRunner.query(`ALTER TABLE "node_output" ADD CONSTRAINT "FK_workflow_test_id" FOREIGN KEY ("workflowTestId") REFERENCES "workflow_test"("id") ON DELETE CASCADE`);
	}

	async down({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
	}
}
