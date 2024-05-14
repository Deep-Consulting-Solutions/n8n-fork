<template>
	<TestsListNodeLayout
		ref="layout"
		:work-flow-nodes="currentWorkFlow?.nodes"
		:initialize="initialize"
		:current-test-suite-name="currentTestSuite?.name || ''"
		:current-test-suite-description="currentTestSuite?.description || ''"
	>
		<template #default="{ data }">
			<TestSuiteNodeCard class="mb-2xs" :data="data" />
		</template>
	</TestsListNodeLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TestsListNodeLayout from '../components/TestsListNodeLayout.vue';
import TestSuiteNodeCard from '@/components/TestSuiteNodeCard.vue';
import type { IWorkflowDb, TestSuiteDb } from '@/Interface';
import { mapStores } from 'pinia';
import { useUIStore } from '@/stores/ui.store';
import { useWorkflowsStore } from '@/stores/workflows.store';

export default defineComponent({
	name: 'TestSuiteNodeView',
	components: {
		TestsListNodeLayout,
		TestSuiteNodeCard,
	},
	data() {
		return {};
	},
	computed: {
		...mapStores(useUIStore, useWorkflowsStore),
		currentWorkFlow(): IWorkflowDb | null {
			return this.workflowsStore.workflowsById[this.$route.params.workflow] || null;
		},
		currentTestSuite(): TestSuiteDb | null {
			return this.workflowsStore.testSuitesById[this.$route.params.test] || null;
		},
		testSuites(): TestSuiteDb[] {
			return this.workflowsStore.allTestSuites;
		},
	},
	methods: {
		async initialize() {
			await this.workflowsStore.fetchWorkflow(this.$route.params.workflow);
			await this.workflowsStore.fetchWorkflowTestSuites(this.$route.params.workflow);
			await this.workflowsStore.fetchWorkflowNodeOutput(this.$route.params.test);
		},
	},
});
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
