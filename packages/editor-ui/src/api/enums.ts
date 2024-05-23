import type { EsaEnumData, EsaEnum, IRestApiContext } from '@/Interface';
import { makeRestApiRequest } from '@/utils/apiUtils';
import type { IDataObject } from 'n8n-workflow';

export async function getEnums(context: IRestApiContext): Promise<EsaEnumData[]> {
	return await makeRestApiRequest(context, 'GET', '/enums');
}

export async function getAllEnumSets(context: IRestApiContext): Promise<EsaEnum[]> {
	return await makeRestApiRequest(context, 'GET', '/enums/get-enums-set');
}

export async function getEnumsAliasValueMap(
	context: IRestApiContext,
): Promise<Record<string, string>> {
	return await makeRestApiRequest(context, 'GET', '/get-enums-alias-value');
}

export async function getEnumsByEnumSetId(
	context: IRestApiContext,
	enumSetId: string,
): Promise<EsaEnumData[]> {
	return await makeRestApiRequest(context, 'GET', `/enums/get-enums/${enumSetId}`);
}

export async function getEnum(
	context: IRestApiContext,
	{ id }: { id: EsaEnumData['id'] },
): Promise<EsaEnumData> {
	return await makeRestApiRequest(context, 'GET', `/enums/${id}`);
}

export async function createEnum(
	context: IRestApiContext,
	data: Omit<EsaEnumData, 'id'>,
): Promise<EsaEnumData> {
	return await makeRestApiRequest(context, 'POST', '/enums', data as unknown as IDataObject);
}

export async function updateEnum(
	context: IRestApiContext,
	{ id, alias, ...data }: EsaEnumData,
): Promise<EsaEnumData> {
	return await makeRestApiRequest(context, 'PATCH', `/enums/${id}`, data as unknown as IDataObject);
}

export async function deleteEnum(context: IRestApiContext, { id }: { id: EsaEnumData['id'] }) {
	return await makeRestApiRequest(context, 'DELETE', `/enums/${id}`);
}

export async function createEnumSet(context: IRestApiContext, data: Omit<EsaEnum, 'id'>) {
	return await makeRestApiRequest(
		context,
		'POST',
		'/enums/create-enums-set',
		data as unknown as IDataObject,
	);
}
