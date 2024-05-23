<script lang="ts" setup>
import { computed, ref, onMounted, watch } from 'vue';
import type { PropType } from 'vue';
import { useI18n } from '@/composables/useI18n';
import { useToast } from '@/composables/useToast';
import { useMessage } from '@/composables/useMessage';

import ResourcesListLayoutAlt from '@/components/layouts/ResourcesListLayoutAlt.vue';
import EnumsRow from '@/components/EnumsRow.vue';

import { MODAL_CONFIRM, ENUMS_ISSUES_MODAL_KEY } from '@/constants';
import type { DatatableColumn, EsaEnum, EsaEnumData, IWorkflowDb } from '@/Interface';
import { uid } from 'n8n-design-system/utils';
import { useEnumsStore } from '@/stores/enums.store';
import { useUIStore } from '@/stores/ui.store';
import { useWorkflowsStore } from '@/stores/workflows.store';

const props = defineProps({
	enumSet: {
		type: Object as PropType<EsaEnum>,
		default: () => ({}),
		required: true,
	},
});

const enumsStore = useEnumsStore();
const i18n = useI18n();
const message = useMessage();
const uiStore = useUIStore();
const workflowStore = useWorkflowsStore();

const layoutRef = ref<InstanceType<typeof ResourcesListLayoutAlt> | null>(null);

const { showError } = useToast();

const TEMPORARY_ENUM_UID_BASE = '@tmpenum';

const allEnums = ref<EsaEnumData[]>([]);
const allWorkflows = ref<IWorkflowDb[]>([]);
const filteredWorkflows = ref<IWorkflowDb[]>([]);
const editMode = ref<Record<string, boolean>>({});

const datatableColumns = computed<DatatableColumn[]>(() => [
	{
		id: 0,
		path: 'name',
		label: i18n.baseText('enums.table.key'),
		classes: ['enums-key-column'],
	},
	{
		id: 1,
		path: 'value',
		label: i18n.baseText('enums.table.value'),
		classes: ['enums-value-column'],
	},
	{
		id: 2,
		path: 'alias',
		label: i18n.baseText('enums.table.alias'),
		classes: ['enums-alias-column'],
	},
	{
		id: 3,
		path: 'actions',
		label: '',
	},
]);

const newlyAddedEnumIds = ref<string[]>([]);

const selectedEnum = ref<EsaEnumData | null>(null);
const selectedEnumUsedInAnyNode = ref(false);

// function resetNewVariablesList() {
// 	newlyAddedEnumIds.value = [];
// }

async function initialize() {
	const enums = await enumsStore.fetchAllEnumsByEnumSetId(props.enumSet.id);
	const workflows = await workflowStore.fetchAllWorkflowsWithNodes();
	const modifiedEnums = enums.map((e) => ({
		...e,
		alias: `${props.enumSet.name}.${e.key}`,
	}));
	allEnums.value = [...modifiedEnums];
	allWorkflows.value = workflows;
	console.log({ workflows, enums });
}

function addTemporaryVariable() {
	const temporaryEnum: EsaEnumData = {
		id: uid(TEMPORARY_ENUM_UID_BASE),
		key: '',
		value: '',
	};

	console.log({ temporaryEnum });

	if (layoutRef.value) {
		// Reset scroll position
		if (layoutRef.value.$refs.listWrapperRef) {
			(layoutRef.value.$refs.listWrapperRef as unknown as { scrollTop: number }).scrollTop = 0;
		}

		// Reset pagination
		if (layoutRef.value.currentPage !== 1) {
			layoutRef.value.setCurrentPage(1);
		}
	}

	allEnums.value.unshift(temporaryEnum);
	editMode.value[temporaryEnum.id] = true;
}

async function saveEnum(data: EsaEnumData) {
	let updatedEnum: EsaEnumData;

	try {
		if (typeof data.id === 'string' && data.id.startsWith(TEMPORARY_ENUM_UID_BASE)) {
			const { id, ...rest } = data;
			const esaEnumId = props.enumSet.id;
			updatedEnum = await enumsStore.createEnum({ ...rest, esaEnumId });
			allEnums.value.unshift(updatedEnum);
			allEnums.value = allEnums.value.filter((e) => e.id !== data.id);
			newlyAddedEnumIds.value.unshift(updatedEnum.id);
		} else {
			updatedEnum = await enumsStore.updateEnum(data);
			allEnums.value = allEnums.value.filter((e) => e.id !== data.id);
			allEnums.value.push(updatedEnum);
			toggleEditing(updatedEnum);
		}
	} catch (error) {
		showError(error, i18n.baseText('enums.errors.save'));
	}
}

function toggleEditing(data: EsaEnumData) {
	editMode.value = {
		...editMode.value,
		[data.id]: !editMode.value[data.id],
	};
}

function cancelEditing(data: EsaEnumData) {
	if (typeof data.id === 'string' && data.id.startsWith(TEMPORARY_ENUM_UID_BASE)) {
		allEnums.value = allEnums.value.filter((e) => e.id !== data.id);
	} else {
		toggleEditing(data);
	}
}

