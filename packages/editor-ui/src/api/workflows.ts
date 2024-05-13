import type {
	IExecutionResponse,
	IExecutionsCurrentSummaryExtended,
	IRestApiContext,
	IWorkflowDb,
	NewWorkflowResponse,
	NodeOutputDb,
} from '@/Interface';
import type { ExecutionFilters, ExecutionOptions, IDataObject } from 'n8n-workflow';
import { makeRestApiRequest } from '@/utils/apiUtils';

export async function getNewWorkflow(context: IRestApiContext, name?: string) {
	const response = await makeRestApiRequest<NewWorkflowResponse>(
		context,
		'GET',
		'/workflows/new',
		name ? { name } : {},
	);
	return {
		name: response.name,
		onboardingFlowEnabled: response.onboardingFlowEnabled === true,
		settings: response.defaultSettings,
	};
}

export async function getWorkflow(context: IRestApiContext, id: string, filter?: object) {
	const sendData = filter ? { filter } : undefined;

	return await makeRestApiRequest<IWorkflowDb>(context, 'GET', `/workflows/${id}`, sendData);
}

export async function getWorkflows(context: IRestApiContext, filter?: object) {
	const sendData = filter ? { filter } : undefined;

	return await makeRestApiRequest<IWorkflowDb[]>(context, 'GET', '/workflows', sendData);
}

export async function getActiveWorkflows(context: IRestApiContext) {
	return await makeRestApiRequest<string[]>(context, 'GET', '/active-workflows');
}

export async function getActiveExecutions(context: IRestApiContext, filter: IDataObject) {
	const output = await makeRestApiRequest(context, 'GET', '/executions', { filter });

	return output.results;
}

export async function getExecutions(
	context: IRestApiContext,
	filter?: ExecutionFilters,
	options?: ExecutionOptions,
): Promise<{ count: number; results: IExecutionsCurrentSummaryExtended[]; estimated: boolean }> {
	return await makeRestApiRequest(context, 'GET', '/executions', { filter, ...options });
}

export async function getExecutionData(context: IRestApiContext, executionId: string) {
	return await makeRestApiRequest<IExecutionResponse | null>(
		context,
		'GET',
		`/executions/${executionId}`,
	);
}

export async function getTestSuite(context: IRestApiContext, workFlowId: string) {
	return await makeRestApiRequest(context, 'GET', `/workflow-tests/${workFlowId}`);
}

export async function postTestSuite(
	context: IRestApiContext,
	payload: {
		workflowId: string;
		description: string;
	},
) {
	return await makeRestApiRequest(context, 'POST', '/workflow-tests', payload);
}

export async function patchTestSuite(context: IRestApiContext, payload: NodeOutputDb) {
	return await makeRestApiRequest(
		context,
		'PUT',
		`/workflow-tests/nodes-output/${payload.workflowTestId}`,
		payload as IDataObject,
	);
}

export async function createTestSuite(context: IRestApiContext, payload: Omit<NodeOutputDb, 'id'>) {
	return await makeRestApiRequest(
		context,
		'POST',
		`/workflow-tests/nodes-output/${payload.workflowTestId}`,
		payload as IDataObject,
	);
}
