import type { EsaEnumData } from '@/databases/entities/EsaEnumData';
import { CacheService } from '@/services/cache/cache.service';
import { EsaEnumDataRepository } from '@/databases/repositories/esaEnumData.repository';
import { EsaEnumsRepository } from '@/databases/repositories/esaEnums.repository';
import type { EsaEnums } from '@/databases/entities/EsaEnums';
export declare class EnumDataService {
    protected cacheService: CacheService;
    protected enumDataRepository: EsaEnumDataRepository;
    protected enumsRepository: EsaEnumsRepository;
    constructor(cacheService: CacheService, enumDataRepository: EsaEnumDataRepository, enumsRepository: EsaEnumsRepository);
    getAllCached(): Promise<EsaEnumData[]>;
    findAll(): Promise<EsaEnumData[]>;
    getAllEnumData(): Promise<EsaEnumData[]>;
    getEnumsAliasValueMap(): Promise<Record<string, string>>;
    getAllEnumSets(): Promise<EsaEnums[]>;
    getEnumDataByEnumSetId(esaEnumId: string): Promise<EsaEnumData[]>;
    validateEnum(enumData: Omit<EsaEnumData, 'id'>): void;
    validateEnumSet(enumsSetData: Omit<EsaEnums, 'id'>): void;
    createEnumsSet(enumsSetData: Omit<EsaEnums, 'id'>): Promise<EsaEnums>;
    create(enumData: Omit<EsaEnumData, 'id'>): Promise<EsaEnumData>;
    update(id: string, enumData: Omit<EsaEnumData, 'id'>): Promise<EsaEnumData>;
    delete(id: string): Promise<void>;
    updateCache(): Promise<void>;
    getCached(id: string): Promise<EsaEnumData | null>;
}
