import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export const titleCase = (s: string) =>
	s
		.replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
		.replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());

export const capitalizeInitial = (str: string) => str[0].toUpperCase() + str.slice(1);

export function throwOnErrorStatus(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	responseData: { data?: Array<{ status: string; message: string }> },
) {
	if (responseData?.data?.[0].status === 'error') {
		throw new NodeOperationError(this.getNode(), responseData as Error);
	}
}

export function throwOnEmptyUpdate(this: IExecuteFunctions, resource: string) {
	throw new NodeOperationError(
		this.getNode(),
		`Please enter at least one field to update for the ${resource}.`,
	);
}
