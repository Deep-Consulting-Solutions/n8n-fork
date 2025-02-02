<template>
	<div>
		<iframe class="swagger-iframe" ref="swaggerIframe" :src="swaggerIframeURL" />
	</div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PropType } from 'vue';
import mixins from 'vue-typed-mixins';
import type {
	INodeParameters,
	INodeProperties,
	IWebhookDescription,
	INodeTypeDescription,
} from 'n8n-workflow';
import { jsonParse } from 'n8n-workflow';

import type { INodeUi } from '@/Interface';
import { workflowHelpers } from '@/mixins/workflowHelpers';

import base from './base.json';

interface Data {
	input: string;
	isFirstMount: boolean;
	suppressEvent: boolean;
	swaggerIframeURL: string;
	runOtherListeners: boolean;
	swaggerElement: any;
}

interface PathParameter {
	in: 'query' | 'path';
	required: boolean;
	name: string;
	schema: {
		type: 'string' | 'number';
		default?: string | number;
	};
}

export default mixins(workflowHelpers).extend({
	name: 'SwaggerEditor',
	props: {
		parameters: {
			type: Array as PropType<INodeProperties[]>,
			required: true,
		},
		nodeValues: {
			type: Object as PropType<INodeParameters>,
			required: true,
		},
		node: {
			type: Object as PropType<INodeUi>,
			required: true,
		},
		nodeType: {
			type: Object as PropType<INodeTypeDescription>,
			required: true,
		},
		path: {
			type: String,
			required: true,
		},
	},
	data(): Data {
		return {
			isFirstMount: true,
			suppressEvent: false,
			runOtherListeners: false,
			swaggerElement: null,
			input: JSON.stringify(base, null, 2),
			swaggerIframeURL:
				import.meta.env.MODE === 'production'
					? '/deep-consulting-swagger'
					: 'http://localhost:3000',
		};
	},
	mounted() {
		this.swaggerElement = this.$refs.swaggerIframe;
		const swaggerValue = this.$props.nodeValues.parameters.swagger;
		localStorage.setItem('swagger-editor-content', swaggerValue);

		if (!swaggerValue || swaggerValue === '{}') {
			const spec = this.updateSpec(this.$props.nodeValues);
			localStorage.setItem('swagger-editor-content', spec);
		}

		window.addEventListener('message', this.messageHandler);
	},
	computed: {
		webhooksNode(): IWebhookDescription[] {
			const { nodeType } = this.$props;

			if (nodeType === null || nodeType.webhooks === undefined) {
				return [];
			}

			return (nodeType as INodeTypeDescription).webhooks!.filter(
				(webhookData) => webhookData.restartWebhook !== true,
			);
		},
	},
	methods: {
		messageHandler(ev: MessageEvent) {
			if (this.runOtherListeners) {
				if (ev.data.name === 'editor_onChange' && ev.data.body) {
					this.parseSpec(ev.data.body);
					this.input = ev.data.body;
					return;
				}
			}

			if (ev.data.name === 'editor_loaded') {
				this.isFirstMount = true;
				this.updateSpec(this.$props.nodeValues);
				this.runOtherListeners = true;
				return;
			}
		},
		parsePath(path: string, method: string) {
			if (!path) return {};

			const pathVariables = path.match(/:\w+/g);

			const pvMap = pathVariables?.map((variable) => ({
				in: 'path',
				required: true,
				name: variable.slice(1),
				schema: { type: 'string' },
			}));

			const stringPath = `/${path.replaceAll(/:\w+/g, (match) => `{${match.slice(1)}}`)}`;

			const baseObject = {
				[stringPath]: {
					[method]: {
						parameters: pvMap,
						responses: {
							200: {
								description: 'Request was successful.',
							},
						},
					},
				},
			};

			const queryIndex = stringPath.indexOf('?');

			if (queryIndex === -1) return baseObject;

			const queryString = new URLSearchParams(stringPath.slice(queryIndex));

			const qvMap = Array.from(queryString.entries()).map(([key, value]) => ({
				name: key,
				in: 'query',
				required: true,
				schema: { type: 'string', ...(value && { default: value }) },
			}));

			const newPath = stringPath.slice(0, queryIndex);

			baseObject[newPath] = baseObject[stringPath];
			delete baseObject[stringPath];

			baseObject[newPath][method].parameters = (
				baseObject[newPath][method].parameters || []
			).concat(qvMap);

			return baseObject;
		},
		updateSpec(values: INodeParameters): string {
			const swagger = this.$props.nodeValues.parameters.swagger;
			if (this.suppressEvent) {
				this.suppressEvent = false;
				return swagger;
			}

			if (this.isFirstMount) {
				this.isFirstMount = false;
				this.suppressEvent = true;

				if (swagger !== '{}') {
					this.swaggerElement?.contentWindow?.postMessage(
						{
							body: swagger,
							name: 'editor_change',
						},
						'*',
					);
					return swagger;
				}
			}

			const path = this.getParameterValue(values, 'path', 'parameters');
			const auth = this.getParameterValue(values, 'authentication', 'parameters');

			const httpMethod = this.getParameterValue(values, 'httpMethod', 'parameters') as string;
			const method = (httpMethod || 'GET').toLowerCase();

			let copy;

			if (typeof this.input === 'string') {
				try {
					copy = JSON.parse(this.input);
				} catch {
					//
				}
			} else copy = this.input;

			if (!copy) copy = base;

			copy.paths = this.parsePath(path as string, method);

			if (!auth || auth === 'none') {
				if (copy.components?.securitySchemes) {
					delete copy.security;
					delete copy.components.securitySchemes;
				}
			} else {
				if (!copy.components) copy.components = {};

				(copy.components as any).securitySchemes = {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
					},
				};

				(copy.security as any) = [
					{
						bearerAuth: [],
					},
				];
			}

			copy.servers = [
				{
					url: this.rootStore.getWebhookTestUrl,
					description: 'test',
				},
				{
					url: this.rootStore.getWebhookUrl,
					description: 'production',
				},
			];

			const copyString = JSON.stringify(copy, null, '\t');
			this.swaggerElement?.contentWindow?.postMessage(
				{
					body: copyString,
					name: 'editor_change',
				},
				'*',
			);

			this.input = copyString;
			this.$emit('valuesChanged', {
				node: this.$props.node.name,
				name: 'parameters.swagger',
				value: copyString,
			});

			return copyString;
		},
		reconstructPath(paths: Record<string, any>): string {
			try {
				const [pathString, pathObject] = Object.entries(paths)[0];

				const { parameters = [] } = Object.values<{ parameters: PathParameter[] }>(pathObject)[0];

				let stringCopy = pathString.slice(1);
				const queryString = new URLSearchParams();

				parameters.forEach((parameter) => {
					if (parameter.in === 'path') {
						const stringToFind = `{${parameter.name}}`;
						const doesStringExist = stringCopy.indexOf(stringToFind);

						if (doesStringExist !== -1) {
							stringCopy = stringCopy.replace(
								new RegExp(stringToFind),
								(subString) => `:${subString.slice(1, -1)}`,
							);
						} else {
							if (stringCopy.endsWith('/')) {
								stringCopy += `:${parameter.name}`;
							} else stringCopy += `/:${parameter.name}`;
						}
					} else if (parameter.in === 'query') {
						queryString.set(parameter.name, '' + (parameter.schema.default || ''));
					}
				});

				if (queryString.toString()) return `${stringCopy}?${queryString.toString()}`;

				return stringCopy;
			} catch {
				return '';
			}
		},
		parseSpec(body: string) {
			const { path, swagger, httpMethod, authentication } = this.$props.nodeValues.parameters;

			const specObject = jsonParse<Record<string, any | undefined>>(body);

			const parameterValue = {
				node: this.$props.node.name,
				name: 'parameters',
				value: {
					'parameters.path': path,
					'parameters.swagger': swagger,
					'parameters.httpMethod': httpMethod,
					'parameters.authentication': authentication,
				},
			};

			// Authentication UI Element
			if (!specObject.components?.securitySchemes) {
				parameterValue.value['parameters.authentication'] = 'none';
			}

			// Swagger node value (only used for storing input in the editor)
			parameterValue.value['parameters.swagger'] = body;

			// Http Method UI Element.
			const route = Object.values(specObject.paths)[0];

			if (route) {
				const method: string | undefined = Object.keys(route)[0];

				if (['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'HEAD'].includes(method?.toUpperCase())) {
					parameterValue.value['parameters.httpMethod'] = method.toUpperCase();
				}
			}

			// Path UI element
			const nextPath = this.reconstructPath(specObject.paths);
			if (nextPath) {
				parameterValue.value['parameters.path'] = nextPath;
			}

			this.suppressEvent = true;
			this.$emit('valueChanged', parameterValue);
		},
	},
	watch: {
		nodeValues: {
			handler(nextValue: INodeParameters) {
				this.updateSpec(nextValue);
			},
			deep: true,
		},
	},
	beforeDestroy() {
		window.removeEventListener('message', this.messageHandler);
	},
});
</script>

<style lang="scss">
.swagger-iframe {
	width: 100% !important;
	height: 800px;
}
</style>
