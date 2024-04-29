/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as Db from '@/Db';
import { ExecutionsService } from '@/executions/executions.service';
import type { ExecutionRequest } from '@/requests';
import { LessThanOrEqual } from 'typeorm';
import type { IWorkflowBase } from 'n8n-workflow';
import { Workflow } from 'n8n-workflow';
import { NodeTypes } from '@/NodeTypes';
import { Container } from 'typedi';
import { ActiveExecutions } from '@/ActiveExecutions';
import { getRunData } from '../WorkflowExecuteAdditionalData';

const getExecutionId = async (workflowId: string, nodeId: string, userId: string) => {
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
	const sourcetionNodes = workflowInstance.getConnectedNodes(
		workflowInstance.connectionsBySourceNode,
		waitNode.name,
	);
	const connectedNodes = [...destinationNodes, ...sourcetionNodes];
	for (const node of nodes) {
		if (!connectedNodes.includes(node.name)) {
			delete workflowInstance.nodes[node.name];
			delete workflowInstance.connectionsByDestinationNode[node.name];
		}
	}
	const data = {
		node: waitNode,
		data: {
			main: [],
		},
		source: null,
	};
	const runData = await getRunData(workflow as IWorkflowBase, userId, undefined, undefined, data);
	const executionId = await Container.get(ActiveExecutions).add(runData);
	return executionId;
};

export async function retryWorkflows() {
	const resumeWorkflowTimerRecords = await Db.collections.ResumeWorkflowTimer.find({
		where: {
			resumptionTime: LessThanOrEqual(new Date(Date.now() + 60 * 1000)),
		},
	});
	console.dir(resumeWorkflowTimerRecords, { depth: null });

	const globalRole = await Db.collections.Role.findOne({ where: { scope: 'global' } });
	const adminUser = await Db.collections.User.findOne({ where: { globalRoleId: globalRole!.id } });
	const promises: Array<Promise<boolean>> = [];

	for (const resumeWorkflowTimerRecord of resumeWorkflowTimerRecords) {
		// TODO: Get new execution id
		const workflowId = resumeWorkflowTimerRecord.executionId;
		const nodeId = resumeWorkflowTimerRecord.waitNodeId;
		const newExecutionId = getExecutionId(workflowId, nodeId, adminUser!.id);

		const executionPayload = {
			user: adminUser!,
			params: {
				id: newExecutionId,
			},
			body: {
				loadWorkflow: false,
			},
		} as unknown as ExecutionRequest.Retry;

		promises.push(ExecutionsService.retryExecution(executionPayload, resumeWorkflowTimerRecord.id));
	}

	await Promise.allSettled(promises);
}
