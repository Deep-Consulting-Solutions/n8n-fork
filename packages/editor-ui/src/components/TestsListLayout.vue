<template>
	<PageViewLayout>
		<div v-if="loading">
			<n8n-loading :class="[$style['header-loading'], 'mb-l']" variant="custom" />
			<n8n-loading :class="[$style['card-loading'], 'mb-2xs']" variant="custom" />
			<n8n-loading :class="$style['card-loading']" variant="custom" />
		</div>
		<template v-else>
			<div v-if="testSuites.length === 0">
				<n8n-action-box
					:heading="
						$locale.baseText('testSuites.workflows.tests.heading', {
							interpolate: { name: currentWorkFlowName },
						})
					"
					:description="$locale.baseText('testSuites.workflows.tests.empty.description')"
					:button-text="$locale.baseText('testSuites.add')"
					button-type="secondary"
					@click="$emit('click:add', $event)"
				/>
			</div>
			<PageViewLayoutList v-else>
				<template #header>
					<div :class="[$style['flex'], 'mb-2xs']">
						<div>
							<n8n-heading tag="h2" size="xlarge">
								{{
									$locale.baseText('testSuites.workflows.tests.heading', {
										interpolate: { name: currentWorkFlowName },
									})
								}}
							</n8n-heading>
						</div>
						<div>
							<n8n-button
								size="large"
								block
								:disabled="disabled"
								@click="$emit('click:add', $event)"
							>
								{{ $locale.baseText('testSuites.add') }}
							</n8n-button>
						</div>
					</div>
				</template>

				<div v-if="testSuites.length > 0" ref="listWrapperRef" :class="$style.listWrapper">
					<n8n-recycle-scroller
						:class="[$style.list, 'list-style-none']"
						:items="testSuites"
						item-key="id"
						:item-size="0"
					>
						<template #default="{ item, updateItemSize }">
							<slot :data="item" :update-item-size="updateItemSize" />
						</template>
					</n8n-recycle-scroller>
				</div>
			</PageViewLayoutList>
		</template>
	</PageViewLayout>
</template>

<script lang="ts">
import type { IUser } from '@/Interface';
import { mapStores } from 'pinia';
import { useSettingsStore } from '@/stores/settings.store';
import { useUsersStore } from '@/stores/users.store';
import PageViewLayout from '@/components/layouts/PageViewLayout.vue';
import PageViewLayoutList from '@/components/layouts/PageViewLayoutList.vue';
import type { PropType } from 'vue';

export interface IResource {
	id: string;
	name: string;
	updatedAt: string;
	createdAt: string;
	ownedBy?: Partial<IUser>;
	sharedWith?: Array<Partial<IUser>>;
}

export default {
	name: 'TestsListLayout',
	components: {
		PageViewLayout,
		PageViewLayoutList,
	},
	props: {
		displayName: {
			type: Function as PropType<(resource: IResource) => string>,
			default: (resource: IResource) => resource.name,
		},
		testSuites: {
			type: Array,
			default: (): IResource[] => [],
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		initialize: {
			type: Function as PropType<() => Promise<void>>,
			default: () => async () => {},
		},
		currentWorkFlowName: {
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
