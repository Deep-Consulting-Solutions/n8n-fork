import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from '@n8n/typeorm';
import  { Container } from 'typedi';
import type { NodeOutput } from './NodeOutput';
import { WithTimestampsAndStringId } from './AbstractEntity';
import { WorkflowTestRepository } from '../repositories/workflowTest.repository'

@Entity({ name: 'workflow_test' })
export class WorkflowTest extends WithTimestampsAndStringId {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	workflowId: string;

	@Column({ type: 'text' })
	name: string;

	@Column({ type: 'text', nullable: true })
	description: string;

	@OneToMany('NodeOutput', 'workflowTest')
	nodeOutputs: NodeOutput[];

	@BeforeInsert()
	async generateSequentialName() {
		const count: number = await Container.get(WorkflowTestRepository).count();
		this.name = `WorkflowTest_${count + 1}`;
	}
}
