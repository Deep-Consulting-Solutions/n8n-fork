import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { ResumeWorkflowTimer } from '../entities/ResumeWorkflowTimer';

@Service()
export class ResumeWorkflowTimerRepository extends Repository<ResumeWorkflowTimer> {
	constructor(dataSource: DataSource) {
		super(ResumeWorkflowTimer, dataSource.manager);
	}
}
