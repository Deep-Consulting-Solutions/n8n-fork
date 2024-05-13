import { Service } from 'typedi';
import { DataSource, Repository } from '@n8n/typeorm';
import { NodeOutput } from '../entities/NodeOutput';

@Service()
export class NodeOutputRepository extends Repository<NodeOutput> {
	constructor(dataSource: DataSource) {
		super(NodeOutput, dataSource.manager);
	}
}
