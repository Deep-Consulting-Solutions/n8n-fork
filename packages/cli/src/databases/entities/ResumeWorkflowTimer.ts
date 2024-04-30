/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';

@Entity({ name: 'resume_workflow_timer' })
export class ResumeWorkflowTimer extends AbstractEntity {
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