function openEnumsIssuesModal() {
	uiStore.openModalWithData({
		name: ENUMS_ISSUES_MODAL_KEY,
		data: {
			workflows: filteredWorkflows.value,
			retry: initialize,
			hasIssues: selectedEnumUsedInAnyNode.value,
			selectedEnum: selectedEnum.value,
			enumSetId: props.enumSet.id,
		},
	});
}

function setSelectedEnum(selected: EsaEnumData) {
	selectedEnum.value = selected;
}

function onFocusFirstInput() {
	if (selectedEnumUsedInAnyNode.value) {
		openEnumsIssuesModal();
	}
}

async function deleteEnum(data: EsaEnumData) {
	if (selectedEnumUsedInAnyNode.value) {
		openEnumsIssuesModal();
		return;
	}
	try {
		console.log({ dataToDelete: data });
		const aliasName = `<<${props.enumSet.name}.${data.key}>>`;
		const confirmed = await message.confirm(
			i18n.baseText('enums.modals.deleteConfirm.message', { interpolate: { name: aliasName } }),
			i18n.baseText('enums.modals.deleteConfirm.title'),
			{
				confirmButtonText: i18n.baseText('enums.modals.deleteConfirm.confirmButton'),
				cancelButtonText: i18n.baseText('enums.modals.deleteConfirm.cancelButton'),
			},
		);

		if (confirmed !== MODAL_CONFIRM) {
			return;
		}

		await enumsStore.deleteEnum(data);
		allEnums.value = allEnums.value.filter((e) => e.id !== data.id);
	} catch (error) {
		showError(error, i18n.baseText('enums.errors.delete'));
	}
}

onMounted(async () => {
	await initialize();
});

watch(allWorkflows, (currentVal) => {
	const stringToCheck = selectedEnum.value?.alias;
	const filtered = currentVal
		.map((wf) => {
			const matchingNodes = wf.nodes.filter((node) => {
				return Object.values(node.parameters).some((paramValue) => {
					return typeof paramValue === 'string' && paramValue.includes(`<<${stringToCheck}>>`);
				});
			});
			return matchingNodes.length > 0 ? { ...wf, nodes: matchingNodes } : null;
		})
		.filter((wf) => wf !== null) as IWorkflowDb[];

	filteredWorkflows.value = filtered;
	selectedEnumUsedInAnyNode.value = filteredWorkflows.value.length > 0;

	enumsStore.setFilteredWorkflow(props.enumSet.id, filtered);
});

watch(selectedEnum, (currentVal) => {
	const stringToCheck = currentVal?.alias;
	const filtered = allWorkflows.value
		.map((wf) => {
			const matchingNodes = wf.nodes.filter((node) => {
				return Object.values(node.parameters).some((paramValue) => {
					return typeof paramValue === 'string' && paramValue.includes(`<<${stringToCheck}>>`);
				});
			});
			return matchingNodes.length > 0 ? { ...wf, nodes: matchingNodes } : null;
		})
		.filter((wf) => wf !== null) as IWorkflowDb[];

	filteredWorkflows.value = filtered;
	selectedEnumUsedInAnyNode.value = filteredWorkflows.value.length > 0;

	enumsStore.setFilteredWorkflow(props.enumSet.id, filtered);
});
</script>

<template>
	<ResourcesListLayoutAlt
		ref="layoutRef"
		class="enums-view"
		:resources="allEnums"
		:initialize="initialize"
		:enum-set="props.enumSet"
		type="datatable"
		:type-props="{ columns: datatableColumns }"
	>
		<template #add-button>
			<div>
				<n8n-button
					size="large"
					block
					data-test-id="resources-list-add"
					@click="addTemporaryVariable"
				>
					{{ $locale.baseText(`enums.add`) }}
				</n8n-button>
			</div>
		</template>
		<template #default="{ data }">
			<EnumsRow
				:key="data.id"
				:editing="editMode[data.id]"
				:data="data"
				:enum-set="enumSet"
				:selected-enum-used-in-any-node="selectedEnumUsedInAnyNode"
				@on-focus-first-input="onFocusFirstInput"
				@set-selected-enum="setSelectedEnum"
				@save="saveEnum"
				@edit="toggleEditing"
				@cancel="cancelEditing"
				@delete="deleteEnum"
			/>
		</template>
	</ResourcesListLayoutAlt>
</template>

<style lang="scss" module>
.type-input {
	--max-width: 265px;
}

.sidebarContainer ul {
	padding: 0 !important;
}
</style>

<style lang="scss" scoped>
@use 'n8n-design-system/css/common/var.scss';

.enums-view {
	:deep(.datatable) {
		table {
			table-layout: fixed;
		}

		th,
		td {
			@media screen and (max-width: var.$md) {
				width: 33.33%;
			}

			&.enums-value-column,
			&.enums-key-column,
			&.enums-alias-column {
				> div {
					width: 100%;

					> span {
						max-width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						height: 18px;
					}

					> div {
						width: 100%;
					}
				}
			}
		}
		.enums-alias-column {
			@media screen and (max-width: var.$md) {
				display: none;
			}
			width: 500px;
		}
	}
}
</style>
