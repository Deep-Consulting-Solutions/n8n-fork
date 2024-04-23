/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	BeforeInsert,
	getConnection,
} from 'typeorm';
import type { NodeOutput } from './NodeOutput';

@Entity({ name: 'workflow_test' })
export class WorkflowTest {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	workflowId: string;

	@Column({ type: 'text' })
	name: string;

	@Column({ type: 'text', nullable: true })
	description: string;

	@OneToMany('WorkflowTest', 'workflow')
	nodeOutputs: NodeOutput[];

	@BeforeInsert()
	async generateSequentialName() {
		const count: number = await getConnection().getRepository(WorkflowTest).count();
		this.name = `WorkflowTest_${count + 1}`;
	}
}
