/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-param-reassign */

import express from 'express';
import { LoggerProxy } from 'n8n-workflow';

import * as Db from '@/Db';
import * as ResponseHelper from '@/ResponseHelper';
import { WorkflowTest } from '@db/entities/WorkflowTest';
import { NodeOutput } from '@db/entities/NodeOutput';
import { validateEntity } from '@/GenericHelpers';
import { getLogger } from '@/Logger';
import type { WorkflowTestRequest } from '@/requests';
import { EEWorkflowController } from './workflowTests.controller.ee';
import { WorkflowTestsService } from './workflowTests.services';

export const workflowTestsController = express.Router();

/**
 * Initialize Logger if needed
 */
workflowTestsController.use((req, res, next) => {
	try {
		LoggerProxy.getInstance();
	} catch (error) {
		LoggerProxy.init(getLogger());
	}
	next();
});

workflowTestsController.use('/', EEWorkflowController);

/**
 * POST /workflowTests
 */
workflowTestsController.post(
	'/',
	ResponseHelper.send(async (req: WorkflowTestRequest.Create) => {
		const workflow = await Db.collections.Workflow.findOne({
			where: { id: req.body.workflowId },
		});
		if (!workflow) {
			throw new ResponseHelper.BadRequestError('Workflow not found');
		}

		const newWorkflowTest = new WorkflowTest();

		Object.assign(newWorkflowTest, req.body);

		newWorkflowTest.createdAt = new Date();
		newWorkflowTest.updatedAt = new Date();

		await validateEntity(newWorkflowTest);

		const savedWorkflowTest = await Db.collections.WorkflowTest.save(newWorkflowTest);

		if (!savedWorkflowTest) {
			LoggerProxy.error('Failed to create workflow test', { userId: req.user.id });
			throw new ResponseHelper.InternalServerError('Failed to save workflow test');
		}

		const workflowTest = await WorkflowTestsService.getManyByWorkflowId(
			savedWorkflowTest.workflowId,
		);

		return workflowTest;
	}),
);

/**
 * GET all /workflowTests
 */
workflowTestsController.get(
	'/',
	ResponseHelper.send(async (req: WorkflowTestRequest.GetAll) => {
		console.log(req.user);
		return WorkflowTestsService.getMany();
	}),
);

/**
 * GET workflow workflowTest /workflow-tests/:workflowId
 */
workflowTestsController.get(
	'/:workflowId(\\d+)',
	ResponseHelper.send(async (req: WorkflowTestRequest.Get) => {
		const workflow = await Db.collections.Workflow.findOne({
			where: { id: req.params.workflowId },
		});
		if (!workflow) {
			throw new ResponseHelper.BadRequestError('Workflow not found');
		}

		return WorkflowTestsService.getManyByWorkflowId(req.params.workflowId);
	}),
);

/**
 * GET workflowTest nodes output /workflow-tests/nodes-output/:workflowTestId
 */
workflowTestsController.get(
	'/nodes-output/:workflowTestId',
	ResponseHelper.send(async (req: WorkflowTestRequest.GetNodesOutput) => {
		const workflowTest = await Db.collections.WorkflowTest.findOne({
			where: { id: req.params.workflowTestId },
		});
		if (!workflowTest) {
			throw new ResponseHelper.BadRequestError('Workflow Test not found');
		}

		return WorkflowTestsService.getNodesOutput(req.params.workflowTestId);
	}),
);

/**
 * POST creates nodes output /nodes-output/workflow-tests/:workflowTestId
 */
workflowTestsController.post(
	'/nodes-output/:workflowTestId',
	ResponseHelper.send(async (req: WorkflowTestRequest.CreatNodesOutput) => {
		const workflowTest = await Db.collections.WorkflowTest.findOne({
			where: { id: req.params.workflowTestId },
		});
		if (!workflowTest) {
			throw new ResponseHelper.BadRequestError('Workflow Test not found');
		}

		const nodeOuput = new NodeOutput();
		const nodeData = {
			workflowTestId: req.body.workflowTestId,
			nodeId: req.body.nodeId,
			data: req.body.outputType === 'data' ? req.body.data : {},
			errorMessage: req.body.outputType === 'error' ? req.body.errorMessage : '',
		};

		Object.assign(nodeOuput, nodeData);
		nodeOuput.createdAt = new Date();
		nodeOuput.updatedAt = new Date();

		const savedNodeOutput = await Db.collections.NodeOutput.save(nodeOuput);

		if (!savedNodeOutput) {
			LoggerProxy.error('Failed to create node output', { userId: req.user.id });
			throw new ResponseHelper.InternalServerError('Failed to save node output');
		}

		return WorkflowTestsService.getNodesOutput(req.params.workflowTestId);
	}),
);

/**
 * PUT updates nodes output /nodes-output/workflow-tests/:workflowTestId
 */
workflowTestsController.put(
	'/nodes-output/:workflowTestId',
	ResponseHelper.send(async (req: WorkflowTestRequest.UpdateNodesOutput) => {
		const workflowTest = await Db.collections.WorkflowTest.findOne({
			where: { id: req.params.workflowTestId },
		});
		if (!workflowTest) {
			throw new ResponseHelper.BadRequestError('Workflow Test not found');
		}

		const nodeOutput = await Db.collections.NodeOutput.findOne({
			where: { id: req.body.id },
		});

		if (!nodeOutput || !req.body.id || req.body.id !== nodeOutput.id) {
			throw new ResponseHelper.BadRequestError('Node output not found');
		}

		if (nodeOutput.workflowTestId !== req.params.workflowTestId) {
			throw new ResponseHelper.BadRequestError('Node output does not belong to the workflow test');
		}

		const nodeOutputId = nodeOutput.id;
		const nodeData = {
			id: nodeOutputId,
			workflowTestId: req.body.workflowTestId,
			nodeId: req.body.nodeId,
			data: req.body.outputType === 'data' ? req.body.data : {},
			errorMessage: req.body.outputType === 'error' ? req.body.errorMessage : '',
		};
		const nodeKey = {
			id: nodeOutputId,
			workflowTestId: req.body.workflowTestId,
			nodeId: req.body.nodeId,
		};

		const updatedNodeOutput = await Db.collections.NodeOutput.update(nodeKey, nodeData);

		if (!updatedNodeOutput) {
			LoggerProxy.error('Failed to update node output', { userId: req.user.id });
			throw new ResponseHelper.InternalServerError('Failed to update node output');
		}

		return WorkflowTestsService.getNodesOutput(req.params.workflowTestId);
	}),
);
