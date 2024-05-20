import type { MigrationContext, ReversibleMigration } from '@db/types';

export class AddUserOTPSecret1681134145997 implements ReversibleMigration {
	name = 'AddUserOTPSecret1681134145997';

	async up({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
		await queryRunner.query(`ALTER TABLE "${tablePrefix}user" ADD COLUMN otpsecret varchar`);
	}

	async down({ queryRunner, tablePrefix }: MigrationContext): Promise<void> {
		await queryRunner.query(`ALTER TABLE "${tablePrefix}user" DROP COLUMN otpsecret`);
	}
}
