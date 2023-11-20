/* eslint-disable @typescript-eslint/no-var-requires */
import type {
	IWebhookFunctions,
	ICredentialDataDecryptedObject,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { BINARY_ENCODING, NodeOperationError } from 'n8n-workflow';
import { verifyCrmToken, verifyOauth2Token, verifyPortalToken } from './authentication';
import fs from 'fs';
import stream from 'stream';
import { promisify } from 'util';
import basicAuth from 'basic-auth';
import type { Response } from 'express';
import formidable from 'formidable';
import isbot from 'isbot';
import { file as tmpFile } from 'tmp-promise';
import type { OpenAPIRequestValidatorArgs } from 'openapi-request-validator';
import OpenAPIRequestValidator from 'openapi-request-validator';

const pipeline = promisify(stream.pipeline);

function authorizationError(resp: Response, realm: string, responseCode: number, message?: string) {
	if (message === undefined) {
		message = 'Authorization problem!';
		if (responseCode === 401) {
			message = 'Authorization is required!';
		} else if (responseCode === 403) {
			message = 'Authorization data is wrong!';
		}
	}

	resp.writeHead(responseCode, { 'WWW-Authenticate': `Basic realm="${realm}"` });
	resp.end(message);
	return {
		noWebhookResponse: true,
	};
}

export class Webhook implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Webhook',
		icon: 'file:webhook.svg',
		name: 'webhook',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when a webhook is called',
		eventTriggerDescription: 'Waiting for you to call the Test URL',
		activationMessage: 'You can now make calls to your production webhook URL.',
		defaults: {
			name: 'Webhook',
		},
		triggerPanel: {
			header: '',
			executionsHelp: {
				inactive:
					'Webhooks have two modes: test and production. <br /> <br /> <b>Use test mode while you build your workflow</b>. Click the \'listen\' button, then make a request to the test URL. The executions will show up in the editor.<br /> <br /> <b>Use production mode to run your workflow automatically</b>. <a data-key="activate">Activate</a> the workflow, then make requests to the production URL. These executions will show up in the executions list, but not in the editor.',
				active:
					'Webhooks have two modes: test and production. <br /> <br /> <b>Use test mode while you build your workflow</b>. Click the \'listen\' button, then make a request to the test URL. The executions will show up in the editor.<br /> <br /> <b>Use production mode to run your workflow automatically</b>. Since the workflow is activated, you can make requests to the production URL. These executions will show up in the <a data-key="executions">executions list</a>, but not in the editor.',
			},
			activationHint:
				'Once you’ve finished building your workflow, run it without having to click this button by using the production webhook URL.',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'httpBasicAuth',
				required: true,
				displayOptions: {
					show: {
						authentication: ['basicAuth'],
					},
				},
			},
			{
				name: 'httpHeaderAuth',
				required: true,
				displayOptions: {
					show: {
						authentication: ['headerAuth'],
					},
				},
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: '={{$parameter["httpMethod"]}}',
				isFullPath: true,
				responseCode: '={{$parameter["responseCode"]}}',
				responseMode: '={{$parameter["responseMode"]}}',
				responseData:
					'={{$parameter["responseData"] || ($parameter.options.noResponseBody ? "noData" : undefined) }}',
				responseBinaryPropertyName: '={{$parameter["responseBinaryPropertyName"]}}',
				responseContentType: '={{$parameter["options"]["responseContentType"]}}',
				responsePropertyName: '={{$parameter["options"]["responsePropertyName"]}}',
				responseHeaders: '={{$parameter["options"]["responseHeaders"]}}',
				path: '={{$parameter["path"]}}',
				swagger: '={{$parameter["swagger"]}}',
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Basic Auth',
						value: 'basicAuth',
					},
					{
						name: 'Client Portal Auth',
						value: 'clientPortalAuth',
					},
					{
						name: 'Header Auth',
						value: 'headerAuth',
					},
					{
						name: 'NocoDB Webhook Auth',
						value: 'nocoDBWebhookAuth',
					},
					{
						name: 'None',
						value: 'none',
					},
					{
						name: 'Oauth2 Token Auth',
						value: 'oauth2TokenAuth',
					},
					{
						name: 'Zoho CRM Auth',
						value: 'zohoCRMAuth',
					},
				],
				default: 'none',
				description: 'The way to authenticate',
			},
			{
				displayName: 'Roles (Optional)',
				name: 'roles',
				type: 'string',
				default: '',
				placeholder: 'Authorized roles (comma seperated values)',
				description: 'Specifies the roles within which the bearer must belong',
				displayOptions: {
					hide: {
						authentication: ['oauth2TokenAuth'],
					},
				},
			},
			{
				displayName: 'Scopes (Optional)',
				name: 'scopes',
				type: 'string',
				default: '',
				placeholder: 'Authorized scopes (comma separated values)',
				description: 'Specifies the scopes within which the bearer must belong',
				displayOptions: {
					show: {
						authentication: ['oauth2TokenAuth'],
					},
				},
			},
			{
				displayName: 'HTTP Method',
				name: 'httpMethod',
				type: 'options',
				options: [
					{
						name: 'DELETE',
						value: 'DELETE',
					},
					{
						name: 'GET',
						value: 'GET',
					},
					{
						name: 'HEAD',
						value: 'HEAD',
					},
					{
						name: 'PATCH',
						value: 'PATCH',
					},
					{
						name: 'POST',
						value: 'POST',
					},
					{
						name: 'PUT',
						value: 'PUT',
					},
				],
				default: 'GET',
				description: 'The HTTP method to listen to',
			},
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '',
				placeholder: 'webhook',
				required: true,
				description: 'The path to listen to',
			},
			{
				displayName: 'Respond',
				name: 'responseMode',
				type: 'options',
				options: [
					{
						name: 'Immediately',
						value: 'onReceived',
						description: 'As soon as this node executes',
					},
					{
						name: 'When Last Node Finishes',
						value: 'lastNode',
						description: 'Returns data of the last-executed node',
					},
					{
						name: "Using 'Respond to Webhook' Node",
						value: 'responseNode',
						description: 'Response defined in that node',
					},
				],
				default: 'onReceived',
				description: 'When and how to respond to the webhook',
			},
			{
				displayName:
					'Insert a \'Respond to Webhook\' node to control when and how you respond. <a href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/" target="_blank">More details</a>',
				name: 'webhookNotice',
				type: 'notice',
				displayOptions: {
					show: {
						responseMode: ['responseNode'],
					},
				},
				default: '',
			},
			{
				displayName: 'Response Code',
				name: 'responseCode',
				type: 'number',
				displayOptions: {
					hide: {
						responseMode: ['responseNode'],
					},
				},
				typeOptions: {
					minValue: 100,
					maxValue: 599,
				},
				default: 200,
				description: 'The HTTP Response code to return',
			},
			{
				displayName: 'Swagger',
				name: 'swagger',
				type: 'swaggerEditor',
				typeOptions: {
					editor: 'json',
					rows: 10,
				},
				default: '{}',
				required: true,
				description: 'JSON code for the Swagger docs to be displayed',
			},
			{
				displayName: 'Response Data',
				name: 'responseData',
				type: 'options',
				displayOptions: {
					show: {
						responseMode: ['lastNode'],
					},
				},
				options: [
					{
						name: 'All Entries',
						value: 'allEntries',
						description: 'Returns all the entries of the last node. Always returns an array.',
					},
					{
						name: 'First Entry JSON',
						value: 'firstEntryJson',
						description:
							'Returns the JSON data of the first entry of the last node. Always returns a JSON object.',
					},
					{
						name: 'First Entry Binary',
						value: 'firstEntryBinary',
						description:
							'Returns the binary data of the first entry of the last node. Always returns a binary file.',
					},
					{
						name: 'No Response Body',
						value: 'noData',
						description: 'Returns without a body',
					},
				],
				default: 'firstEntryJson',
				description:
					'What data should be returned. If it should return all items as an array or only the first item as object.',
			},
			{
				displayName: 'Property Name',
				name: 'responseBinaryPropertyName',
				type: 'string',
				required: true,
				default: 'data',
				displayOptions: {
					show: {
						responseData: ['firstEntryBinary'],
					},
				},
				description: 'Name of the binary property to return',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Binary Data',
						name: 'binaryData',
						type: 'boolean',
						displayOptions: {
							show: {
								'/httpMethod': ['PATCH', 'PUT', 'POST'],
							},
						},
						default: false,
						description: 'Whether the webhook will receive binary data',
					},
					{
						displayName: 'Binary Property',
						name: 'binaryPropertyName',
						type: 'string',
						default: 'data',
						required: true,
						displayOptions: {
							show: {
								binaryData: [true],
							},
						},
						description:
							'Name of the binary property to write the data of the received file to. If the data gets received via "Form-Data Multipart" it will be the prefix and a number starting with 0 will be attached to it.',
					},
					{
						displayName: 'Ignore Bots',
						name: 'ignoreBots',
						type: 'boolean',
						default: false,
						description:
							'Whether to ignore requests from bots like link previewers and web crawlers',
					},
					{
						displayName: 'No Response Body',
						name: 'noResponseBody',
						type: 'boolean',
						default: false,
						description: 'Whether to send any body in the response',
						displayOptions: {
							hide: {
								rawBody: [true],
							},
							show: {
								'/responseMode': ['onReceived'],
							},
						},
					},
					{
						displayName: 'Raw Body',
						name: 'rawBody',
						type: 'boolean',
						displayOptions: {
							hide: {
								binaryData: [true],
								noResponseBody: [true],
							},
						},
						default: false,
						// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
						description: 'Raw body (binary)',
					},
					{
						displayName: 'Response Data',
						name: 'responseData',
						type: 'string',
						displayOptions: {
							show: {
								'/responseMode': ['onReceived'],
							},
							hide: {
								noResponseBody: [true],
							},
						},
						default: '',
						placeholder: 'success',
						description: 'Custom response data to send',
					},
					{
						displayName: 'Response Content-Type',
						name: 'responseContentType',
						type: 'string',
						displayOptions: {
							show: {
								'/responseData': ['firstEntryJson'],
								'/responseMode': ['lastNode'],
							},
						},
						default: '',
						placeholder: 'application/xml',
						// eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-json
						description:
							'Set a custom content-type to return if another one as the "application/json" should be returned',
					},
					{
						displayName: 'Response Headers',
						name: 'responseHeaders',
						placeholder: 'Add Response Header',
						description: 'Add headers to the webhook response',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [
							{
								name: 'entries',
								displayName: 'Entries',
								values: [
									{
										displayName: 'Name',
										name: 'name',
										type: 'string',
										default: '',
										description: 'Name of the header',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Value of the header',
									},
								],
							},
						],
					},
					{
						displayName: 'Property Name',
						name: 'responsePropertyName',
						type: 'string',
						displayOptions: {
							show: {
								'/responseData': ['firstEntryJson'],
								'/responseMode': ['lastNode'],
							},
						},
						default: 'data',
						description: 'Name of the property to return the data of instead of the whole JSON',
					},
				],
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const authentication = this.getNodeParameter('authentication') as string;
		const options = this.getNodeParameter('options', {}) as IDataObject;
		const swagger = this.getNodeParameter('swagger', '{}') as Record<string, any>;

		const req = this.getRequestObject();
		const resp = this.getResponseObject();
		const headers = this.getHeaderData();
		const realm = 'Webhook';
		const ignoreBots = options.ignoreBots as boolean;
		const requestAuthData: {
			tokenData: Record<string, any>;
			authentication: string;
		} = {
			authentication,
			tokenData: null!,
		};

		if (ignoreBots && isbot((headers as IDataObject)['user-agent'] as string)) {
			return authorizationError(resp, realm, 403);
		}
		const [, token] = headers.authorization?.split(' ') || [];
		if (authentication === 'basicAuth') {
			// Basic authorization is needed to call webhook
			let httpBasicAuth: ICredentialDataDecryptedObject | undefined;
			try {
				httpBasicAuth = await this.getCredentials('httpBasicAuth');
			} catch (error) {
				// Do nothing
			}

			if (httpBasicAuth === undefined || !httpBasicAuth.user || !httpBasicAuth.password) {
				// Data is not defined on node so can not authenticate
				return authorizationError(resp, realm, 500, 'No authentication data defined on node!');
			}

			const basicAuthData = basicAuth(req);

			if (basicAuthData === undefined) {
				// Authorization data is missing
				return authorizationError(resp, realm, 401);
			}

			if (
				basicAuthData.name !== httpBasicAuth.user ||
				basicAuthData.pass !== httpBasicAuth.password
			) {
				// Provided authentication data is wrong
				return authorizationError(resp, realm, 403);
			}
		} else if (authentication === 'clientPortalAuth') {
			try {
				const authData = await verifyPortalToken(token, this.helpers.httpRequest);
				requestAuthData.tokenData = authData;
			} catch (error) {
				return authorizationError(
					resp,
					realm,
					401,
					(error?.message || error?.toString()) as string,
				);
			}
		} else if (authentication === 'zohoCRMAuth') {
			try {
				const authData = await verifyCrmToken(token, this.helpers.httpRequest);
				const roles = (this.getNodeParameter('roles', '') as string)
					?.trim()
					?.split(',')
					.filter((fragment) => !!fragment);
				if (
					roles?.length &&
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					!roles.includes(authData?.zohoUser?.role || authData?.zohoUser?.profile)
				) {
					return authorizationError(resp, realm, 403, 'User role is not authorized');
				}

				requestAuthData.tokenData = authData;
			} catch (error) {
				return authorizationError(
					resp,
					realm,
					401,
					(error?.message || error?.toString()) as string,
				);
			}
		} else if (authentication === 'oauth2TokenAuth') {
			try {
				const authData = await verifyOauth2Token(token, this.helpers.httpRequest);
				const scopes = (this.getNodeParameter('scopes', '') as string)
					?.trim()
					?.split(',')
					.filter((fragment) => !!fragment);
				if (scopes?.length && scopes.every((s) => authData?.user?.scopes.includes(s))) {
					return authorizationError(resp, realm, 403, 'User role is not authorized');
				}

				requestAuthData.tokenData = authData;
			} catch (error) {
				console.log('error authenticating with oauth2');
				console.error('token', token);
				console.error('error', error);
				return authorizationError(
					resp,
					realm,
					401,
					(error?.message || error?.toString()) as string,
				);
			}
		} else if (authentication === 'headerAuth') {
			// Special header with value is needed to call webhook
			let httpHeaderAuth: ICredentialDataDecryptedObject | undefined;
			try {
				httpHeaderAuth = await this.getCredentials('httpHeaderAuth');
			} catch (error) {
				// Do nothing
			}

			if (httpHeaderAuth === undefined || !httpHeaderAuth.name || !httpHeaderAuth.value) {
				// Data is not defined on node so can not authenticate
				return authorizationError(resp, realm, 500, 'No authentication data defined on node!');
			}
			const headerName = (httpHeaderAuth.name as string).toLowerCase();
			const headerValue = httpHeaderAuth.value as string;

			if (
				!headers.hasOwnProperty(headerName) ||
				(headers as IDataObject)[headerName] !== headerValue
			) {
				// Provided authentication data is wrong
				return authorizationError(resp, realm, 403);
			}
		} else if (authentication === 'nocoDBWebhookAuth') {
			const esaKey = headers['esa-key'];
			if (!esaKey) {
				return authorizationError(resp, realm, 401, 'esa-key is missing');
			}
			if (esaKey !== process.env.NOCODB_ESA_KEY) {
				return authorizationError(resp, realm, 401, 'esa-key is invalid');
			}
		}

		/*
			NOTE: mask and delete sensitive details from node output itemData to avoid security risk because n8n uses itemData for various
			purpose e.g executionsList and possibly telemetry and logging.
		*/
		const hiddenMsg = '-------- PROVIDED BUT HIDDEN ----------';
		if (headers.authorization) headers.authorization = hiddenMsg;

		if (authentication === 'clientPortalAuth') {
			delete requestAuthData.tokenData.iat;
			delete requestAuthData.tokenData.exp;
		} else if (authentication === 'zohoCRMAuth') {
			delete requestAuthData.tokenData.tokenDetails;
		} else if (authentication === 'nocoDBWebhookAuth') {
			if (headers['esa-key']) headers['esa-key'] = hiddenMsg;
		}

		const mimeType = headers['content-type'] ?? 'application/json';
		if (mimeType.includes('multipart/form-data')) {
			const form = new formidable.IncomingForm({ multiples: true });

			return new Promise((resolve, _reject) => {
				form.parse(req, async (err, data, files) => {
					const returnItem: INodeExecutionData = {
						binary: {},
						json: {
							authData: requestAuthData,
							headers,
							params: this.getParamsData(),
							query: this.getQueryData(),
							body: data,
						},
					};

					let count = 0;
					for (const xfile of Object.keys(files)) {
						const processFiles: formidable.File[] = [];
						let multiFile = false;
						if (Array.isArray(files[xfile])) {
							processFiles.push(...(files[xfile] as formidable.File[]));
							multiFile = true;
						} else {
							processFiles.push(files[xfile] as formidable.File);
						}

						let fileCount = 0;
						for (const file of processFiles) {
							let binaryPropertyName = xfile;
							if (binaryPropertyName.endsWith('[]')) {
								binaryPropertyName = binaryPropertyName.slice(0, -2);
							}
							if (multiFile) {
								binaryPropertyName += fileCount++;
							}
							if (options.binaryPropertyName) {
								binaryPropertyName = `${options.binaryPropertyName}${count}`;
							}

							const fileJson = file.toJSON();
							returnItem.binary![binaryPropertyName] = await this.nodeHelpers.copyBinaryFile(
								file.path,
								fileJson.name || fileJson.filename,
								fileJson.type as string,
							);

							count += 1;
						}
					}
					resolve({
						workflowData: [[returnItem]],
					});
				});
			});
		}

		if (options.binaryData === true) {
			const binaryFile = await tmpFile({ prefix: 'n8n-webhook-' });

			try {
				await pipeline(req, fs.createWriteStream(binaryFile.path));

				const returnItem: INodeExecutionData = {
					binary: {},
					json: {
						authData: requestAuthData,
						headers,
						params: this.getParamsData(),
						query: this.getQueryData(),
						body: this.getBodyData(),
					},
				};

				const binaryPropertyName = (options.binaryPropertyName || 'data') as string;
				returnItem.binary![binaryPropertyName] = await this.nodeHelpers.copyBinaryFile(
					binaryFile.path,
					mimeType,
				);

				return {
					workflowData: [[returnItem]],
				};
			} catch (error) {
				throw new NodeOperationError(this.getNode(), error as Error);
			} finally {
				await binaryFile.cleanup();
			}
		}
		let body = this.getBodyData();
		// parse request body if request is made from within NOCODB
		if (authentication === 'nocoDBWebhookAuth') {
			try {
				body = JSON.parse(Object.keys(body)[0]);
			} catch (error) {
				// Do nothing
			}
		}
		const response: INodeExecutionData = {
			json: {
				authData: requestAuthData,
				headers,
				params: this.getParamsData(),
				query: this.getQueryData(),
				body,
			},
		};
		// request body, query, params validation
		if (swagger) {
			// eslint-disable-next-line n8n-local-rules/no-uncaught-json-parse
			const parsedSwaggerDoc = JSON.parse(swagger as unknown as string);
			const endpointPaths = parsedSwaggerDoc?.paths as Record<string, any>;
			const endpoints = Object.keys(endpointPaths || {});
			const endpointPath = endpoints[0] || '';
			const method = (this.getNodeParameter('httpMethod') as string)?.toLowerCase();
			const parameters = endpointPaths?.[endpointPath]?.[method]
				?.parameters as OpenAPIRequestValidatorArgs['parameters'];
			const requestBody = endpointPaths?.[endpointPath]?.[method]
				?.requestBody as OpenAPIRequestValidatorArgs['requestBody'];

			if (parameters?.length || requestBody) {
				const componentSchemas = (parsedSwaggerDoc?.components?.schemas ||
					{}) as OpenAPIRequestValidatorArgs['componentSchemas'];

				const requestValidator = new OpenAPIRequestValidator({
					requestBody,
					parameters,
					componentSchemas,
				});
				const errors = requestValidator.validateRequest(response.json);
				if (errors) {
					const firstError = errors?.errors[0];
					return authorizationError(
						resp,
						realm,
						400,
						`${firstError?.message} in the request ${firstError?.location}`,
					);
				}
			}
		}

		if (options.rawBody) {
			response.binary = {
				data: {
					data: req.rawBody.toString(BINARY_ENCODING),
					mimeType,
				},
			};
		}

		let webhookResponse: string | undefined;
		if (options.responseData) {
			webhookResponse = options.responseData as string;
		}

		return {
			webhookResponse,
			workflowData: [[response]],
		};
	}
}
