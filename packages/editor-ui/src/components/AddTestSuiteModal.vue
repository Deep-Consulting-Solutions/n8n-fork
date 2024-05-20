<template>
	<Modal
		width="540px"
		:name="ADD_TEST_SUITE_MODAL_KEY"
		:title="$locale.baseText('testSuites.addTestSuite.title')"
		:event-bus="modalBus"
		:center="true"
		:before-close="onModalClose"
		:show-close="!loading"
	>
		<template #content>
			<div :class="[$style.formContainer, 'mt-m']">
				<n8n-input-label
					:class="$style.labelTooltip"
					:label="$locale.baseText('testSuites.addTest.description.label')"
					:tooltip-text="$locale.baseText('testSuites.addTest.description.tooltip')"
				>
					<n8n-input
						v-model="description"
						name="description"
						type="text"
						:maxlength="300"
						:placeholder="''"
						:required="true"
						:disabled="loading"
					/>
				</n8n-input-label>
				<div :class="[$style.infoText, 'mt-4xs']">
					<span
						size="small"
						:class="[$style.infoText, infoTextErrorMessage ? $style.error : '']"
						v-text="infoTextErrorMessage"
					></span>
				</div>
			</div>
		</template>
		<template #footer>
			<n8n-button
				:loading="loading"
				:disabled="!description || loading"
				:label="
					loading
						? $locale.baseText('testSuites.addTest.saveButton.label.loading')
						: $locale.baseText('testSuites.addTest.saveButton.label')
				"
				size="large"
				float="right"
				@click="onAddClick"
			/>
		</template>
	</Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Modal from './Modal.vue';
import { ADD_TEST_SUITE_MODAL_KEY } from '../constants';
import { mapStores } from 'pinia';
import { createEventBus } from 'n8n-design-system/utils';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { useToast } from '@/composables/useToast';

export default defineComponent({
	name: 'AddTestSuiteModal',
	components: {
		Modal,
	},
	props: {
		workFlowId: {
			type: String,
			default: '',
		},
	},
	setup() {
		return {
			...useToast(),
		};
	},
	data() {
		return {
			loading: false,
			description: '',
			modalBus: createEventBus(),
			infoTextErrorMessage: '',
			ADD_TEST_SUITE_MODAL_KEY,
		};
	},
	computed: {
		...mapStores(useWorkflowsStore),
	},
	methods: {
		async onAddClick() {
			try {
				this.infoTextErrorMessage = '';
				this.loading = true;
				await this.workflowsStore.addWorkflowTestSuite(
					this.$route.params.workflow as string,
					this.description,
				);
				this.loading = false;
				this.modalBus.emit('close');
				this.showMessage({
					title: this.$locale.baseText('testSuites.addTest.saveButton.success'),
					type: 'success',
				});
			} catch (error) {
				if (error.httpStatusCode && error.httpStatusCode === 400) {
					this.infoTextErrorMessage = error.message;
				} else {
					this.showError(error, this.$locale.baseText('testSuites.addTest.saveButton.error'));
				}
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
.descriptionContainer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: var(--border-width-base) var(--border-style-base) var(--color-info-tint-1);
	border-radius: var(--border-radius-base);
	background-color: var(--color-background-light);
	button {
		& > span {
			flex-direction: row-reverse;
			& > span {
				margin-left: var(--spacing-3xs);
			}
		}
	}
}
.formContainer {
	font-size: var(--font-size-2xs);
	font-weight: var(--font-weight-regular);
	color: var(--color-text-base);
}
.checkbox {
	span:nth-child(2) {
		vertical-align: text-top;
	}
}
.error {
	color: var(--color-danger);
	span {
		border-color: var(--color-danger);
	}
}
</style>

<style lang="scss">
.el-tooltip__popper {
	max-width: 240px;
	img {
		width: 100%;
	}
	p {
		line-height: 1.2;
	}
	p + p {
		margin-top: var(--spacing-2xs);
	}
}
</style>
