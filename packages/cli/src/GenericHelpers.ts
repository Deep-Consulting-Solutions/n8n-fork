/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Container } from 'typedi';
import { validate } from 'class-validator';
import type { INode, IRunExecutionData, Workflow, WorkflowExecuteMode } from 'n8n-workflow';

import type { IExecutionDb, IExecutionFlattedDb, IWorkflowDb } from '@/Interfaces';
import type { WorkflowEntity } from '@db/entities/WorkflowEntity';
import type { CredentialsEntity } from '@db/entities/CredentialsEntity';
import type { TagEntity } from '@db/entities/TagEntity';
import type { User } from '@db/entities/User';
import type { WorkflowTest } from '@db/entities/WorkflowTest';
import type { NodeOutput } from '@db/entities/NodeOutput';
import { ExecutionRepository } from './databases/repositories/execution.repository';
import type { UserRoleChangePayload, UserUpdatePayload } from '@/requests';
import { BadRequestError } from './errors/response-errors/bad-request.error';
import * as ResponseHelper from '@/ResponseHelper';

export async function validateEntity(
	entity:
		| WorkflowEntity
		| CredentialsEntity
		| TagEntity
		| User
		| UserUpdatePayload
		| UserRoleChangePayload
		| WorkflowTest
		| NodeOutput,
): Promise<void> {
	const errors = await validate(entity);

	const errorMessages = errors
		.reduce<string[]>((acc, cur) => {
			if (!cur.constraints) return acc;
			acc.push(...Object.values(cur.constraints));
			return acc;
		}, [])
		.join(' | ');

	if (errorMessages) {
		throw new BadRequestError(errorMessages);
	}
}

/**
 * Create an error execution
 *
 * @param {INode} node
 * @param {IWorkflowDb} workflowData
 * @param {Workflow} workflow
 * @param {WorkflowExecuteMode} mode
 * @returns
 * @memberof ActiveWorkflowRunner
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function createPartialExecution(
	node: INode,
	workflowData: IWorkflowDb,
	workflow: Workflow,
	mode: WorkflowExecuteMode,
): Promise<any> {
	const saveDataErrorExecutionDisabled = workflowData?.settings?.saveDataErrorExecution === 'none';

	if (saveDataErrorExecutionDisabled) return;

	const executionData: IRunExecutionData = {
		startData: {
			destinationNode: node.name,
			runNodeFilter: [node.name],
		},
		executionData: {
			metadata: {},
			contextData: {},
			nodeExecutionStack: [
				{
					node,
					data: {
						main: [
							[
								{
									json: {},
									pairedItem: {
										item: 0,
									},
								},
							],
						],
					},
					source: null,
				},
			],
			waitingExecution: {},
			waitingExecutionSource: {},
		},
		resultData: {
			runData: {
				[node.name]: [
					{
						startTime: 0,
						executionTime: 0,
						error: undefined,
						source: [],
					},
				],
			},
			error: undefined,
			lastNodeExecuted: node.name,
		},
	};

	const fullExecutionData: IExecutionDb = {
		id: '',
		data: executionData,
		mode,
		finished: false,
		startedAt: new Date(),
		workflowData,
		workflowId: workflow.id,
		stoppedAt: new Date(),
		status: 'running',
	};

	let execution = ResponseHelper.flattenExecutionData(fullExecutionData);

	execution = await Container.get(ExecutionRepository).save(execution as IExecutionFlattedDb);
	return execution;
}

export const DEFAULT_EXECUTIONS_GET_ALL_LIMIT = 20;
