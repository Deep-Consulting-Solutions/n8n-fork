/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Entity, Column } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';

@Entity({ name: 'resume_workflow_timer' })
export class ResumeWorkflowTimer extends AbstractEntity {
	@Column({ type: 'datetime' })
	resumptionTime: Date;

	@Column({ type: 'varchar' })
	executionId: string;
}
