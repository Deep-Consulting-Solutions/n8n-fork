import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class DcsWait implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DCS wait',
		name: 'dcsWait',
		icon: 'fa:pause-circle',
		group: ['organization'],
		version: 1,
		description: 'DCS wait node',
		defaults: {
			name: 'DCS wait',
			color: '#804050',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'httpBasicAuth',
				required: true,
				displayOptions: {
					show: {
						incomingAuthentication: ['basicAuth'],
					},
				},
			},
			{
				name: 'httpHeaderAuth',
				required: true,
				displayOptions: {
					show: {
						incomingAuthentication: ['headerAuth'],
					},
				},
			},
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Resume',
				name: 'resume',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'After Time Interval',
						value: 'timeInterval',
						description: 'Waits for a certain amount of time',
					},
					{
						name: 'At Specified Time',
						value: 'specificTime',
						description: 'Waits until a specific date and time to continue',
					},
				],
				default: 'timeInterval',
				description: 'Determines the waiting mode to use before the workflow continues',
			},
			// ----------------------------------
			//         resume:specificTime
			// ----------------------------------
			{
				displayName: 'Date and Time',
				name: 'dateTime',
				type: 'dateTime',
				displayOptions: {
					show: {
						resume: ['specificTime'],
					},
				},
				default: '',
				description: 'The date and time to wait for before continuing',
			},
			// ----------------------------------
			//         resume:timeInterval
			// ----------------------------------
			{
				displayName: 'Wait Amount',
				name: 'amount',
				type: 'number',
				displayOptions: {
					show: {
						resume: ['timeInterval'],
					},
				},
				typeOptions: {
					minValue: 0,
					numberPrecision: 2,
				},
				default: 1,
				description: 'The time to wait',
			},
			{
				displayName: 'Wait Unit',
				name: 'unit',
				type: 'options',
				displayOptions: {
					show: {
						resume: ['timeInterval'],
					},
				},
				options: [
					{
						name: 'Seconds',
						value: 'seconds',
					},
					{
						name: 'Minutes',
						value: 'minutes',
					},
					{
						name: 'Hours',
						value: 'hours',
					},
					{
						name: 'Days',
						value: 'days',
					},
				],
				default: 'hours',
				description: 'The time unit of the Wait Amount value',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resume = this.getNodeParameter('resume', 0) as string;
		let waitTill: Date;
		if (resume === 'timeInterval') {
			const unit = this.getNodeParameter('unit', 0) as string;

			let waitAmount = this.getNodeParameter('amount', 0) as number;
			if (unit === 'minutes') {
				waitAmount *= 60;
			}
			if (unit === 'hours') {
				waitAmount *= 60 * 60;
			}
			if (unit === 'days') {
				waitAmount *= 60 * 60 * 24;
			}

			waitAmount *= 1000;

			waitTill = new Date(new Date().getTime() + waitAmount);
		} else {
			// resume: dateTime
			const dateTime = this.getNodeParameter('dateTime', 0) as string;

			waitTill = new Date(dateTime);
		}

		const waitValue = Math.max(waitTill.getTime() - new Date().getTime(), 0);

		if (waitValue < 65000) {
			// If wait time is shorter than 65 seconds leave execution active because
			// we just check the database every 60 seconds.
			return new Promise((resolve, _reject) => {
				setTimeout(() => {
					resolve([this.getInputData()]);
				}, waitValue);
			});
		}

		// If longer than 60 seconds put execution to wait
		await this.putExecutionToWait(waitTill);

		return [this.getInputData()];
	}
}
