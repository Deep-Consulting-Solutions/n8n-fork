/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';

@Entity({ name: 'node_output' })
export class NodeOutput extends AbstractEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@PrimaryColumn()
	workflowTestId: string;

	@PrimaryColumn({ type: 'varchar' })
	nodeId: string;

	@Column({
		type: 'jsonb',
		default: {},
	})
	data: any;

	@Column({ type: 'varchar' })
	errorMessage: string;
}
