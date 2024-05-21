import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	throwOnEmptyUpdate,
	titleCase,
} from './GenericFunctions';

import { ZohoCalendarModule, moduleSingularForm } from './types';

import {
	calendarFields,
	calendarOperations,
	eventFields,
	eventOperations,
} from './descriptions';
import { getResourceIdNameFields } from './descriptions/SharedFields';
import { zohoClient } from '../../lib';

const resources = Object.entries(ZohoCalendarModule).map(([key, value]) => {
	return {
		name: titleCase(key.toLowerCase()),
		value,
	};
});

export class DcsZohoCalendar implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DCS Zoho Calendar',
		name: 'dcsZohoCalendar',
		icon: 'file:zoho.svg',
		group: ['transform'],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		version: 1,
		description: 'Consume Zoho Calendar API',
		defaults: {
			name: 'DCS Zoho Calendar',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [...resources],
				default: ZohoCalendarModule.CALENDARS,
			},
			...calendarOperations,
			...calendarFields,
			...eventOperations,
			...eventFields,
		],
	};

	methods = {
		loadOptions: {
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as ZohoCalendarModule;
		const operation = this.getNodeParameter('operation', 0);

		let responseData: any;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'calendars') {
					// **********************************************************************
					//                                calendars
					// **********************************************************************
					if (operation === 'create') {
						// ----------------------------------------
						//             calendar: create
						// ----------------------------------------
						const body: IDataObject = {};
						const fields = this.getNodeParameter('fields', i) as {
							fields?: { key: string; value: string }[];
						};
						if (fields.fields) {
							fields.fields.forEach((parameter) => {
								body[parameter.key] = parameter.value;
							});
						}
						const uriEncodedBody = encodeURIComponent(JSON.stringify(body));
						const qs = {calendarData: uriEncodedBody};
						responseData = await zohoClient().calendar().passRequestAsProxy({
							method: 'POST',
							url: 'calendars',
							data: {},
							params: qs,
						})
						responseData = responseData[resource];
					} else if (operation === 'delete') {
						// ----------------------------------------
						//             delete
						// ----------------------------------------
						const recordId = this.getNodeParameter(
							getResourceIdNameFields(resource).name,
							i,
						) as string;
						responseData = await zohoClient().calendar().passRequestAsProxy({
							method: 'DELETE',
							url: `calendars/${recordId}`,
							data: {},
							params: {},
						})
						responseData = responseData[resource];
					} else if (operation === 'get') {
						// ----------------------------------------
						//             get
						// ----------------------------------------
						const recordId = this.getNodeParameter(
							getResourceIdNameFields(resource).name,
							i,
						) as string;
						responseData = await zohoClient().calendar().passRequestAsProxy({
							method: 'GET',
							url: `calendars/${recordId}`,
							data: {},
							params: {},
						})
						responseData = responseData[resource];
					} else if (operation === 'getAll') {
						// ----------------------------------------
						//             getAll
						// ----------------------------------------
						const qs: { [key: string]: any; } = {};

						const returnAll = this.getNodeParameter('returnAll', 0);
						const queryParameters = this.getNodeParameter('queryParameters', i) as {
							queryParameterValues?: { key: string; value: string }[];
						};
						if (queryParameters.queryParameterValues) {
							queryParameters.queryParameterValues.forEach((parameter) => {
								qs[parameter.key] = parameter.value;
							});
						}

						if (returnAll) {
							let returnData: IDataObject[] = [];
							let hasMore = true;
							qs.page = 1;

							while (hasMore) {
								responseData = await zohoClient().calendar().passRequestAsProxy({
									method: 'GET',
									url: 'calendars',
									data: {},
									params: {},
								})
								if (Array.isArray(responseData[resource])) {
									returnData = returnData.concat(responseData[resource]);
								}
								hasMore = responseData?.page_context?.has_more_page;
								qs.page += 1;
							}
							responseData = returnData;
						} else {
							responseData = await zohoClient().calendar().passRequestAsProxy({
								method: 'GET',
								url: 'calendars',
								data: {},
								params: {},
							});
							responseData = responseData[resource];
						}
					} else if (operation === 'update') {
						// ----------------------------------------
						//             update
						// ----------------------------------------
						const body: IDataObject = {};
						const recordId = this.getNodeParameter(
							getResourceIdNameFields(resource).name,
							i,
						) as string;
						const fields = this.getNodeParameter('fields', i) as {
							fields?: { key: string; value: string }[];
						};
						if (fields.fields) {
							fields.fields.forEach((parameter) => {
								body[parameter.key] = parameter.value;
							});
						}
						if (!Object.keys(body).length) {
							throwOnEmptyUpdate.call(this, moduleSingularForm[resource] as any);
						}
						const uriEncodedBody = encodeURIComponent(JSON.stringify(body));
						const qs = {calendarData: uriEncodedBody};
						responseData = await zohoClient().calendar().passRequestAsProxy({
							method: 'PUT',
							url: `calendars/${recordId}`,
							data: {},
							params: qs,
						})
						responseData = responseData[resource];
					}
				} else if (resource === 'events') {
					// **********************************************************************
					//                                events
					// **********************************************************************
					if (operation === 'create') {
						// ----------------------------------------
						//             calendar: create
						// ----------------------------------------
						const body: IDataObject = {};
						const fields = this.getNodeParameter('fields', i) as {
							fields?: { key: string; value: string }[];
						};
						if (fields.fields) {
							fields.fields.forEach((parameter) => {
								body[parameter.key] = parameter.value;
							});
						}
						const calendarId = this.getNodeParameter(
							getResourceIdNameFields('calendars' as ZohoCalendarModule).name,
							i,
						) as string;
						const uriEncodedBody = encodeURIComponent(JSON.stringify(body));
						const qs = {eventdata: uriEncodedBody};
						responseData = await zohoClient().calendar().passRequestAsProxy({
							method: 'POST',
							url: `calendars/${calendarId}/events`,
							data: {},
							params: qs,
						})
						responseData = responseData[resource];
					} else if (operation === 'delete') {
						// ----------------------------------------
						//             delete
						// ----------------------------------------
						const eventId = this.getNodeParameter(
							getResourceIdNameFields(resource).name,
							i,
						) as string;
						const calendarId = this.getNodeParameter(
							getResourceIdNameFields('calendars' as ZohoCalendarModule).name,
							i,
						) as string;
						responseData = await zohoClient().calendar().passRequestAsProxy({
							method: 'DELETE',
							url: `calendars/${calendarId}/events/${eventId}`,
							data: {},
							params: {},
						})
						responseData = responseData[resource];
					} else if (operation === 'get') {
						// ----------------------------------------
						//             get
						// ----------------------------------------
						const qs: { [key: string]: any; } = {};

						const recordId = this.getNodeParameter(
							getResourceIdNameFields(resource).name,
							i,
						) as string;
						const calendarId = this.getNodeParameter(
							getResourceIdNameFields('calendars' as ZohoCalendarModule).name,
							i,
						) as string;

						const queryParameters = this.getNodeParameter('queryParameters', i) as {
							queryParameterValues?: { key: string; value: string }[];
						};
						if (queryParameters.queryParameterValues) {
							queryParameters.queryParameterValues.forEach((parameter) => {
								qs[parameter.key] = parameter.value;
							});
						}

						responseData = await zohoClient().calendar().passRequestAsProxy({
							method: 'GET',
							url: `calendars/${calendarId}/events/${recordId}`,
							data: {},
							params: qs,
						})
						responseData = responseData[resource];
					} else if (operation === 'getAll') {
						// ----------------------------------------
						//             getAll
						// ----------------------------------------
						const qs: { [key: string]: any; } = {};

						const returnAll = this.getNodeParameter('returnAll', 0);
						const queryParameters = this.getNodeParameter('queryParameters', i) as {
							queryParameterValues?: { key: string; value: string }[];
						};
						if (queryParameters.queryParameterValues) {
							queryParameters.queryParameterValues.forEach((parameter) => {
								qs[parameter.key] = parameter.value;
							});
						}

						const calendarId = this.getNodeParameter(
							getResourceIdNameFields('calendars' as ZohoCalendarModule).name,
							i,
						) as string;

						if (returnAll) {
							let returnData: IDataObject[] = [];
							let hasMore = true;
							qs.page = 1;

							while (hasMore) {
								responseData = await zohoClient().calendar().passRequestAsProxy({
									method: 'GET',
									url: `calendars/${calendarId}/events`,
									data: {},
									params: {},
								})
								if (Array.isArray(responseData[resource])) {
									returnData = returnData.concat(responseData[resource]);
								}
								hasMore = responseData.page_context?.has_more_page;
								qs.page += 1;
							}
							responseData = returnData;
						} else {
							qs.per_page = this.getNodeParameter('limit', 0) || 200;
							responseData = await zohoClient().calendar().passRequestAsProxy({
								method: 'GET',
								url: `calendars/${calendarId}/events`,
								data: {},
								params: {},
							})
							responseData = responseData[resource];
						}
					} else if (operation === 'update') {
						// ----------------------------------------
						//             update
						// ----------------------------------------
						const body: IDataObject = {};
						const recordId = this.getNodeParameter(
							getResourceIdNameFields(resource).name,
							i,
						) as string;
						const fields = this.getNodeParameter('fields', i) as {
							fields?: { key: string; value: string }[];
						};
						if (fields.fields) {
							fields.fields.forEach((parameter) => {
								body[parameter.key] = parameter.value;
							});
						}
						if (!Object.keys(body).length) {
							throwOnEmptyUpdate.call(this, moduleSingularForm[resource] as any);
						}
						const calendarId = this.getNodeParameter(
							getResourceIdNameFields('calendars' as ZohoCalendarModule).name,
							i,
						) as string;

						const uriEncodedBody = encodeURIComponent(JSON.stringify(body));
						const qs = {eventdata: uriEncodedBody};
						responseData = await zohoClient().calendar().passRequestAsProxy({
							method: 'PUT',
							url: `calendars/${calendarId}/events/${recordId}`,
							data: {},
							params: qs,
						})
						responseData = responseData[resource];
					}
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message, json: {} });
					continue;
				}
				throw error;
			}
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
		}

		return this.prepareOutputData(returnData);
	}
}
