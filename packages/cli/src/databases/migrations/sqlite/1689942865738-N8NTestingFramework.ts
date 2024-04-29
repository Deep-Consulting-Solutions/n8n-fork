import {MigrationInterface, QueryRunner} from "typeorm";

export class N8NTestingFramework1689942863738 implements MigrationInterface {
    name = 'N8NTestingFramework1689942863738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "workflow_test" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "workflowId" character varying NOT NULL,
                "name" text NOT NULL,
                "description" text,
                "createdAt" TIMESTAMP NOT NULL, 
                "updatedAt" TIMESTAMP NOT NULL,
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
                "createdAt" TIMESTAMP NOT NULL, 
                "updatedAt" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_node_output" PRIMARY KEY ("workflowTestId", "nodeId"),
                CONSTRAINT "FK_workflow_test_id" FOREIGN KEY ("workflowTestId") REFERENCES "workflow_test"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "node_output"`);
        await queryRunner.query(`DROP TABLE "workflow_test"`);
    }
}
