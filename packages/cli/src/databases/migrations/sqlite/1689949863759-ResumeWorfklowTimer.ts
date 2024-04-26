import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResumeWorkflowTimerTable1689949863759 implements MigrationInterface {
    name = 'ResumeWorkflowTimerTable1689949863759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "resume_workflow_timer" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "resumptionTime" TIMESTAMP NOT NULL,
                "executionId" character varying NOT NULL,
                CONSTRAINT "PK_e2b6a0b014f9aa7c1e0f88b3b69" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "resume_workflow_timer"
        `);
    }

}
