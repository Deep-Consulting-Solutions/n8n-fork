<template>
	<page-view-layout>
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
					:buttonText="$locale.baseText('testSuites.add')"
					buttonType="secondary"
					@click="$emit('click:add', $event)"
				/>
			</div>
			<page-view-layout-list v-else>
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

				<div v-if="testSuites.length > 0" :class="$style.listWrapper" ref="listWrapperRef">
					<n8n-recycle-scroller
						:class="[$style.list, 'list-style-none']"
						:items="testSuites"
						item-key="id"
						:item-size="0"
					>
						<template #default="{ item, updateItemSize }">
							<slot :data="item" :updateItemSize="updateItemSize" />
						</template>
					</n8n-recycle-scroller>
				</div>
			</page-view-layout-list>
		</template>
	</page-view-layout>
</template>

<script lang="ts">
import { showMessage } from '@/mixins/showMessage';
import type { IUser } from '@/Interface';
import mixins from 'vue-typed-mixins';

import PageViewLayout from '@/components/layouts/PageViewLayout.vue';
import PageViewLayoutList from '@/components/layouts/PageViewLayoutList.vue';
import TemplateCard from '@/components/TemplateCard.vue';
import type { PropType } from 'vue';
import type Vue from 'vue';
import { debounceHelper } from '@/mixins/debounce';
import ResourceOwnershipSelect from '@/components/forms/ResourceOwnershipSelect.ee.vue';
import ResourceFiltersDropdown from '@/components/forms/ResourceFiltersDropdown.vue';
import { mapStores } from 'pinia';
import { useSettingsStore } from '@/stores/settings';
import { useUsersStore } from '@/stores/users';

export interface IResource {
	id: string;
	name: string;
	updatedAt: string;
	createdAt: string;
	ownedBy?: Partial<IUser>;
	sharedWith?: Array<Partial<IUser>>;
}

export default mixins(showMessage, debounceHelper).extend({
	name: 'tests-list-layout',
	components: {
		TemplateCard,
		PageViewLayout,
		PageViewLayoutList,
		ResourceOwnershipSelect,
		ResourceFiltersDropdown,
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
	methods: {
		async onMounted() {
			await this.initialize();
			this.loading = false;
		},
	},
	mounted() {
		this.onMounted();
	},
	watch: {},
});
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
