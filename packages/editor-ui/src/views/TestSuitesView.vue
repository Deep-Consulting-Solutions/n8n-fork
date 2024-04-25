<template>
	<workflows-list-layout ref="layout" resource-key="workflows" :resources="allWorkflows" :filters="filters"
		:additional-filters-handler="onFilter" :initialize="initialize" @update:filters="filters = $event">
		<template #default="{ data, updateItemSize }">
			<test-suite-card data-test-id="resources-list-item" class="mb-2xs" :data="data"
				@expand:tags="updateItemSize(data)" />
		</template>
		<template #empty>
			<div class="text-center mt-s">
				<n8n-text size="large" color="text-base">
					{{ $locale.baseText('testSuites.workflows.empty.description') }}
				</n8n-text>
			</div>
		</template>
		<template #filters="{ setKeyValue }">
			<div class="mb-s">
				<n8n-input-label :label="$locale.baseText('workflows.filters.status')" :bold="false" size="small"
					color="text-base" class="mb-3xs" />
				<n8n-select :value="filters.status" @input="setKeyValue('status', $event)" size="medium">
					<n8n-option v-for="option in statusFilterOptions" :key="option.label" :label="option.label"
						:value="option.value">
					</n8n-option>
				</n8n-select>
			</div>
		</template>
	</workflows-list-layout>
</template>

<script lang="ts">
import { showMessage } from '@/mixins/showMessage';
import mixins from 'vue-typed-mixins';

import SettingsView from './SettingsView.vue';
import WorkflowsListLayout from '@/components/layouts/WorkflowsListLayout.vue';
import PageViewLayout from '@/components/layouts/PageViewLayout.vue';
import PageViewLayoutList from '@/components/layouts/PageViewLayoutList.vue';
import TestSuiteCard from '@/components/TestSuiteCard.vue';
import TemplateCard from '@/components/TemplateCard.vue';
import { debounceHelper } from '@/mixins/debounce';
import type Vue from 'vue';
import type { IWorkflowDb } from '@/Interface';
import { mapStores } from 'pinia';
import { useUIStore } from '@/stores/ui';
import { useWorkflowsStore } from '@/stores/workflows';

type IResourcesListLayoutInstance = Vue & { sendFiltersTelemetry: (source: string) => void };

const StatusFilter = {
	ACTIVE: true,
	DEACTIVATED: false,
	ALL: '',
};

const TestSuitesView = mixins(showMessage, debounceHelper).extend({
	name: 'TestSuitesView',
	components: {
		WorkflowsListLayout,
		TemplateCard,
		PageViewLayout,
		PageViewLayoutList,
		SettingsView,
		TestSuiteCard,
	},
	data() {
		return {
			filters: {
				search: '',
				ownedBy: '',
				sharedWith: '',
				status: StatusFilter.ALL,
				tags: [] as string[],
			},
		};
	},
	computed: {
		...mapStores(useUIStore, useWorkflowsStore),
		allWorkflows(): IWorkflowDb[] {
			return this.workflowsStore.allWorkflows;
		},
		hasActiveWorkflows(): boolean {
			return !!this.workflowsStore.activeWorkflows.length;
		},
		statusFilterOptions(): Array<{ label: string; value: string | boolean }> {
			return [
				{
					label: this.$locale.baseText('workflows.filters.status.all'),
					value: StatusFilter.ALL,
				},
				{
					label: this.$locale.baseText('workflows.filters.status.active'),
					value: StatusFilter.ACTIVE,
				},
				{
					label: this.$locale.baseText('workflows.filters.status.deactivated'),
					value: StatusFilter.DEACTIVATED,
				},
			];
		},
	},
	methods: {
		async initialize() {
			await Promise.all([
				this.workflowsStore.fetchAllWorkflows(),
				this.workflowsStore.fetchActiveWorkflows(),
			]);
		},
		onFilter(
			resource: IWorkflowDb,
			filters: { tags: string[]; search: string; status: string | boolean },
			matches: boolean,
		): boolean {
			if (filters.status !== '') {
				matches = matches && resource.active === filters.status;
			}

			return matches;
		},
		sendFiltersTelemetry(source: string) {
			(this.$refs.layout as IResourcesListLayoutInstance).sendFiltersTelemetry(source);
		},
	},
	watch: {
		'filters.tags'() {
			this.sendFiltersTelemetry('tags');
		},
	},
	mounted() {},
});

export default TestSuitesView;
</script>

<style lang="scss" module>
.actionsContainer {
	display: flex;
	justify-content: center;
}

.emptyStateCard {
	width: 192px;
	text-align: center;
	display: inline-flex;
	height: 230px;

	&+& {
		margin-left: var(--spacing-s);
	}

	&:hover {
		svg {
			color: var(--color-primary);
		}
	}
}

.emptyStateCardIcon {
	font-size: 48px;

	svg {
		width: 48px !important;
		color: var(--color-foreground-dark);
		transition: color 0.3s ease;
	}
}
</style>
