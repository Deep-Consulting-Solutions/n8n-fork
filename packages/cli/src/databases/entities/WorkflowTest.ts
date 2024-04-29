/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import * as Db from '../../Db';
import type { NodeOutput } from './NodeOutput';
import { AbstractEntity } from './AbstractEntity';

@Entity({ name: 'workflow_test' })
export class WorkflowTest extends AbstractEntity {
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
		const count: number = await Db.collections.WorkflowTest.count();
		this.name = `WorkflowTest_${count + 1}`;
	}
}
