import { Service } from 'typedi';
import { DataSource, Repository } from '@n8n/typeorm';
import { ResumeWorkflowTimer } from '../entities/ResumeWorkflowTimer';

@Service()
export class ResumeWorkflowTimerRepository extends Repository<ResumeWorkflowTimer> {
	constructor(dataSource: DataSource) {
		super(ResumeWorkflowTimer, dataSource.manager);
	}
}
