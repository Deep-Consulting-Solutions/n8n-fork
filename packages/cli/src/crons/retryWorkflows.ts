import * as Db from '@/Db';
import { ExecutionsService } from '@/executions/executions.service';
import { ExecutionRequest } from '@/requests';
import { LessThanOrEqual } from 'typeorm';

export async function retryWorkflows() {
	const resumeWorkflowTimerRecords = await Db.collections.ResumeWorkflowTimer.find({
		where: {
			resumptionTime: LessThanOrEqual(new Date(Date.now() + 60 * 1000)),
		},
	});

	const globalRole = await Db.collections.Role.findOne({ where: { scope: 'global' } });
	const adminUser = await Db.collections.User.findOne({ where: { globalRoleId: globalRole!.id } });
	const promises: Promise<boolean>[] = [];

	for (const resumeWorkflowTimerRecord of resumeWorkflowTimerRecords) {
		// TODO: Get new execution id
		const newExecutionId = 'placeholder'; // getExecutionId(resumeWorkflowTimerRecord.executionId)

		const executionPayload = {
			user: adminUser!,
			params: {
				id: newExecutionId,
			},
			body: {
				loadWorkflow: true,
			},
		} as ExecutionRequest.Retry;

		promises.push(ExecutionsService.retryExecution(executionPayload, resumeWorkflowTimerRecord.id));
	}

	await Promise.allSettled(promises);
}
