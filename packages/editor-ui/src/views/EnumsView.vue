<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useI18n } from '@/composables/useI18n';
import { ADD_ENUMS_SET_MODAL_KEY } from '@/constants';
import type { EsaEnum } from '@/Interface';
import { useEnumsStore } from '@/stores/enums.store';
import { useUIStore } from '@/stores/ui.store';
import { useUsersStore } from '@/stores/users.store';
import EnumsSet from '@/views/EnumsSet.vue';

const usersStore = useUsersStore();
const enumsStore = useEnumsStore();
const i18n = useI18n();
const uiStore = useUIStore();
const loading = ref(true);
const allEnumsSet = ref<EsaEnum[]>([]);

async function initialize() {
	const enumSets = await enumsStore.fetchAllEnumSets();
	allEnumsSet.value = [...enumSets];
	loading.value = false;
}

function openAddEnumsSetModal() {
	uiStore.openModalWithData({
		name: ADD_ENUMS_SET_MODAL_KEY,
		data: {},
	});
}

onMounted(async () => {
	await initialize();
});
</script>

<template>
	<div>
		<div v-if="loading">
			<n8n-loading :class="[$style['header-loading'], 'mb-l']" variant="custom" />
			<n8n-loading :class="[$style['card-loading'], 'mb-2xs']" variant="custom" />
			<n8n-loading :class="$style['card-loading']" variant="custom" />
		</div>
		<div v-else>
			<div v-if="allEnumsSet.length === 0">
				<slot name="empty">
					<n8n-action-box
						data-test-id="empty-resources-list"
						emoji="👋"
						:heading="
							i18n.baseText(
								usersStore.currentUser?.firstName
									? `enums.empty.heading`
									: `enums.empty.heading.userNotSetup`,
								{
									interpolate: { name: usersStore.currentUser?.firstName || '' },
								},
							)
						"
						:description="i18n.baseText(`enums.empty.description`)"
						:button-text="i18n.baseText(`enums.empty.button`)"
						button-type="secondary"
						@click:button="openAddEnumsSetModal"
					/>
				</slot>
			</div>
			<template v-else>
				<div :class="[$style['resource-list-header']]">
					<N8nHeading tag="h1" size="2xlarge"> Enums Management </N8nHeading>
					<n8n-button size="large" @click:button="openAddEnumsSetModal">
						Add New Enums Set
					</n8n-button>
				</div>
				<template v-for="item in allEnumsSet" :key="item.id">
					<EnumsSet :enum-set="item" />
				</template>
			</template>
		</div>
	</div>
</template>

<style lang="scss" module>
.resource-list-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 var(--spacing-l);
	@media (min-width: 1200px) {
		padding: 0 var(--spacing-2xl);
	}
}

.header-loading {
	height: 36px;
}

.card-loading {
	height: 69px;
}

.sidebarContainer ul {
	padding: 0 !important;
}
</style>
