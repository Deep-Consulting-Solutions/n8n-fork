"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EnumDataService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumDataService = void 0;
const typedi_1 = require("typedi");
const cache_service_1 = require("@/services/cache/cache.service");
const esaEnumData_repository_1 = require("@/databases/repositories/esaEnumData.repository");
const enum_validation_error_1 = require("@/errors/enum-validation.error");
const esaEnums_repository_1 = require("@/databases/repositories/esaEnums.repository");
let EnumDataService = EnumDataService_1 = class EnumDataService {
    constructor(cacheService, enumDataRepository, enumsRepository) {
        this.cacheService = cacheService;
        this.enumDataRepository = enumDataRepository;
        this.enumsRepository = enumsRepository;
    }
    async getAllCached() {
        const enumsData = await this.cacheService.get('enums', {
            async refreshFn() {
                return await typedi_1.Container.get(EnumDataService_1).findAll();
            },
        });
        return enumsData.map((v) => this.enumDataRepository.create(v));
    }
    async findAll() {
        return await this.enumDataRepository.find();
    }
    async getAllEnumData() {
        return await typedi_1.Container.get(esaEnumData_repository_1.EsaEnumDataRepository).find();
    }
    async getEnumsAliasValueMap() {
        const allEnumsSet = await this.getAllEnumSets();
        const allEnums = await this.findAll();
        const formattedEnums = allEnums.map((e) => {
            var _a;
            const esaEnumName = (_a = allEnumsSet.find((i) => i.id === e.esaEnumId)) === null || _a === void 0 ? void 0 : _a.name;
            const alias = `<<${esaEnumName}.${e.key}`;
            return {
                ...e,
                esaEnumName,
                alias,
            };
        });
        const aliasValueMap = formattedEnums.reduce((acc, currentEnum) => {
            acc[currentEnum.alias] = currentEnum.value;
            return acc;
        }, {});
        return aliasValueMap;
    }
    async getAllEnumSets() {
        return await typedi_1.Container.get(esaEnums_repository_1.EsaEnumsRepository).find();
    }
    async getEnumDataByEnumSetId(esaEnumId) {
        return await typedi_1.Container.get(esaEnumData_repository_1.EsaEnumDataRepository).find({ where: { esaEnumId } });
    }
    validateEnum(enumData) {
        var _a;
        if (enumData.key.length > 50) {
            throw new enum_validation_error_1.EnumValidationError('key cannot be longer than 50 characters');
        }
        if (enumData.key.replace(/[A-Za-z0-9_]/g, '').length !== 0) {
            throw new enum_validation_error_1.EnumValidationError('key can only contain characters A-Za-z0-9_');
        }
        if (((_a = enumData.value) === null || _a === void 0 ? void 0 : _a.length) > 255) {
            throw new enum_validation_error_1.EnumValidationError('value cannot be longer than 255 characters');
        }
    }
    validateEnumSet(enumsSetData) {
        if (enumsSetData.name.length > 255) {
            throw new enum_validation_error_1.EnumValidationError('key cannot be longer than 255 characters');
        }
        if (enumsSetData.name.replace(/[A-Za-z0-9_]/g, '').length !== 0) {
            throw new enum_validation_error_1.EnumValidationError('key can only contain characters A-Za-z0-9_');
        }
    }
    async createEnumsSet(enumsSetData) {
        this.validateEnumSet(enumsSetData);
        const saveResult = await this.enumsRepository.save({
            ...enumsSetData,
        }, { transaction: false });
        console.log({ saveResult });
        return saveResult;
    }
    async create(enumData) {
        this.validateEnum(enumData);
        const saveResult = await this.enumDataRepository.save({
            ...enumData,
        }, { transaction: false });
        return saveResult;
    }
    async update(id, enumData) {
        this.validateEnum(enumData);
        await this.enumDataRepository.update(id, enumData);
        await this.updateCache();
        return (await this.getCached(id));
    }
    async delete(id) {
        await this.enumDataRepository.delete(id);
        await this.updateCache();
    }
    async updateCache() {
        const enums = await this.findAll();
        await this.cacheService.set('enums', enums);
    }
    async getCached(id) {
        const enums = await this.getAllCached();
        const foundEnum = enums.find((e) => e.id === id);
        if (!foundEnum) {
            return null;
        }
        return this.enumDataRepository.create(foundEnum);
    }
};
exports.EnumDataService = EnumDataService;
exports.EnumDataService = EnumDataService = EnumDataService_1 = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeof (_a = typeof cache_service_1.CacheService !== "undefined" && cache_service_1.CacheService) === "function" ? _a : Object, typeof (_b = typeof esaEnumData_repository_1.EsaEnumDataRepository !== "undefined" && esaEnumData_repository_1.EsaEnumDataRepository) === "function" ? _b : Object, typeof (_c = typeof esaEnums_repository_1.EsaEnumsRepository !== "undefined" && esaEnums_repository_1.EsaEnumsRepository) === "function" ? _c : Object])
], EnumDataService);
//# sourceMappingURL=enums.service.js.map