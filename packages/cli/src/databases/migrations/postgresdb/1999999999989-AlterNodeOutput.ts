import type { MigrationContext, ReversibleMigration } from '@db/types';


export class AlterNodeOutput1999999999989 implements ReversibleMigration {
    public async up({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "node_output"
            ADD COLUMN "temp_data" text DEFAULT '[]';
        `);

        await queryRunner.query(`
            ALTER TABLE "node_output"
            DROP COLUMN "data";
        `);

        await queryRunner.query(`
            ALTER TABLE "node_output"
            RENAME COLUMN "temp_data" TO "data";
        `);
    }

    public async down({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "node_output"
            ADD COLUMN "temp_data" jsonb DEFAULT '{}'::jsonb;
        `);

        await queryRunner.query(`
            ALTER TABLE "node_output"
            DROP COLUMN "data";
        `);

        await queryRunner.query(`
            ALTER TABLE "node_output"
            RENAME COLUMN "temp_data" TO "data";
        `);
    }
}
