import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';
import { WorkflowTest } from './WorkflowTest';

@Entity({ name: 'node_output' })
export class NodeOutput {
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
	data: unknown;

	@Column({ type: 'varchar' })
	errorMessage: string;
}
