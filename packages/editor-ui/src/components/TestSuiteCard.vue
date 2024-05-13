<template>
	<n8n-card :class="$style.cardLink" @click="onClick">
		<template #header>
			<div>
				<n8n-heading
					tag="h2"
					bold
					class="ph-no-capture"
					:class="$style.cardHeading"
					data-test-id="workflow-card-name"
				>
					{{ data.name }}
				</n8n-heading>
				<n8n-text color="text-light" size="small">
					<span v-show="data">
						{{ $locale.baseText('workflows.item.updated') }} <time-ago :date="data.updatedAt" />
						|
					</span>
					<span v-show="data" class="mr-2xs">
						{{ $locale.baseText('workflows.item.created') }} {{ formattedCreatedAtDate }}
					</span>
				</n8n-text>
			</div>
			<div :class="$style.cardDescription">
				<div v-if="isTestCard" :class="$style.flex1">
					<n8n-text size="large" color="text-base">{{ data.description }}</n8n-text>
				</div>
			</div>
		</template>
	</n8n-card>
</template>

<script lang="ts">
import type { IUser } from '@/Interface';
import { VIEWS } from '@/constants';
import dateformat from 'dateformat';
import { mapStores } from 'pinia';
import { useUIStore } from '@/stores/ui.store';
import { useWorkflowsStore } from '@/stores/workflows.store';
import type WorkflowActivator from './WorkflowActivator.vue';
type ActivatorRef = InstanceType<typeof WorkflowActivator>;
export default {
	name: 'TestSuiteCard',
	props: {
		isTestCard: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			required: true,
			default: () => ({
				id: '',
				createdAt: '',
				updatedAt: '',
				active: false,
				connections: {},
				nodes: [],
				name: '',
				sharedWith: [],
				ownedBy: {} as IUser,
				versionId: '',
				description: '',
			}),
		},
		readonly: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		...mapStores(useUIStore, useWorkflowsStore),
		formattedCreatedAtDate(): string {
			const currentYear = new Date().getFullYear();
			return dateformat(
				this.data.createdAt,
				`d mmmm${this.data.createdAt.startsWith(currentYear) ? '' : ', yyyy'}`,
			);
		},
	},
	methods: {
		onClick(event?: PointerEvent) {
			const view = this.isTestCard
				? {
						name: VIEWS.TEST_SUITE_NODES,
						params: { workflow: this.$route.params.workflow, test: this.data.id },
					}
				: {
						name: VIEWS.TEST_SUITE,
						params: { workflow: this.data.id, test: '' },
					};
			if (event) {
				if (this.$refs.activator?.$el.contains(event.target as HTMLElement)) {
					return;
				}
				if (event.metaKey || event.ctrlKey) {
					const route = this.$router.resolve(view);
					window.open(route.href, '_blank');
					return;
				}
			}
			this.$router.push(view);
		},
	},
};
</script>
