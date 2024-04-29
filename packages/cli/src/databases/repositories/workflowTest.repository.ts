import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { WorkflowTest } from '../entities/WorkflowTest';

@Service()
export class WorkflowTestRepository extends Repository<WorkflowTest> {
	constructor(dataSource: DataSource) {
		super(WorkflowTest, dataSource.manager);
	}
}
