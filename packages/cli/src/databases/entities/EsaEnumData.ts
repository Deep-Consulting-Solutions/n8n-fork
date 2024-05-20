import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne } from '@n8n/typeorm';
import { WithTimestampsAndStringId } from './AbstractEntity';
import { EsaEnums } from './EsaEnums';

@Entity({ name: 'esa_enum_data' })
export class EsaEnumData extends WithTimestampsAndStringId {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@PrimaryColumn()
	esaEnumId: string;

	@Column({ type: 'varchar' })
	key: string;

    @Column({ type: 'varchar' })
	value: string;

    @ManyToOne('EsaEnums', 'esaEnumDatas')
    esaEnum: EsaEnums
}
