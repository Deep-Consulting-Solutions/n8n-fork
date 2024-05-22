import type { INodeProperties, INodePropertyOptions, INodePropertyCollection } from 'n8n-workflow';
import { ZohoCalendarModule, moduleSingularForm } from '../types';
import { capitalizeInitial } from '../GenericFunctions';
import { camelCase } from 'lodash';

export const makeGetAllFields = (resource: ZohoCalendarModule): INodeProperties[] => {
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['getAll'],
				},
			},
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			default: 50,
			description: 'Max number of results to return',
			typeOptions: {
				minValue: 1,
			},
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['getAll'],
					returnAll: [false],
				},
			},
		},
		{
			displayName: 'Query Parameters',
			name: 'queryParameters',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			placeholder: 'Add Query Parameters',
			default: {},
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['getAll'],
				},
			},
			options: [
				{
					name: 'queryParameterValues',
					displayName: 'Query Parameters',
					values: [
						{
							displayName: 'Key',
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
};

export const makeModuleFieldsFixedCollection = (resource: ZohoCalendarModule, operations: Array<string>): INodeProperties => {
	return {
		displayName: 'Fields',
		name: 'fields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Fields',
		default: {},
		displayOptions: {
			show: {
				resource: [resource],
				operation: operations,
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
	};
};

export const getCrudOperations = (
	resource: ZohoCalendarModule,
	article: 'a' | 'an',
	otherOptions?: Array<INodePropertyOptions | INodeProperties | INodePropertyCollection>,
): INodeProperties => {
	const singularForm = moduleSingularForm[resource];

	return {
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [resource],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: `Create ${article} ${singularForm}`,
				action: `Create ${article} ${singularForm}`,
			},
			{
				name: 'Delete',
				value: 'delete',
				description: `Delete ${article} ${singularForm}`,
				action: `Delete ${article} ${singularForm}`,
			},
			{
				name: 'Get',
				value: 'get',
				description: `Get ${article} ${singularForm}`,
				action: `Get ${article} ${singularForm}`,
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: `Get many ${resource}`,
				action: `Get many ${resource}`,
			},
			{
				name: 'Update',
				value: 'update',
				description: `Update ${article} ${singularForm}`,
				action: `Update ${article} ${singularForm}`,
			},
			...(otherOptions ? otherOptions : []),
		],
		default: 'create',
	};
};

export const getResourceIdNameFields = (resource: ZohoCalendarModule) => {
	const singularForm = moduleSingularForm[resource];
	return {
		displayName: `${capitalizeInitial(singularForm)} ID`,
		name: `${camelCase(singularForm)}Id`,
	};
};

export const getCrudFields = (resource: ZohoCalendarModule): INodeProperties[] => {
	return [
		// ----------------------------------------
		//             delete, get, getByInstance
		// ----------------------------------------
		{
			...getResourceIdNameFields(resource),
			type: 'string',
			required: true,
			default: '',
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['delete', 'get', 'getByInstance'],
				},
			},
		},

		// ----------------------------------------
		//             getAll
		// ----------------------------------------
		...makeGetAllFields(resource),

		// ----------------------------------------
		//             update
		// ----------------------------------------
		{
			...getResourceIdNameFields(resource),
			type: 'string',
			required: true,
			default: '',
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['update'],
				},
			},
		},

		// ----------------------------------------
		//             create, update
		// ----------------------------------------
		makeModuleFieldsFixedCollection(resource, ['create', 'update']),
	];
};
