import type { FindOptionsWhere } from 'typeorm';
import * as Db from '@/Db';
import type { WorkflowTest } from '@/databases/entities/WorkflowTest';
import type { NodeOutput } from '@/databases/entities/NodeOutput';

export class WorkflowTestsService {
	static async get(workflow: FindOptionsWhere<WorkflowTest>, options?: { relations: string[] }) {
		return Db.collections.WorkflowTest.findOne({ where: workflow, relations: options?.relations });
	}

	static async getMany(): Promise<WorkflowTest[]> {
		return Db.collections.WorkflowTest.find();
	}

	static async getManyByWorkflowId(workflowId: string): Promise<WorkflowTest[]> {
		return Db.collections.WorkflowTest.find({ where: { workflowId } });
	}

	static async getNodesOutput(workflowTestId: string): Promise<NodeOutput[]> {
		return Db.collections.NodeOutput.find({ where: { workflowTestId } });
	}
}
