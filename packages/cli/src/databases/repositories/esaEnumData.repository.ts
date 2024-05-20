import { Service } from 'typedi';
import { DataSource, Repository } from '@n8n/typeorm';
import { EsaEnumData } from '../entities/EsaEnumData';

@Service()
export class EsaEnumDataRepository extends Repository<EsaEnumData> {
	constructor(dataSource: DataSource) {
		super(EsaEnumData, dataSource.manager);
	}
}
