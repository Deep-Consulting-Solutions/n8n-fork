import type { MigrationContext, ReversibleMigration } from '@db/types';

export class N8NTestingFramework1689942863738 implements ReversibleMigration {
    name = 'N8NTestingFramework1689942863738'

    public async up({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "workflow_test" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "workflowId" character varying NOT NULL,
                "name" text NOT NULL,
                "description" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ae525a832798b58de2d89d46c10" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "node_output" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "workflowTestId" uuid NOT NULL,
                "nodeId" character varying NOT NULL,
                "data" jsonb DEFAULT '{}'::jsonb,
                "errorMessage" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_node_output" PRIMARY KEY ("workflowTestId", "nodeId"),
                CONSTRAINT "FK_workflow_test_id" FOREIGN KEY ("workflowTestId") REFERENCES "workflow_test"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
        await queryRunner.query(`DROP TABLE "node_output"`);
        await queryRunner.query(`DROP TABLE "workflow_test"`);
    }
}
