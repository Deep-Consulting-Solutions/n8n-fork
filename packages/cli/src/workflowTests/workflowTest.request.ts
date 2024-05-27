import type { AuthenticatedRequest } from '@/requests';

export declare namespace WorkflowTestRequest {
	type CreateUpdatePayload = Partial<{
		workflowId: string;
		description: string;
	}>;

	type CreateNodePayload = Partial<{
		workflowTestId: string;
		outputType: string;
		errorMessage?: string;
		nodeId: string;
		data?: object[];
	}>;

	type UpdateNodePayload = {
		id: string;
		workflowTestId: string;
		outputType: string;
		errorMessage?: string;
		nodeId: string;
		data?: object;
	};

	type Create = AuthenticatedRequest<{}, {}, CreateUpdatePayload>;

	type Get = AuthenticatedRequest<{ workflowId: string }>;

	type GetNodesOutput = AuthenticatedRequest<{ workflowTestId: string }>;

	type CreatNodesOutput = AuthenticatedRequest<{ workflowTestId: string }, {}, CreateNodePayload>;

	type UpdateNodesOutput = AuthenticatedRequest<{ workflowTestId: string }, {}, UpdateNodePayload>;

	type GetAll = AuthenticatedRequest<{}, {}, {}, { filter: string }>;
}
