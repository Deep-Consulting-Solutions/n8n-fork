import { Service, Container } from 'typedi';
import { WorkflowTestRepository } from '@db/repositories/workflowTest.repository';
import type { FindOptionsWhere } from '@n8n/typeorm';
import type { WorkflowTest } from '@/databases/entities/WorkflowTest';
import type { NodeOutput } from '@/databases/entities/NodeOutput';
import { NodeOutputRepository } from '@/databases/repositories/nodeOutput.repository';

@Service()
export class WorkflowTestService {
	constructor(
		private readonly workflowTestRepository: WorkflowTestRepository,
	) {}

    async get(workflow: FindOptionsWhere<WorkflowTest>, options?: { relations: string[] }) {
		return Container.get(WorkflowTestRepository).findOne({ where: workflow, relations: options?.relations });
	}

	async getMany(): Promise<WorkflowTest[]> {
        return Container.get(WorkflowTestRepository).find();
	}

	async getManyByWorkflowId(workflowId: string): Promise<WorkflowTest[]> {
        return Container.get(WorkflowTestRepository).find({ where: { workflowId } });
	}

	async getNodesOutput(workflowTestId: string): Promise<NodeOutput[]> {
        return Container.get(NodeOutputRepository).find({ where: { workflowTestId } });
	}
}
