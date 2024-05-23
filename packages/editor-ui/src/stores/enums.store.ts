import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { EsaEnumData, EsaEnum, IWorkflowDb } from '@/Interface';
import * as enumsApi from '@/api/enums';
import { useRootStore } from '@/stores/n8nRoot.store';
import { ExpressionError } from 'n8n-workflow';

export const useEnumsStore = defineStore('enums', () => {
	const rootStore = useRootStore();

	const enums = ref<EsaEnumData[]>([]);
	const enumsAliasValueMap = ref<Record<string, EsaEnumData['value']>>({});
	const enumsSets = ref<EsaEnum[]>([]);
	const enumsByEnumSetId = ref<Record<string, EsaEnumData[]>>({});

	const filteredWorkflowMap = ref<Record<string, IWorkflowDb[]>>({});

	function setFilteredWorkflow(id: string, value: IWorkflowDb[]) {
		filteredWorkflowMap.value = {
			...filteredWorkflowMap.value,
			[id]: value,
		};
	}

	async function fetchAllEnums() {
		const data = await enumsApi.getEnums(rootStore.getRestApiContext);

		enums.value = data;

		return data;
	}

	async function fetchAllEnumsByEnumSetId(enumSetId: string) {
		const data = await enumsApi.getEnumsByEnumSetId(rootStore.getRestApiContext, enumSetId);

		enumsByEnumSetId.value = {
			...enumsByEnumSetId.value,
			[enumSetId]: data,
		};

		return data;
	}

	async function fetchEnumsAliasValueMap() {
		const aliasValueMap = await enumsApi.getEnumsAliasValueMap(rootStore.getRestApiContext);
		enumsAliasValueMap.value = aliasValueMap;

		return aliasValueMap;
	}

	async function fetchAllEnumSets() {
		const data = await enumsApi.getAllEnumSets(rootStore.getRestApiContext);

		enumsSets.value = data;

		return data;
	}

	async function createEnum(enumData: Omit<EsaEnumData, 'id'>) {
		const data = await enumsApi.createEnum(rootStore.getRestApiContext, enumData);

		enums.value.unshift(data);

		return data;
	}

	async function createEnumSet(enumData: Omit<EsaEnum, 'id'>) {
		const data = await enumsApi.createEnumSet(rootStore.getRestApiContext, enumData);

		return data;
	}

	async function updateEnum(enumData: EsaEnumData) {
		const data = await enumsApi.updateEnum(rootStore.getRestApiContext, enumData);

		enums.value = enums.value.map((v) => (v.id === data.id ? data : v));

		return data;
	}

	async function deleteEnum(enumData: EsaEnumData) {
		const data = await enumsApi.deleteEnum(rootStore.getRestApiContext, {
			id: enumData.id,
		});

		enums.value = enums.value.filter((e) => e.id !== enumData.id);

		return data;
	}

	const enumsAsObject = computed(() => {
		const asObject = enums.value.reduce<Record<string, string | boolean | number>>((acc, e) => {
			acc[e.key] = e.value;
			return acc;
		}, {});

		return new Proxy(asObject, {
			set() {
				throw new ExpressionError('Cannot assign values to variables at runtime');
			},
		});
	});

	return {
		enums,
		enumsAsObject,
		enumsAliasValueMap,
		filteredWorkflowMap,
		fetchAllEnums,
		createEnum,
		updateEnum,
		deleteEnum,
		createEnumSet,
		fetchAllEnumSets,
		fetchAllEnumsByEnumSetId,
		fetchEnumsAliasValueMap,
		setFilteredWorkflow,
	};
});
