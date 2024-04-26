import express from 'express';
import * as Db from '@/Db';
import * as ResponseHelper from '@/ResponseHelper';
import { validateEntity } from '@/GenericHelpers';
import { isSharingEnabled, rightDiff } from '@/UserManagement/UserManagementHelper';
import { LoggerProxy } from 'n8n-workflow';
import { WorkflowTest } from '@db/entities/WorkflowTest';
import type { WorkflowTestRequest } from '@/requests';
import { WorkflowTestsService } from './workflowTests.services';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EEWorkflowController = express.Router();

EEWorkflowController.use((req, res, next) => {
	if (!isSharingEnabled()) {
		// skip ee router and use free one
		next('router');
		return;
	}
	// use ee router
	next();
});

EEWorkflowController.post(
	'/',
	ResponseHelper.send(async (req: WorkflowTestRequest.Create) => {
		const newWorkflowTest = new WorkflowTest();

		Object.assign(newWorkflowTest, req.body);

		await validateEntity(newWorkflowTest);

		let savedWorkflowTest;
		await Db.transaction(async (transactionManager) => {
			savedWorkflowTest = await transactionManager.save<WorkflowTest>(newWorkflowTest);
		});

		if (!savedWorkflowTest) {
			LoggerProxy.error('Failed to create workflow test', { userId: req.user.id });
			throw new ResponseHelper.InternalServerError('Failed to save workflow test');
		}

		const workflowTest = await WorkflowTestsService.getMany();

		return workflowTest;
	}),
);

/**
 * (EE) GET /workflows
 */
EEWorkflowController.get(
	'/',
	ResponseHelper.send(async (req: WorkflowTestRequest.GetAll) => {
		console.log(req.user);
		return WorkflowTestsService.getMany();
	}),
);
