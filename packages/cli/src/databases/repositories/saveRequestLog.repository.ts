import { Service } from 'typedi';
import { DataSource, Repository } from '@n8n/typeorm';
import { SaveRequestLog } from '../entities/SaveRequestLog';

@Service()
export class SaveRequestLogRepository extends Repository<SaveRequestLog> {
	constructor(dataSource: DataSource) {
		super(SaveRequestLog, dataSource.manager);
	}
}
