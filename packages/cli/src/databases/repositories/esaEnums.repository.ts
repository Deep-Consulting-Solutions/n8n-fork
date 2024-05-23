import { Service } from 'typedi';
import { DataSource, Repository } from '@n8n/typeorm';
import { EsaEnums } from '../entities/EsaEnums';

@Service()
export class EsaEnumsRepository extends Repository<EsaEnums> {
	constructor(dataSource: DataSource) {
		super(EsaEnums, dataSource.manager);
	}
}
