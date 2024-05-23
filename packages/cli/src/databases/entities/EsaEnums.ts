import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from '@n8n/typeorm';
import { WithTimestampsAndStringId } from './AbstractEntity';
import type { EsaEnumData } from './EsaEnumData';

@Entity({ name: 'esa_enums' })
export class EsaEnums extends WithTimestampsAndStringId {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'text' })
	name: string;

	@OneToMany('EsaEnumData', 'esaEnum')
	esaEnumData: EsaEnumData[];
}
