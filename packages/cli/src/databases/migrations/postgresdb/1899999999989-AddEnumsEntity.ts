import type { MigrationContext, ReversibleMigration } from '@db/types';

export class AddEnumsEntity1899999999989 implements ReversibleMigration {
    name = 'AddEnumsEntity1899999999989'

    public async up({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "esa_enums" (
                "id" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                CONSTRAINT "PK_f2b7a0b314f9aa7c1d0f88b3b69" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "esa_enum_data" (
                "id" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "key" character varying NOT NULL,
                "value" character varying NOT NULL,
                "esaEnumId" character varying NOT NULL,
                CONSTRAINT "PK_b2b8a0b315f9aa7c1d0f8cb3b69" PRIMARY KEY ("id")
                CONSTRAINT "FK_esa_enum_id" FOREIGN KEY ("esaEnumId") REFERENCES "esa_enums"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "esa_enum_data"
        `);
        await queryRunner.query(`
            DROP TABLE "esa_enums"
        `);
    }

}
