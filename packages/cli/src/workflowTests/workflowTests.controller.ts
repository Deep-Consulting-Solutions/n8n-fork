import { Container } from 'typedi';

import { Get, Patch, Post, RestController } from '@/decorators';
import { WorkflowTest } from './../databases/entities/WorkflowTest';
import { NodeOutput } from './../databases/entities/NodeOutput';
import { WorkflowTestRepository } from '@db/repositories/workflowTest.repository';
import { WorkflowRepository } from '@db/repositories/workflow.repository';
import { NodeOutputRepository } from '@db/repositories/nodeOutput.repository';
import { validateEntity } from '@/GenericHelpers';
import { listQueryMiddleware } from '@/middlewares';
import { Logger } from '@/Logger';
import { BadRequestError } from '@/errors/response-errors/bad-request.error';
import { InternalServerError } from '@/errors/response-errors/internal-server.error';
import { WorkflowTestRequest } from './workflowTest.request';
import { WorkflowTestService } from './workflowTest.service';

@RestController('/workflow-tests')
export class WorkflowTestsController {
	constructor(
		private readonly logger: Logger,
	) {}

	@Post('/')
	async create(req: WorkflowTestRequest.Create) {
        const workflow = await Container.get(WorkflowRepository).findOne({
			where: { id: req.body.workflowId },
		});
		if (!workflow) {
			throw new BadRequestError('Workflow not found');
		}

		const newWorkflowTest = new WorkflowTest();

		Object.assign(newWorkflowTest, req.body);

		newWorkflowTest.createdAt = new Date();
		newWorkflowTest.updatedAt = new Date();

		await validateEntity(newWorkflowTest);

		const savedWorkflowTest = await Container.get(WorkflowTestRepository).save(newWorkflowTest);

		if (!savedWorkflowTest) {
			this.logger.error('Failed to create workflow test', { userId: req.user.id });
			throw new InternalServerError('Failed to save workflow test');
		}

		const workflowTest = Container.get(WorkflowTestService).getManyByWorkflowId(
			savedWorkflowTest.workflowId,
		);

		return workflowTest;
	}

	@Get('/', { middlewares: listQueryMiddleware })
	async getAll() {
		return Container.get(WorkflowTestService).getMany();
	}

	@Get('/:workflowId')
	async getWorkflowTest(req: WorkflowTestRequest.Get) {
		const workflow = await Container.get(WorkflowRepository).findOne({
			where: { id: req.params.workflowId },
		});
		if (!workflow) {
			throw new BadRequestError('Workflow not found');
		}

		return Container.get(WorkflowTestService).getManyByWorkflowId(req.params.workflowId);
	}

    @Get('/nodes-output/:workflowTestId')
	async getNodesOutput(req: WorkflowTestRequest.GetNodesOutput) {
        const workflowTest = await await Container.get(WorkflowTestRepository).findOne({
			where: { id: req.params.workflowTestId },
		});
		if (!workflowTest) {
			throw new BadRequestError('Workflow Test not found');
		}

		const result = Container.get(WorkflowTestService).getNodesOutput(req.params.workflowTestId);
		const nodesOuput = result?.map((output) => {
			try {output.data = JSON.parse(output.data)} catch(e){};
			return output
		})
		return nodesOuput;
	}

	@Post('/nodes-output/:workflowTestId')
	async createNodesOutput(req: WorkflowTestRequest.CreatNodesOutput) {
		const workflowTest = await Container.get(WorkflowTestRepository).findOne({
			where: { id: req.params.workflowTestId },
		});
		if (!workflowTest) {
			throw new BadRequestError('Workflow Test not found');
		}

		const nodeOuput = new NodeOutput();
		const nodeData = {
			workflowTestId: req.body.workflowTestId,
			nodeId: req.body.nodeId,
			data: req.body.outputType === 'data' ? JSON.stringify(req.body.data) : '[]',
			errorMessage: req.body.outputType === 'error' ? req.body.errorMessage : '',
		};

		Object.assign(nodeOuput, nodeData);
		nodeOuput.createdAt = new Date();
		nodeOuput.updatedAt = new Date();

		const savedNodeOutput = await Container.get(NodeOutputRepository).save(nodeOuput);

		if (!savedNodeOutput) {
			this.logger.error('Failed to create node output', { userId: req.user.id });
			throw new InternalServerError('Failed to save node output');
		}

		return await Container.get(WorkflowTestService).getNodesOutput(req.params.workflowTestId);
	}

	@Patch('/nodes-output/:workflowTestId')
	async updateNodesOutput(req: WorkflowTestRequest.UpdateNodesOutput) {
		const workflowTest = await Container.get(WorkflowTestRepository).findOne({
			where: { id: req.params.workflowTestId },
		});
		if (!workflowTest) {
			throw new BadRequestError('Workflow Test not found');
		}

		const nodeOutput = await Container.get(NodeOutputRepository).findOne({
			where: { id: req.body.id },
		});

		if (!nodeOutput || !req.body.id || req.body.id !== nodeOutput.id) {
			throw new BadRequestError('Node output not found');
		}

		if (nodeOutput.workflowTestId !== req.params.workflowTestId) {
			throw new BadRequestError('Node output does not belong to the workflow test');
		}

		const nodeOutputId = nodeOutput.id;
		const nodeData = {
			id: nodeOutputId,
			workflowTestId: req.body.workflowTestId,
			nodeId: req.body.nodeId,
			data: req.body.outputType === 'data' ? JSON.stringify(req.body.data) : '[]',
			errorMessage: req.body.outputType === 'error' ? req.body.errorMessage : '',
		};
		const nodeKey = {
			id: nodeOutputId,
			workflowTestId: req.body.workflowTestId,
			nodeId: req.body.nodeId,
		};

		const updatedNodeOutput = await Container.get(NodeOutputRepository).update(nodeKey, nodeData);

		if (!updatedNodeOutput) {
			this.logger.error('Failed to update node output', { userId: req.user.id });
			throw new InternalServerError('Failed to update node output');
		}

		return Container.get(WorkflowTestService).getNodesOutput(req.params.workflowTestId);
	}
}
