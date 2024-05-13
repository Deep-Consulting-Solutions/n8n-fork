<template>
	<PageViewLayout>
		<div v-if="loading">
			<n8n-loading :class="[headerLoadingClass, 'mb-l']" variant="custom" />
			<n8n-loading :class="[cardLoadingClass, 'mb-2xs']" variant="custom" />
			<n8n-loading :class="cardLoadingClass" variant="custom" />
		</div>

		<PageViewLayoutList v-else>
			<template #header>
				<div :class="[flexClass, 'mb-2xs']">
					<div>
						<n8n-heading tag="h2" size="xlarge">
							{{
								$locale.baseText('testSuites.workflows.tests.node.heading', {
									interpolate: { id: currentTestSuiteName },
								})
							}}
						</n8n-heading>
					</div>
					<div>
						<n8n-heading tag="h2" size="xlarge">
							{{ currentTestSuiteDescription }}
						</n8n-heading>
					</div>
				</div>
			</template>

			<div v-if="workFlowNodes.length > 0" ref="listWrapperRef" :class="listWrapperClass">
				<n8n-recycle-scroller
					:class="[listClass, 'list-style-none']"
					:items="workFlowNodes"
					item-key="id"
					:item-size="0"
				>
					<template #default="{ item, updateItemSize }">
						<slot :data="item" :update-item-size="updateItemSize" />
					</template>
				</n8n-recycle-scroller>
			</div>
		</PageViewLayoutList>
	</PageViewLayout>
</template>

<script lang="ts">
import type { IUser } from '@/Interface';
import PageViewLayout from '@/components/layouts/PageViewLayout.vue';
import PageViewLayoutList from '@/components/layouts/PageViewLayoutList.vue';
import type { PropType } from 'vue';
import { mapStores } from 'pinia';
import { useSettingsStore } from '@/stores/settings.store';
import { useUsersStore } from '@/stores/users.store';
export interface IResource {
	id: string;
	name: string;
	updatedAt: string;
	createdAt: string;
	ownedBy?: Partial<IUser>;
	sharedWith?: Array<Partial<IUser>>;
}
export default {
	name: 'TestsListNodeLayout',
	components: {
		PageViewLayout,
		PageViewLayoutList,
	},
	props: {
		workFlowNodes: {
			type: Array,
			default: (): IResource[] => [],
		},
		initialize: {
			type: Function as PropType<() => Promise<void>>,
			default: () => async () => {},
		},
		currentTestSuiteDescription: {
			type: String,
			default: '',
		},
		currentTestSuiteName: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			loading: true,
		};
	},
	computed: {
		...mapStores(useSettingsStore, useUsersStore),
		headerLoadingClass(): string {
			return `${this.$style['header-loading']} mb-l`;
		},
		cardLoadingClass(): string {
			return `${this.$style['card-loading']} mb-2xs`;
		},
		flexClass(): string {
			return `${this.$style.flex} mb-2xs`;
		},
		listWrapperClass(): string {
			return `${this.$style.listWrapper}`;
		},
		listClass(): string {
			return `${this.$style.list} list-style-none`;
		},
	},
	mounted() {
		this.onMounted();
	},
	methods: {
		async onMounted() {
			await this.initialize();
			this.loading = false;
		},
	},
};
</script>

<style lang="scss" module>
.heading-wrapper {
	padding-bottom: 1px; // Match input height
}
.flex {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-flow: row nowrap;
}
.search {
	max-width: 240px;
}
.list {
	display: block;
}
.listWrapper {
	height: 100%;
}
.header-loading {
	height: 36px;
}
.card-loading {
	height: 69px;
}
</style>
