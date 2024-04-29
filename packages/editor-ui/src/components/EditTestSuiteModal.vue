<template>
	<Modal
		width="540px"
		:name="EDIT_TEST_SUITE_MODAL_KEY"
		:title="
			$locale.baseText('testSuites.editTestSuite.title', {
				interpolate: { name: data.name },
			})
		"
		:eventBus="modalBus"
		:center="true"
		:beforeClose="onModalClose"
		:showClose="!loading"
	>
		<template #content>
			<div :class="[$style.formContainer]">
				<n8n-radio-buttons
					size="medium"
					:value="selectedType"
					@input="onTypeSelected"
					:options="[
						{ label: $locale.baseText('parameterInput.test.error'), value: 'error' },
						{ label: $locale.baseText('parameterInput.test.output'), value: 'data' },
					]"
				/>

				<div :class="['mt-l']">
					<n8n-input-label
						v-if="selectedType === 'error'"
						:class="$style.labelTooltip"
						:label="$locale.baseText('testSuites.editTest.error.label')"
					>
						<n8n-input
							name="error"
							v-model="error"
							type="text"
							:placeholder="''"
							:required="true"
							:disabled="loading"
						/>
					</n8n-input-label>

					<n8n-input-label
						v-if="selectedType === 'data'"
						:class="$style.labelTooltip"
						:label="$locale.baseText('testSuites.editTest.output.label')"
					>
						<n8n-input
							name="output"
							v-model="output"
							type="text"
							:placeholder="''"
							:required="true"
							:disabled="loading"
						/>
					</n8n-input-label>
				</div>
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
				:disabled="disabled || loading"
				:label="
					loading
						? $locale.baseText('testSuites.editTest.saveButton.label.loading')
						: $locale.baseText('testSuites.editTest.saveButton.label')
				"
				size="large"
				float="right"
				@click="onSave"
			/>
		</template>
	</Modal>
</template>

<script lang="ts">
import Modal from './Modal.vue';
import { EDIT_TEST_SUITE_MODAL_KEY } from '../constants';
import mixins from 'vue-typed-mixins';
import { showMessage } from '@/mixins/showMessage';
import { mapStores } from 'pinia';
import { createEventBus } from '@/event-bus';
import { useWorkflowsStore } from '@/stores';
import type { NodeOutputDb } from '@/Interface';

export default mixins(showMessage).extend({
	name: 'EditTestSuiteModal',
	components: {
		Modal,
	},
	props: {
		data: {
			type: Object,
			default: {
				name: '',
			},
		},
	},
	data() {
		return {
			loading: false,
			modalBus: createEventBus(),
			infoTextErrorMessage: '',
			EDIT_TEST_SUITE_MODAL_KEY,
			selectedType: '',
			output: '',
			error: '',
			nodeOutputId: '',
		};
	},
	computed: {
		...mapStores(useWorkflowsStore),
		disabled() {
			if (!this.selectedType) {
				return true;
			}
			if (this.selectedType === 'data' && !this.output) {
				return true;
			}
			if (this.selectedType === 'error' && !this.error) {
				return true;
			}
			return false;
		},
	},
	methods: {
		onTypeSelected(selected: string) {
			this.selectedType = selected;
		},
		async onSave() {
			try {
				this.infoTextErrorMessage = '';
				this.loading = true;
				const basePayload = {
					workflowTestId: this.$route.params.test,
					nodeId: this.data.id,
					outputType: this.selectedType as NodeOutputDb['outputType'],
					errorMessage: this.error,
					data: this.output,
				};
				if (this.nodeOutputId) {
					await this.workflowsStore.updateWorkflowTestSuite({
						id: this.nodeOutputId,
						...basePayload,
					});
				} else {
					await this.workflowsStore.createWorkflowTestSuite(basePayload);
				}
				this.loading = false;
				this.modalBus.emit('close');
				this.$showMessage({
					title: this.$locale.baseText('testSuites.editTest.saveButton.success'),
					type: 'success',
				});
			} catch (error) {
				if (error.httpStatusCode && error.httpStatusCode === 400) {
					this.infoTextErrorMessage = error.message;
				} else {
					this.$showError(error, this.$locale.baseText('testSuites.editTest.saveButton.error'));
				}
			} finally {
				this.loading = false;
			}
		},
		onModalClose() {
			return !this.loading;
		},
	},
	mounted() {
		console.log({ editData: this.data });
		this.nodeOutputId = this.data.nodeOutput.id;
		this.output = this.data.nodeOutput.data || '';
		this.error = this.data.nodeOutput.errorMessage || '';
		this.selectedType = this.data.nodeOutput.outputType || 'data';
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
