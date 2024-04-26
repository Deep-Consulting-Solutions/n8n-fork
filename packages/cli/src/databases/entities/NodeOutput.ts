/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';
import type { WorkflowTest } from './WorkflowTest';
import { AbstractEntity } from './AbstractEntity';

@Entity({ name: 'node_output' })
export class NodeOutput extends AbstractEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne('WorkflowTest', 'nodeOutputs')
	workflowTest: WorkflowTest;

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
