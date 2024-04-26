import * as Db from '@/Db';
import type { FindOptionsWhere } from 'typeorm';
import type { WorkflowTest } from '@db/entities/WorkflowTest';
import { WorkflowTestsService } from './workflowTests.services';

export class EEWorkflowsService extends WorkflowTestsService {
	static async get(workflow: FindOptionsWhere<WorkflowTest>, options?: { relations: string[] }) {
		return Db.collections.WorkflowTest.findOne({ where: workflow, relations: options?.relations });
	}

	static async getMany(): Promise<WorkflowTest[]> {
		return Db.collections.WorkflowTest.find();
	}
}
