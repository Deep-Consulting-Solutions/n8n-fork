import type { INodeProperties } from 'n8n-workflow';

import { ZohoCalendarModule } from '../types';
import { getCrudFields, getCrudOperations } from './SharedFields';

export const calendarOperations: INodeProperties[] = [
	getCrudOperations(ZohoCalendarModule.CALENDARS, 'a', []),
];

export const calendarFields: INodeProperties[] = [
	...getCrudFields(ZohoCalendarModule.CALENDARS),
];
