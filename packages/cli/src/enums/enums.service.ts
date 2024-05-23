import { Service, Container } from 'typedi';
import { v4 as uuid } from 'uuid';
import type { EsaEnumData } from '@/databases/entities/EsaEnumData';
import { CacheService } from '@/services/cache/cache.service';
import { EsaEnumDataRepository } from '@/databases/repositories/esaEnumData.repository';
import { EnumValidationError } from '@/errors/enum-validation.error';
import { EsaEnumsRepository } from '@/databases/repositories/esaEnums.repository';
import type { EsaEnums } from '@/databases/entities/EsaEnums';

@Service()
export class EnumDataService {
	constructor(
		protected cacheService: CacheService,
		protected enumDataRepository: EsaEnumDataRepository,
		protected enumsRepository: EsaEnumsRepository,
	) {}

	async getAllCached(): Promise<EsaEnumData[]> {
		const enumsData = await this.cacheService.get('enums', {
			async refreshFn() {
				return await Container.get(EnumDataService).findAll();
			},
		});
		return (enumsData as Array<Partial<EsaEnumData>>).map((v) => this.enumDataRepository.create(v));
	}

	async findAll(): Promise<EsaEnumData[]> {
		return await this.enumDataRepository.find();
	}

	async getAllEnumData(): Promise<EsaEnumData[]> {
		return await Container.get(EsaEnumDataRepository).find();
	}

	async getEnumsAliasValueMap(): Promise<Record<string, string>> {
		const allEnumsSet = await this.getAllEnumSets();
		const allEnums = await this.findAll();
		const formattedEnums = allEnums.map((e) => {
			const esaEnumName = allEnumsSet.find((i) => i.id === e.esaEnumId)?.name;
			const alias = `${esaEnumName}.${e.key}`;
			return {
				...e,
				esaEnumName,
				alias,
			};
		});
		const aliasValueMap = formattedEnums.reduce<Record<string, string>>((acc, currentEnum) => {
			acc[currentEnum.alias] = currentEnum.value;
			return acc;
		}, {});

		return aliasValueMap;
	}

	async getAllEnumSets(): Promise<EsaEnums[]> {
		return await Container.get(EsaEnumsRepository).find();
	}

	async getEnumDataByEnumSetId(esaEnumId: string): Promise<EsaEnumData[]> {
		return await Container.get(EsaEnumDataRepository).find({ where: { esaEnumId } });
	}

	validateEnum(enumData: Omit<EsaEnumData, 'id'>): void {
		if (enumData.key.length > 50) {
			throw new EnumValidationError('key cannot be longer than 50 characters');
		}
		if (enumData.key.replace(/[A-Za-z0-9_]/g, '').length !== 0) {
			throw new EnumValidationError('key can only contain characters A-Za-z0-9_');
		}
		if (enumData.value?.length > 255) {
			throw new EnumValidationError('value cannot be longer than 255 characters');
		}
	}

	validateEnumSet(enumsSetData: Omit<EsaEnums, 'id'>): void {
		if (enumsSetData.name.length > 255) {
			throw new EnumValidationError('key cannot be longer than 255 characters');
		}
		if (enumsSetData.name.replace(/[A-Za-z0-9_]/g, '').length !== 0) {
			throw new EnumValidationError('key can only contain characters A-Za-z0-9_');
		}
	}

	async createEnumsSet(enumsSetData: Omit<EsaEnums, 'id'>): Promise<EsaEnums> {
		this.validateEnumSet(enumsSetData);
		const saveResult = await this.enumsRepository.save(
			{
				...enumsSetData,
			},
			{ transaction: false },
		);
		console.log({ saveResult });
		return saveResult;
	}

	async create(enumData: Omit<EsaEnumData, 'id'>): Promise<EsaEnumData> {
		this.validateEnum(enumData);
		const saveResult = await this.enumDataRepository.save(
			this.enumDataRepository.create({ id: uuid(), ...enumData }),
			{ transaction: false },
		);
		return saveResult;
	}

	async update(id: string, enumData: Omit<EsaEnumData, 'id'>): Promise<EsaEnumData> {
		this.validateEnum(enumData);
		await this.enumDataRepository.update(id, enumData);
		await this.updateCache();
		return (await this.getCached(id))!;
	}

	async delete(id: string): Promise<void> {
		await this.enumDataRepository.delete(id);
		await this.updateCache();
	}

	async updateCache(): Promise<void> {
		const enums = await this.findAll();
		await this.cacheService.set('enums', enums);
	}

	async getCached(id: string): Promise<EsaEnumData | null> {
		const enums = await this.getAllCached();
		const foundEnum = enums.find((e) => e.id === id);
		if (!foundEnum) {
			return null;
		}
		return this.enumDataRepository.create(foundEnum as Partial<EsaEnumData>);
	}
}
