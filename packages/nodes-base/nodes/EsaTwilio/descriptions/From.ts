import type { INodeProperties } from 'n8n-workflow';

export const messagingServiceValue = 'messagingService';
const messagingServiceName = 'Messaging Service';
export const numberValue = 'number';
const numberName = 'Number';
const fromValue = 'from';

export const DEFAULT_MESSAGING_SERVICE_CUSTOM_SID = 'DEFAULT_MESSAGING_SERVICE_CUSTOM_SID';

export const fromOptions: INodeProperties[] = [
	{
		displayName: 'From',
		name: fromValue,
		type: 'options',
		displayOptions: {
			show: {
				operation: ['send'],
				resource: ['sms'],
			},
		},
		options: [
			{
				name: numberName,
				value: numberValue,
			},
			{
				name: messagingServiceName,
				value: messagingServiceValue,
			},
		],
		default: messagingServiceValue,
		required: true,
	},
	{
		displayName: 'From',
		name: 'from',
		type: 'string',
		default: '',
		placeholder: '+14155238886',
		required: true,
		displayOptions: {
			show: {
				operation: ['make'],
				resource: ['call'],
			},
		},
		description: 'The number from which to send the message',
	},
];

export const fromFields: INodeProperties[] = [
	// ----------------------------------------
	//           from: number
	// ----------------------------------------
	{
		displayName: numberName,
		name: numberValue,
		type: 'string',
		default: '',
		placeholder: '+14155238886',
		required: true,
		displayOptions: {
			show: {
				operation: ['send'],
				resource: ['sms'],
				[fromValue]: [numberValue],
			},
		},
		hint: 'The number from which to send the message',
	},

	// ----------------------------------------
	//            from: messaging service
	// ----------------------------------------

	{
		displayName:
			'The project messaging service should be used to receive message state updates from twilio to use it in the SMS chat reusable',
		name: 'messagingServiceNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				operation: ['send'],
				resource: ['sms'],
			},
		},
	},
	{
		displayName: messagingServiceName,
		name: messagingServiceValue,
		hint: 'The messaging service from which to send the message',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		type: 'options',
		required: true,
		default: DEFAULT_MESSAGING_SERVICE_CUSTOM_SID,
		displayOptions: {
			show: {
				operation: ['send'],
				resource: ['sms'],
				[fromValue]: [messagingServiceValue],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getMessagingServicesOptions',
		},
	},
];
