<template>
	<tests-list-node-layout
		ref="layout"
		:workFlowNodes="currentWorkFlow?.nodes"
		:initialize="initialize"
		:currentTestSuiteName="currentTestSuite?.name || ''"
		:currentTestSuiteDescription="currentTestSuite?.description || ''"
	>
		<template #default="{ data }">
			<test-suite-node-card class="mb-2xs" :data="data" />
		</template>
	</tests-list-node-layout>
</template>

<script lang="ts">
import { showMessage } from '@/mixins/showMessage';
import mixins from 'vue-typed-mixins';

import SettingsView from './SettingsView.vue';
import TestsListNodeLayout from '@/components/layouts/TestsListNodeLayout.vue';
import PageViewLayout from '@/components/layouts/PageViewLayout.vue';
import PageViewLayoutList from '@/components/layouts/PageViewLayoutList.vue';
import TestSuiteNodeCard from '@/components/TestSuiteNodeCard.vue';
import TemplateCard from '@/components/TemplateCard.vue';
import { debounceHelper } from '@/mixins/debounce';
import type Vue from 'vue';
import type { IWorkflowDb, TestSuiteDb } from '@/Interface';
import { mapStores } from 'pinia';
import { useUIStore } from '@/stores/ui';
import { useWorkflowsStore } from '@/stores/workflows';

const TestSuiteNodeView = mixins(showMessage, debounceHelper).extend({
	name: 'TestSuiteNodeView',
	components: {
		TestsListNodeLayout,
		TemplateCard,
		PageViewLayout,
		PageViewLayoutList,
		SettingsView,
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
	watch: {},
	mounted() {},
	destroyed() {},
});

export default TestSuiteNodeView;
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
