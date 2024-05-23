<template>
	<PageViewLayout>
		<div v-if="loading">
			<n8n-loading :class="[$style['header-loading'], 'mb-l']" variant="custom" />
			<n8n-loading :class="[$style['card-loading'], 'mb-2xs']" variant="custom" />
			<n8n-loading :class="$style['card-loading']" variant="custom" />
		</div>
		<template v-else>
			<PageViewLayoutList :overflow="type !== 'list'">
				<template #header>
					<div :class="[$style['resource-list-header']]">
						<n8n-heading size="xlarge">
							{{ enumSet.name }}
						</n8n-heading>
						<slot name="add-button">
							<n8n-button
								size="large"
								block
								data-test-id="resources-list-add"
								@click="$emit('click:add', $event)"
							>
								{{ i18n.baseText(`enums.add`) }}
							</n8n-button>
						</slot>
					</div>
					<div class="pb-xs" />
				</template>
				<div v-if="resources.length > 0" ref="listWrapperRef" :class="$style.listWrapper">
					<n8n-datatable
						v-if="typeProps.columns"
						data-test-id="resources-table"
						:class="$style.datatable"
						:columns="typeProps.columns"
						:rows="resources"
						:current-page="currentPage"
						:rows-per-page="rowsPerPage"
						@update:current-page="setCurrentPage"
						@update:rows-per-page="setRowsPerPage"
					>
						<template #row="{ columns, row }">
							<slot :data="row" :columns="columns" />
						</template>
					</n8n-datatable>
				</div>
				<div v-else :class="$style.loadedAll">
					{{ i18n.baseText('enumsList.empty') }}
				</div>
			</PageViewLayoutList>
		</template>
	</PageViewLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { mapStores } from 'pinia';

import type { EsaEnum, EsaEnumData } from '@/Interface';
import PageViewLayout from '@/components/layouts/PageViewLayout.vue';
import PageViewLayoutList from '@/components/layouts/PageViewLayoutList.vue';
import { useEnumsStore } from '@/stores/enums.store';
import type { DatatableColumn } from 'n8n-design-system';
import { useI18n } from '@/composables/useI18n';

export default defineComponent({
	name: 'ResourcesListLayout',
	components: {
		PageViewLayout,
		PageViewLayoutList,
	},
	props: {
		enumSet: {
			type: Object as PropType<EsaEnum>,
			default: () => ({}),
		},
		initialize: {
			type: Function as PropType<() => Promise<void>>,
			default: () => async () => {},
		},
		resources: {
			type: Array,
			default: (): EsaEnumData[] => [],
		},
		type: {
			type: String as PropType<'datatable' | 'list'>,
			default: 'list',
		},
		typeProps: {
			type: Object as PropType<{ columns: DatatableColumn[] }>,
			default: () => ({
				columns: [],
			}),
		},
	},
	setup() {
		const i18n = useI18n();

		return { i18n };
	},
	data() {
		return {
			loading: true,
			currentPage: 1,
			rowsPerPage: 10 as number | '*',
		};
	},
	computed: {
		...mapStores(useEnumsStore),
	},
	watch: {},
	mounted() {
		void this.onMounted();
	},
	methods: {
		async onMounted() {
			await this.initialize();

			this.loading = false;
			await this.$nextTick();
		},
		setCurrentPage(page: number) {
			this.currentPage = page;
		},
		setRowsPerPage(rowsPerPage: number | '*') {
			this.rowsPerPage = rowsPerPage;
		},
	},
});
</script>

<style lang="scss" module>
.loadedAll {
	text-align: center;
	font-size: var(--font-size-s);
	color: var(--color-text-light);
	margin: var(--spacing-l) 0;
}

.resource-list-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
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

.datatable {
	padding-bottom: var(--spacing-s);
}
</style>
