import { Entity, Column, PrimaryGeneratedColumn } from '@n8n/typeorm';
import { WithTimestampsAndStringId } from './AbstractEntity';

@Entity({ name: 'resume_workflow_timer' })
export class ResumeWorkflowTimer extends WithTimestampsAndStringId {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'timestamp' })
	resumptionTime: Date;

	@Column({ type: 'varchar' })
	executionId: string;

	@Column({ type: 'varchar' })
	waitNodeId: string;

	@Column({ type: 'varchar' })
	status: string;

	@Column({
		type: 'jsonb',
		default: {},
	})
	resultData: any;
}
