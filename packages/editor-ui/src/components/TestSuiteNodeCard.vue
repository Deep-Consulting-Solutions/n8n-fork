<template>
	<n8n-card :class="$style.cardLink">
		<div :class="$style.cardDescription">
			<div :class="$style.flex1">
				<n8n-heading tag="h2" bold class="ph-no-capture" :class="$style.cardHeading" data-test-id="workflow-card-name">
					Name: {{ data.name }}
					<br />
					ID: {{ data.id }}
					<br />
					Type: {{ data.type || '' }}
				</n8n-heading>
			</div>

			<div :class="$style.flex1">
				<n8n-text size="large" color="text-base">
					{{ getOutput(data.id) }}
				</n8n-text>
			</div>
			<div :class="$style.flexNorm">
				<n8n-button size="large" @click="editTestOutput">
					{{ $locale.baseText('testSuites.edit') }}
				</n8n-button>
			</div>
		</div>
	</n8n-card>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins';
import { showMessage } from '@/mixins/showMessage';
import type Vue from 'vue';
import { mapStores } from 'pinia';
import { useUIStore } from '@/stores/ui';
import { useWorkflowsStore } from '@/stores/workflows';
import { EDIT_TEST_SUITE_MODAL_KEY } from '@/constants';

export default mixins(showMessage).extend({
	name: 'test-suite-node-card',
	data() {
		return {};
	},
	components: {},
	props: {
		data: {
			type: Object,
			required: true,
			default: {
				id: '',
				name: '',
				type: '',
			},
		},
	},
	computed: {
		...mapStores(useUIStore, useWorkflowsStore),
	},
	methods: {
		getOutput(id: string) {
			return id;
		},
		editTestOutput() {
			this.openEditTestModal();
		},
		openEditTestModal(): void {
			this.uiStore.openModalWithData({
				name: EDIT_TEST_SUITE_MODAL_KEY,
				data: this.data,
			});
		},
	},
});
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
	align-items: center;
	justify-content: flex-start;
	flex-flow: nowrap;
	gap: 16px;
}

.flex1 {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	flex: 1;
}

.flexNorm {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
</style>
