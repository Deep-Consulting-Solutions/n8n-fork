<template>
	<n8n-card :class="$style.cardLink">
		<div :class="$style.cardDescription">
			<div :class="$style.headerWrapper">
				<n8n-heading
					tag="h2"
					bold
					class="ph-no-capture"
					:class="$style.cardHeading"
					data-test-id="workflow-card-name"
				>
					Name: <n8n-text color="text-base"> {{ data.name }}</n8n-text>
					<br />
					ID: <n8n-text color="text-base"> {{ data.id }}</n8n-text>
					<br />
					Type: <n8n-text color="text-base"> {{ data.type || '' }}</n8n-text>
				</n8n-heading>
			</div>

			<div v-show="nodeOutput.outputType" :class="$style.flex1">
				<n8n-text bold>{{ displayedOutputType }}:</n8n-text>
				<n8n-text color="text-base">{{ displayedContent }}</n8n-text>
			</div>

			<div :class="$style.flexNorm">
				<n8n-button size="large" @click="editTestOutput">{{
					$locale.baseText('testSuites.edit')
				}}</n8n-button>
			</div>
		</div>
	</n8n-card>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { useUIStore } from '@/stores/ui.store';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { EDIT_TEST_SUITE_MODAL_KEY } from '@/constants';
import type { NodeOutputDb } from '@/Interface';

export default {
	name: 'TestSuiteNodeCard',
	props: {
		data: {
			type: Object,
			required: true,
			default: () => ({
				id: '',
				name: '',
				type: '',
			}),
		},
	},
	data() {
		return {
			displayedContent: '',
			displayedOutputType: '',
			nodeOutput: {
				id: '',
				workflowTestId: '',
				outputType: null,
				nodeId: '',
				errorMessage: '',
				data: null,
			} as NodeOutputDb,
			loading: true,
		};
	},
	computed: {
		...mapStores(useUIStore, useWorkflowsStore),
	},
	watch: {
		'workflowsStore.nodeOutputsById': {
			handler: 'handleNodeOutputsChange',
			deep: true,
			immediate: true,
		},
	},
	created() {
		this.getNodeOutput();
	},
	methods: {
		async handleNodeOutputsChange() {
			await this.getNodeOutput();
		},
		async getNodeOutput() {
			const nodeId = this.data.id;
			let nodeOutput = this.workflowsStore.nodeOutputsById[nodeId] || {};
			let outputType = null;
			let displayedContent = '';
			let displayedOutputType = '';
			if (nodeOutput.data) {
				displayedContent = nodeOutput.data;
				outputType = 'data';
				displayedOutputType = 'Output';
			} else if (nodeOutput.errorMessage) {
				displayedContent = nodeOutput.errorMessage;
				outputType = 'error';
				displayedOutputType = 'Error';
			}
			this.displayedContent = displayedContent;
			this.displayedOutputType = displayedOutputType;
			nodeOutput = {
				...nodeOutput,
				outputType,
			};
			this.nodeOutput = nodeOutput;
			this.loading = false;
		},
		editTestOutput() {
			this.openEditTestModal();
		},
		openEditTestModal() {
			this.uiStore.openModalWithData({
				name: EDIT_TEST_SUITE_MODAL_KEY,
				data: {
					...this.data,
					nodeOutput: this.nodeOutput,
				},
			});
		},
	},
};
</script>

<style lang="scss" module>
.cardLink {
	transition: box-shadow 0.3s ease;
	&:hover {
		box-shadow: 0 2px 8px rgba(#441c17, 0.1);
	}
}
.cardHeading {
	font-size: var(--font-size-s);
	word-break: break-word;
}
.cardDescription {
	min-height: 19px;
	display: flex;
	justify-content: space-between;
	flex-flow: nowrap;
	gap: 16px;
}
.headerWrapper {
	min-width: 295px;
}
.flex1 {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex: 1;
}
.flexNorm {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
</style>
