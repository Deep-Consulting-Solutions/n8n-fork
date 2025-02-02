import type { INodeProperties } from 'n8n-workflow';

import { ZohoCalendarModule } from '../types';
import { getCrudFields, getCrudOperations } from './SharedFields';

export const eventOperations: INodeProperties[] = [
	getCrudOperations(ZohoCalendarModule.EVENTS, 'an', [
		{
			name: 'Get By Instance',
			value: 'getByInstance',
			description: 'Get events by instance',
			action: 'Get events by instance',
		},
	]),
];

export const eventFields: INodeProperties[] = [
    {
        displayName: `Calendar ID`,
		name: `calendarId`,
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['events'],
                operation: ['create', 'update', 'delete', 'get', 'getAll', 'getByInstance'],
            },
        },
    },
	...getCrudFields(ZohoCalendarModule.EVENTS),
    {
        displayName: `ETag`,
		name: `eTag`,
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['events'],
                operation: ['delete', 'update'],
            },
        },
    },
	{
        displayName: `Date and Time`,
		name: `dateandtime`,
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['events'],
                operation: ['update'],
            },
        },
    },
	{
        displayName: `Range`,
		name: `range`,
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['events'],
                operation: ['getByInstance'],
            },
        },
    },
    {
		displayName: 'Event Data',
		name: 'eventData',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Event Data',
		default: {},
		displayOptions: {
			show: {
				resource: ['events'],
				operation: ['delete'],
			},
		},
		options: [
			{
				name: 'fields',
				displayName: 'Fields',
				values: [
					{
						displayName: 'Field',
						name: 'key',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
];
