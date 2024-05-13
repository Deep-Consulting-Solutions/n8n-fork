<template>
	<tests-list-layout
		ref="layout"
		:testSuites="testSuites"
		:initialize="initialize"
		:currentWorkFlowName="currentWorkFlow?.name || ''"
		@click:add="addTestSuite"
	>
		<template #default="{ data, updateItemSize }">
			<test-suite-card
				data-test-id="resources-list-item"
				class="mb-2xs"
				:data="data"
				@expand:tags="updateItemSize(data)"
				:isTestCard="true"
			/>
		</template>
		<template #empty>
			<div class="text-center mt-s">
				<n8n-text size="large" color="text-base">
					{{ $locale.baseText('testSuites.workflows.tests.empty.description') }}
				</n8n-text>
			</div>
		</template>
	</tests-list-layout>
</template>
<script lang="ts">
import { showMessage } from '@/mixins/showMessage';
import mixins from 'vue-typed-mixins';
import SettingsView from './SettingsView.vue';
import TestsListLayout from '@/components/layouts/TestsListLayout.vue';
import PageViewLayout from '@/components/layouts/PageViewLayout.vue';
import PageViewLayoutList from '@/components/layouts/PageViewLayoutList.vue';
import TestSuiteCard from '@/components/TestSuiteCard.vue';
import TemplateCard from '@/components/TemplateCard.vue';
import { debounceHelper } from '@/mixins/debounce';
import type Vue from 'vue';
import type { IWorkflowDb, TestSuiteDb } from '@/Interface';
import { mapStores } from 'pinia';
import { useUIStore } from '@/stores/ui';
import { useWorkflowsStore } from '@/stores/workflows';
import { ADD_TEST_SUITE_MODAL_KEY } from '@/constants';
const StatusFilter = {
	ACTIVE: true,
	DEACTIVATED: false,
	ALL: '',
};
const TestSuitesView = mixins(showMessage, debounceHelper).extend({
	name: 'TestSuitesView',
	components: {
		TestsListLayout,
		TemplateCard,
		PageViewLayout,
		PageViewLayoutList,
		SettingsView,
		TestSuiteCard,
	},
	data() {
		return {};
	},
	computed: {
		...mapStores(useUIStore, useWorkflowsStore),
		currentWorkFlow(): IWorkflowDb | null {
			return this.workflowsStore.workflowsById[this.$route.params.workflow] || null;
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
	methods: {
		async initialize() {
			await this.workflowsStore.fetchWorkflow(this.$route.params.workflow);
			await this.workflowsStore.fetchWorkflowTestSuites(this.$route.params.workflow);
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
	watch: {},
	mounted() {
		this.workflowsStore.resetWorkflowTestSuites();
	},
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
