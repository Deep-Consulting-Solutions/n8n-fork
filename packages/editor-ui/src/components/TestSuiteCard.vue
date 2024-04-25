<template>
	<n8n-card :class="$style.cardLink" @click="onClick">
		<template #header>
			<n8n-heading tag="h2" bold class="ph-no-capture" :class="$style.cardHeading"
				data-test-id="workflow-card-name">
				{{ data.name }}
			</n8n-heading>
		</template>
		<div :class="$style.cardDescription">
			<n8n-text color="text-light" size="small">
				<span v-show="data">{{ $locale.baseText('workflows.item.updated') }} <time-ago :date="data.updatedAt" />
					|
				</span>
				<span v-show="data" class="mr-2xs">{{ $locale.baseText('workflows.item.created') }} {{
					formattedCreatedAtDate }}
				</span>
			</n8n-text>
		</div>
	</n8n-card>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins';
import type { IWorkflowDb, IUser, ITag } from '@/Interface';
import {
	VIEWS,
} from '@/constants';
import { showMessage } from '@/mixins/showMessage';
import dateformat from 'dateformat';
import type Vue from 'vue';
import { mapStores } from 'pinia';
import { useUIStore } from '@/stores/ui';
import { useWorkflowsStore } from '@/stores/workflows';

type ActivatorRef = InstanceType<typeof WorkflowActivator>;


export default mixins(showMessage).extend({
	name: "test-suite-card",
	data() {
		return {
		};
	},
	components: {
	},
	props: {
		data: {
			type: Object,
			required: true,
			default: (): IWorkflowDb => ({
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
		async onClick(event?: PointerEvent) {
			if (event) {
				if ((this.$refs.activator as ActivatorRef)?.$el.contains(event.target as HTMLElement)) {
					return;
				}

				if (event.metaKey || event.ctrlKey) {
					const route = this.$router.resolve({
						name: VIEWS.WORKFLOW,
						params: { name: this.data.id },
					});
					window.open(route.href, '_blank');

					return;
				}
			}

			this.$router.push({
				name: VIEWS.WORKFLOW,
				params: { name: this.data.id },
			});
		},
	},
});
</script>

<style lang="scss" module>
.cardLink {
	transition: box-shadow 0.3s ease;
	cursor: pointer;

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
}

.cardActions {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
</style>
