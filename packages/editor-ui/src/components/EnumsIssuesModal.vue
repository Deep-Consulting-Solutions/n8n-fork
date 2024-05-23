<template>
	<Modal
		width="600px"
		:name="ENUMS_ISSUES_MODAL_KEY"
		:event-bus="modalBus"
		:center="true"
		:before-close="onModalClose"
		:show-close="!loading"
	>
		<template #header>
			<div :class="$style.heading">
				<n8n-heading tag="h1" size="medium">{{
					$locale.baseText('enums.enumsIssuesModal.title')
				}}</n8n-heading>
			</div>
		</template>
		<template #content>
			<n8n-heading tag="h3" size="medium" :class="$style.subtitle">{{
				$locale.baseText('enums.enumsIssuesModal.subtitle', {
					interpolate: { selectedEnum: enumAlias },
				})
			}}</n8n-heading>
			<div :class="[$style.contentContainer]">
				<ul v-for="w in filteredWorkflows" :key="w.id" :class="$style.listContainer">
					<div :class="$style.n8nLink">
						<a :href="`/workflow/${w.id}`" target="_blank">{{ w.name }}</a>
					</div>
					<ol :class="['ml-l']" type="a">
						<li v-for="nodes in w.nodes" :key="nodes.id" :class="$style.nodename">
							{{ nodes.name }}
						</li>
					</ol>
				</ul>
			</div>
		</template>
		<template #footer>
			<n8n-button
				:loading="loading"
				:label="
					loading
						? $locale.baseText('enums.enumsIssuesModal.retryButton.label.loading')
						: $locale.baseText('enums.enumsIssuesModal.retryButton.label')
				"
				size="large"
				float="right"
				@click="onRetryClick"
			/>
		</template>
	</Modal>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import Modal from './Modal.vue';
import { ENUMS_ISSUES_MODAL_KEY } from '@/constants';
import { mapStores } from 'pinia';
import { createEventBus } from 'n8n-design-system/utils';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { useToast } from '@/composables/useToast';
import { useI18n } from '@/composables/useI18n';
import { useEnumsStore } from '@/stores/enums.store';
import { useUIStore } from '@/stores/ui.store';
import type { EsaEnumData, IWorkflowDb } from '@/Interface';

export default defineComponent({
	name: 'EnumsIssuesModal',
	components: {
		Modal,
	},
	props: {
		data: {
			type: Object as PropType<{
				workflows: IWorkflowDb[];
				retry: () => void;
				hasIssues: boolean;
				selectedEnum: EsaEnumData;
				enumSetId: string;
			}>,
			default: () => ({
				workflows: [] as IWorkflowDb[],
				retry: () => {},
				hasIssues: true,
				selectedEnum: {},
				enumSetId: '',
			}),
		},
	},
	setup() {
		return {
			...useToast(),
			...useI18n(),
		};
	},
	data() {
		return {
			loading: false,
			modalBus: createEventBus(),
			// filteredWorkflows: this.data.workflows,
			selectedEnum: this.data.selectedEnum,
			ENUMS_ISSUES_MODAL_KEY,
		};
	},
	computed: {
		...mapStores(useWorkflowsStore, useEnumsStore, useUIStore),
		enumAlias() {
			return `<<${this.data.selectedEnum.alias}>>`;
		},
		filteredWorkflows() {
			return this.enumsStore.filteredWorkflowMap[this.data.enumSetId] ?? this.data.workflows;
		},
	},
	mounted() {
		console.log({ allWorkflows: this.data.workflows });
	},
	methods: {
		async onRetryClick() {
			try {
				this.loading = true;
				this.data.retry();
				if (!this.data.hasIssues) {
					this.modalBus.emit('close');
					return;
				}
				this.showMessage({
					title: this.$locale.baseText('enums.addEnumsSet.success'),
					type: 'success',
				});
			} catch (error) {
				this.showError(error, this.$locale.baseText('enums.addEnumsSet.error'));
			} finally {
				this.loading = false;
			}
		},
		onModalClose() {
			return !this.loading;
		},
	},
});
</script>

<style module lang="scss">
.contentContainer {
	height: 400px;
	overflow: scroll;
	font-weight: var(--font-weight-regular);
	color: var(--color-text-base);
}

.listContainer {
	margin-bottom: 1rem;
}

.subtitle {
	margin-bottom: 20px;
}

.n8nLink {
	margin-bottom: 12px;
	& > a {
		font-weight: 600;
		text-decoration: none;
	}
}

.nodename {
	font-size: var(--font-size-s);
	margin-bottom: 0.5rem;
}
</style>
