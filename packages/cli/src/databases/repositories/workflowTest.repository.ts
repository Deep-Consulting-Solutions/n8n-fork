import { Service } from 'typedi';
import { DataSource, Repository } from '@n8n/typeorm';
import { WorkflowTest } from '../entities/WorkflowTest';

@Service()
export class WorkflowTestRepository extends Repository<WorkflowTest> {
	constructor(dataSource: DataSource) {
		super(WorkflowTest, dataSource.manager);
	}
}
