<template>
	<Modal
		width="540px"
		:name="ADD_ENUMS_SET_MODAL_KEY"
		:title="$locale.baseText('enums.addEnumsSet.title')"
		:event-bus="modalBus"
		:center="true"
		:before-close="onModalClose"
		:show-close="!loading"
	>
		<template #content>
			<div :class="[$style.formContainer, 'mt-m']">
				<n8n-input-label
					:class="$style.labelTooltip"
					:label="$locale.baseText('enums.addEnumsSet.name.label')"
					:tooltip-text="$locale.baseText('enums.addEnumsSet.name.tooltip')"
				>
					<n8n-form-input
						v-model="name"
						name="name"
						type="text"
						:placeholder="''"
						required
						validate-on-blur
						:validation-rules="keyValidationRules"
						@validate="(value: boolean) => onValidate(value)"
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
				:disabled="!name || loading || !formValid"
				:label="
					loading
						? $locale.baseText('enums.addEnumsSet.saveButton.label.loading')
						: $locale.baseText('enums.addEnumsSet.saveButton.label')
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
import { ADD_ENUMS_SET_MODAL_KEY } from '../constants';
import { mapStores } from 'pinia';
import { createEventBus } from 'n8n-design-system/utils';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { useToast } from '@/composables/useToast';
import { useI18n } from '@/composables/useI18n';
import { useEnumsStore } from '@/stores/enums.store';
// import type { Rule, RuleGroup } from '@/Interface';

export default defineComponent({
	name: 'AddEnumsSetModal',
	components: {
		Modal,
	},
	props: {},
	setup() {
		return {
			...useToast(),
			...useI18n(),
		};
	},
	data() {
		return {
			loading: false,
			name: '',
			modalBus: createEventBus(),
			infoTextErrorMessage: '',
			ADD_ENUMS_SET_MODAL_KEY,
			formValidationStatus: {
				name: false,
			},
			keyValidationRules: [
				{ name: 'REQUIRED' },
				{ name: 'MAX_LENGTH', config: { maximum: 300 } },
				{
					name: 'MATCH_REGEX',
					config: {
						regex: /^[a-zA-Z]/,
						message: this.$locale.baseText('enums.editing.key.error.startsWithLetter'),
					},
				},
				{
					name: 'MATCH_REGEX',
					config: {
						regex: /^[a-zA-Z][a-zA-Z0-9_]*$/,
						message: this.$locale.baseText('enums.editing.key.error.jsonKey'),
					},
				},
			],
		};
	},
	computed: {
		...mapStores(useWorkflowsStore, useEnumsStore),
		formValid() {
			return this.formValidationStatus.name;
		},
	},
	methods: {
		async onAddClick() {
			try {
				this.infoTextErrorMessage = '';
				this.loading = true;
				const res = await this.enumsStore.createEnumSet({ name: this.name });
				console.log({ res });
				this.loading = false;
				this.modalBus.emit('close');
				this.showMessage({
					title: this.$locale.baseText('enums.addEnumsSet.success'),
					type: 'success',
				});
			} catch (error) {
				if (error.httpStatusCode && error.httpStatusCode === 400) {
					this.infoTextErrorMessage = error.message;
				} else {
					this.showError(error, this.$locale.baseText('enums.addEnumsSet.error'));
				}
			} finally {
				this.loading = false;
			}
		},
		onModalClose() {
			return !this.loading;
		},
		onValidate(value: boolean) {
			this.formValidationStatus.name = value;
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
