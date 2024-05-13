import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from '@n8n/typeorm';
import { WithTimestampsAndStringId } from './AbstractEntity';

@Entity({ name: 'node_output' })
export class NodeOutput extends WithTimestampsAndStringId {
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
