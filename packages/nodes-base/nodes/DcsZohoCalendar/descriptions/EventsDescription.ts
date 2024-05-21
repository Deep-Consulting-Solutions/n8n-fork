import type { INodeProperties } from 'n8n-workflow';

import { ZohoCalendarModule } from '../types';
import { getCrudFields, getCrudOperations } from './SharedFields';

export const eventOperations: INodeProperties[] = [
	getCrudOperations(ZohoCalendarModule.EVENTS, 'an', []),
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
                operation: ['create', 'update', 'delete', 'get', 'getAll'],
            },
        },
    },
	...getCrudFields(ZohoCalendarModule.EVENTS),
];
