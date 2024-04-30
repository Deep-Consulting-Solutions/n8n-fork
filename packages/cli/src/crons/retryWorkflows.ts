/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as Db from '@/Db';
import { ExecutionsService } from '@/executions/executions.service';
import type { ExecutionRequest } from '@/requests';
import { LessThanOrEqual } from 'typeorm';
import type { IWorkflowBase } from 'n8n-workflow';
import { Workflow } from 'n8n-workflow';
import { NodeTypes } from '@/NodeTypes';
import { Container } from 'typedi';
import { getRunData } from '../WorkflowExecuteAdditionalData';
import { getWorkflowOwner } from '@/UserManagement/UserManagementHelper';
import type { IExecutionDb, IExecutionFlattedDb } from '@/Interfaces';
import * as ResponseHelper from '@/ResponseHelper';

const getExecutionId = async (
	workflowId: string,
	nodeId: string,
	userId: string,
	resultData?: any,
) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const workflow = await Db.collections.Workflow.findOneBy({ id: workflowId });
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
		runData = await getRunData(
			workflow as IWorkflowBase,
			userId,
			undefined,
			undefined,
			nextNode,
			true,
			resultData,
		);
	} else {
		runData = await getRunData(
			workflow as IWorkflowBase,
			userId,
			undefined,
			undefined,
			nextNode,
			true,
		);
	}
	const fullExecutionData: IExecutionDb = {
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

	const execution = ResponseHelper.flattenExecutionData(fullExecutionData);

	return execution as IExecutionFlattedDb;
};

export async function retryWorkflows() {
	const resumeWorkflowTimerRecords = await Db.collections.ResumeWorkflowTimer.find({
		where: {
			resumptionTime: LessThanOrEqual(new Date(Date.now() + 60 * 1000)),
		},
	});

	const promises: Array<Promise<boolean>> = [];

	for (const resumeWorkflowTimerRecord of resumeWorkflowTimerRecords) {
		// TODO: Get new execution id
		const workflowId = resumeWorkflowTimerRecord.executionId;
		const nodeId = resumeWorkflowTimerRecord.waitNodeId;
		const resultData = resumeWorkflowTimerRecord.resultData;
		const owner = await getWorkflowOwner(workflowId);
		const execution = await getExecutionId(workflowId, nodeId, owner.id, resultData);

		const executionPayload = {
			user: owner,
			params: {
				id: '',
			},
			body: {
				loadWorkflow: false,
			},
		} as unknown as ExecutionRequest.Retry;

		promises.push(
			ExecutionsService.retryExecution(executionPayload, resumeWorkflowTimerRecord.id, execution!),
		);
	}

	await Promise.allSettled(promises);
}
