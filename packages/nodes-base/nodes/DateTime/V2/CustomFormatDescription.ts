import type { INodeProperties } from 'n8n-workflow';

export const CustomFormatDescription: INodeProperties[] = [
    {
        displayName: 'Date to format',
        name: 'date',
        displayOptions: {
            show: {
                action: ['customFormat'],
            },
        },
        type: 'string',
        default: '',
        description: 'The date that should be formatted',
        required: true,
    },
    {
        displayName: 'To Format',
        name: 'toFormat',
        type: 'options',
        displayOptions: {
            show: {
                action: ['customFormat'],
            },
        },
        // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
        options: [
            {
                // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
                name: '%A, %B %e, %Y at %l:%M %P %Z',
                value: '%A, %B %e, %Y at %l:%M %P %Z',
                description: 'Example: Wednesday, March 13, 2024 at 12:00 pm West Africa Standard Time',
            },
        ],
        default: '%A, %B %e, %Y at %l:%M %P %Z',
        description: 'The format to convert the date to',
    },
    {
        displayName: 'To Timezone Name or ID',
        name: 'toTimezone',
        type: 'options',
        displayOptions: {
            show: {
                action: ['customFormat'],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getTimezones',
        },
        default: 'UTC',
        description:
            'The timezone to convert to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
    },
	{
		displayName: 'Output Field Name',
		name: 'outputFieldName',
		type: 'string',
		default: 'currentDate',
		description: 'Name of the field to put the output in',
		displayOptions: {
			show: {
				operation: ['customFormat'],
			},
		},
	},
];
