/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ExecutionService } from '../executions/execution.service';

import { LessThanOrEqual } from '@n8n/typeorm';
import type { IWorkflowBase } from 'n8n-workflow';
import { Workflow } from 'n8n-workflow';
import { NodeTypes } from '@/NodeTypes';
import { Container } from 'typedi';
import { getRunData } from '../WorkflowExecuteAdditionalData';
import type { IExecutionDb, IExecutionResponse } from '@/Interfaces';
import * as ResponseHelper from '@/ResponseHelper';
import { ResumeWorkflowTimerRepository } from '@/databases/repositories/resumeWorkflowTimer.repository';
import { SharedWorkflowRepository } from '@/databases/repositories/sharedWorkflow.repository';
import { getSharedWorkflowIds } from '../WorkflowHelpers';
import type { ExecutionRequest } from '../executions/execution.types';

const getWorkflowOwner = async (workflowId: string) => {
	const sharing = await Container.get(SharedWorkflowRepository).findOneBy({
		workflowId,
		role: 'workflow:owner',
	});

	return sharing?.user;
};

const getExecutionId = async (
	workflowId: string,
	nodeId: string,
	userId: string,
	resultData?: any,
) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	// const workflow = await WorkflowTestRepository.findOneBy({ id: workflowId });
	const workflow = {} as IWorkflowBase;
	const nodeTypes = Container.get(NodeTypes);
	if (!workflow) return null;
	const nodes = workflow.nodes;
	let waitNode = null;
	for (const node of nodes) {
		if (node.id === nodeId) {
			waitNode = node;
			break;
		}
	}
	if (!waitNode) return null;
	const workflowInstance = new Workflow({
		id: workflow.id,
		name: workflow.name,
		nodes: workflow.nodes,
		connections: workflow.connections,
		active: workflow.active,
		nodeTypes,
		staticData: workflow.staticData,
		settings: workflow.settings,
	});
	const destinationNodes = workflowInstance.getConnectedNodes(
		workflowInstance.connectionsByDestinationNode,
		waitNode.name,
	);
	const sourceNodes = workflowInstance.getConnectedNodes(
		workflowInstance.connectionsBySourceNode,
		waitNode.name,
	);
	const nextNodeName = sourceNodes.reverse()[0];
	const nextNode = workflowInstance.getNode(nextNodeName);
	const connectedNodes = [...destinationNodes, ...sourceNodes, waitNode.name];
	for (const node of nodes) {
		if (!connectedNodes.includes(node.name)) {
			workflow.nodes = workflow.nodes.filter((no) => no.name !== node.name);
			delete workflow.connections[node.name];
		}
	}

	let runData;
	if (resultData) {
		runData = await getRunData(workflow, userId, undefined, nextNode, true, resultData);
	} else {
		runData = await getRunData(workflow, userId, undefined, nextNode, true);
	}
	const fullExecutionData: IExecutionDb = {
		id: '', // mustafa
		workflowId,
		data: runData.executionData!,
		mode: runData.executionMode,
		finished: false,
		startedAt: new Date(),
		workflowData: runData.workflowData,
		status: 'running',
	};

	if (runData.retryOf !== undefined) {
		fullExecutionData.retryOf = runData.retryOf.toString();
	}

	const execution = ResponseHelper.flattenObject(fullExecutionData);

	return execution as IExecutionResponse;
};

export async function retryWorkflows() {
	const resumeWorkflowTimerRecords = await Container.get(ResumeWorkflowTimerRepository).findBy({
		resumptionTime: LessThanOrEqual(new Date(Date.now() + 60 * 1000)),
	});

	const promises: Array<Promise<boolean>> = [];

	for (const resumeWorkflowTimerRecord of resumeWorkflowTimerRecords) {
		// TODO: Get new execution id
		const workflowId = resumeWorkflowTimerRecord.executionId;
		const nodeId = resumeWorkflowTimerRecord.waitNodeId;
		const resultData = resumeWorkflowTimerRecord.resultData;
		const owner = await getWorkflowOwner(workflowId);
		const execution = await getExecutionId(workflowId, nodeId, owner!.id, resultData);

		const executionPayload = {
			user: owner,
			params: {
				id: '',
			},
			body: {
				loadWorkflow: false,
			},
		} as ExecutionRequest.Retry;

		const executionService = Container.get(ExecutionService);
		const sharedWorkflowIds = await getSharedWorkflowIds(owner!);

		promises.push(
			executionService.retry(
				executionPayload,
				sharedWorkflowIds,
				resumeWorkflowTimerRecord.id,
				execution!,
			),
		);
	}

	await Promise.allSettled(promises);
}
