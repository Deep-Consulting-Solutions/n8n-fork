<template>
	<TestsListLayout
		ref="layout"
		:test-suites="testSuites"
		:initialize="initialize"
		:current-work-flow-name="currentWorkFlow?.name || ''"
		@click:add="addTestSuite"
	>
		<template #default="{ data, updateItemSize }">
			<TestSuiteCard
				data-test-id="resources-list-item"
				class="mb-2xs"
				:data="data"
				:is-test-card="true"
				@expand:tags="updateItemSize(data)"
			/>
		</template>
		<template #empty>
			<div class="text-center mt-s">
				<n8n-text size="large" color="text-base">
					{{ $locale.baseText('testSuites.workflows.tests.empty.description') }}
				</n8n-text>
			</div>
		</template>
	</TestsListLayout>
</template>

<script lang="ts">
import TestsListLayout from '@/components/TestsListLayout.vue';
import TestSuiteCard from '@/components/TestSuiteCard.vue';
import type { IWorkflowDb, TestSuiteDb } from '@/Interface';
import { mapStores } from 'pinia';
import { useUIStore } from '@/stores/ui.store';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { ADD_TEST_SUITE_MODAL_KEY } from '@/constants';

const StatusFilter = {
	ACTIVE: true,
	DEACTIVATED: false,
	ALL: '',
};

export default {
	name: 'TestSuitesView',
	components: {
		TestsListLayout,
		TestSuiteCard,
	},
	data() {
		return {};
	},
	computed: {
		...mapStores(useUIStore, useWorkflowsStore),
		currentWorkFlow(): IWorkflowDb | null {
			return this.workflowsStore.workflowsById[this.$route.params.workflow as string] || null;
		},
		testSuites(): TestSuiteDb[] {
			return this.workflowsStore.allTestSuites;
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
	mounted() {
		this.workflowsStore.resetWorkflowTestSuites();
	},
	methods: {
		async initialize() {
			await this.workflowsStore.fetchWorkflow(this.$route.params.workflow as string);
			await this.workflowsStore.fetchWorkflowTestSuites(this.$route.params.workflow as string);
		},
		addTestSuite() {
			this.openAddTestModal();
		},
		openAddTestModal(): void {
			this.uiStore.openModalWithData({
				name: ADD_TEST_SUITE_MODAL_KEY,
				data: { workflow: this.$route.params.workflow },
			});
		},
	},
};
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
	& + & {
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
