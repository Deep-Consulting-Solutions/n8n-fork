// import { Container } from 'typedi';

import { Get, Patch, Post, Delete, RestController } from '@/decorators';

import { EnumsRequest } from './enums.request';
import { EnumDataService } from './enums.service';
import { EnumValidationError } from '@/errors/enum-validation.error';
import { BadRequestError } from '@/errors/response-errors/bad-request.error';
import { NotFoundError } from '@/errors/response-errors/not-found.error';

@RestController('/enums')
export class EnumsController {
	constructor(private readonly enumsService: EnumDataService) {}

	@Post('/create-enums-set')
	async createEnumSet(req: EnumsRequest.CreateEnumSet) {
		const enumData = req.body;
		try {
			return await this.enumsService.createEnumsSet(enumData);
		} catch (error) {
			if (error instanceof EnumValidationError) {
				throw new BadRequestError(error.message);
			}
			throw error;
		}
	}

	@Get('/get-enums-set')
	async getAllEnumSets() {
		return await this.enumsService.getAllEnumSets();
	}

	@Get('/get-enums-alias-value')
	async getEnumsAliasValueMap() {
		return await this.enumsService.getEnumsAliasValueMap();
	}

	@Get('/get-enums/:id')
	async getEnumsByEnumSetId(req: EnumsRequest.Get) {
		const enumSetId = req.params.id;
		return await this.enumsService.getEnumDataByEnumSetId(enumSetId);
	}

	@Get('/')
	async getEnums() {
		return await this.enumsService.getAllCached();
	}

	@Post('/')
	async createEnum(req: EnumsRequest.Create) {
		const enumData = req.body;
		delete enumData.id;
		try {
			return await this.enumsService.create(enumData);
		} catch (error) {
			if (error instanceof EnumValidationError) {
				throw new BadRequestError(error.message);
			}
			throw error;
		}
	}

	@Get('/:id')
	async getEnum(req: EnumsRequest.Get) {
		const id = req.params.id;
		const enumData = await this.enumsService.getCached(id);
		if (enumData === null) {
			throw new NotFoundError(`Variable with id ${req.params.id} not found`);
		}
		return enumData;
	}

	@Patch('/:id')
	async updateEnum(req: EnumsRequest.Update) {
		const id = req.params.id;
		const enumData = req.body;
		delete enumData.id;
		try {
			return await this.enumsService.update(id, enumData);
		} catch (error) {
			if (error instanceof EnumValidationError) {
				throw new BadRequestError(error.message);
			}
			throw error;
		}
	}

	@Delete('/:id')
	async deleteEnum(req: EnumsRequest.Delete) {
		const id = req.params.id;
		await this.enumsService.delete(id);

		return true;
	}
}
