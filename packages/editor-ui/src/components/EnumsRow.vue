<script lang="ts" setup>
import type { ComponentPublicInstance, PropType } from 'vue';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import type { EsaEnum, EsaEnumData, Rule, RuleGroup } from '@/Interface';
import { useI18n } from '@/composables/useI18n';
import { useToast } from '@/composables/useToast';
import { useClipboard } from '@/composables/useClipboard';

const i18n = useI18n();
const clipboard = useClipboard();
const { showMessage } = useToast();

const emit = defineEmits([
	'save',
	'cancel',
	'edit',
	'delete',
	'setSelectedEnum',
	'onFocusFirstInput',
]);

const props = defineProps({
	data: {
		type: Object as PropType<EsaEnumData>,
		default: () => ({}),
	},
	editing: {
		type: Boolean,
		default: false,
	},
	enumSet: {
		type: Object as PropType<EsaEnum>,
		default: () => ({}),
	},
	selectedEnumUsedInAnyNode: {
		type: Boolean,
		default: true,
	},
});

const modelValue = ref<EsaEnumData>({ ...props.data });

const formValidationStatus = ref<Record<string, boolean>>({
	key: false,
	value: false,
});
const formValid = computed(() => {
	return formValidationStatus.value.key && formValidationStatus.value.value;
});

const keyInputRef = ref<ComponentPublicInstance & { inputRef?: HTMLElement }>();
const valueInputRef = ref<ComponentPublicInstance & { inputRef?: HTMLElement }>();

const alias = ref(`<<${props.enumSet.name}.${props.data.key}>>`);

onMounted(() => {
	focusSecondInput();
});

const keyValidationRules: Array<Rule | RuleGroup> = [
	{ name: 'REQUIRED' },
	{ name: 'MAX_LENGTH', config: { maximum: 50 } },
	{
		name: 'MATCH_REGEX',
		config: {
			regex: /^[a-zA-Z]/,
			message: i18n.baseText('enums.editing.key.error.startsWithLetter'),
		},
	},
	{
		name: 'MATCH_REGEX',
		config: {
			regex: /^[a-zA-Z][a-zA-Z0-9_]*$/,
			message: i18n.baseText('enums.editing.key.error.jsonKey'),
		},
	},
];

const valueValidationRules: Array<Rule | RuleGroup> = [
	{ name: 'MAX_LENGTH', config: { maximum: 220 } },
];

watch(
	() => modelValue.value.key,
	async () => {
		await nextTick();
		if (formValidationStatus.value.key) {
			updateAliasSyntax();
		}
	},
);

function updateAliasSyntax() {
	alias.value = `<<${props.enumSet.name}.${modelValue.value.key || props.data.key}>>`;
}

async function onCancel() {
	modelValue.value = { ...props.data };
	emit('cancel', modelValue.value);
}

async function onSave() {
	emit('save', modelValue.value);
}

async function onEdit() {
	emit('edit', modelValue.value);

	await nextTick();

	focusSecondInput();
}

async function onDelete() {
	await onSetSelectedEnum();
	await nextTick();
	emit('delete', modelValue.value);
}

async function onSetSelectedEnum() {
	emit('setSelectedEnum', modelValue.value);
}

function onValidate(key: string, value: boolean) {
	formValidationStatus.value[key] = value;
}

function onAliasClick() {
	void clipboard.copy(alias.value);
	showMessage({
		title: i18n.baseText('enums.row.alias.copiedToClipboard'),
		type: 'success',
	});
}

function focusSecondInput() {
	valueInputRef.value?.inputRef?.focus?.();
}

async function onFocus() {
	await onSetSelectedEnum();
	await nextTick();
	emit('onFocusFirstInput');
}
</script>

<template>
	<tr :class="$style.enumsRow" data-test-id="enums-row">
		<td class="enums-key-column">
			<div>
				<span v-if="!editing">{{ data.key }}</span>
				<n8n-form-input
					v-else
					ref="keyInputRef"
					v-model="modelValue.key"
					label
					name="key"
					data-test-id="enum-row-key-input"
					:placeholder="i18n.baseText('enums.editing.key.placeholder')"
					required
					validate-on-blur
					:validation-rules="keyValidationRules"
					@validate="(value: boolean) => onValidate('key', value)"
					@focus="() => onFocus()"
				/>
			</div>
		</td>
		<td class="enums-value-column">
			<div>
				<span v-if="!editing">{{ data.value }}</span>
				<n8n-form-input
					v-else
					ref="valueInputRef"
					v-model="modelValue.value"
					label
					name="value"
					data-test-id="enum-row-value-input"
					:placeholder="i18n.baseText('enums.editing.value.placeholder')"
					validate-on-blur
					:validation-rules="valueValidationRules"
					@validate="(value: boolean) => onValidate('value', value)"
				/>
			</div>
		</td>
		<td class="enums-alias-column">
			<div>
				<n8n-tooltip placement="top">
					<span v-if="modelValue.key && alias" :class="$style.aliasSyntax" @click="onAliasClick">{{
						alias
					}}</span>
					<template #content>
						{{ i18n.baseText('enums.row.alias.copyToClipboard') }}
					</template>
				</n8n-tooltip>
			</div>
		</td>
		<td>
			<div v-if="editing" :class="$style.buttons">
				<n8n-button
					data-test-id="enum-row-cancel-button"
					type="tertiary"
					class="mr-xs"
					@click="onCancel"
				>
					{{ i18n.baseText('enums.row.button.cancel') }}
				</n8n-button>
				<n8n-button
					data-test-id="enum-row-save-button"
					:disabled="!formValid"
					type="primary"
					@click="onSave"
				>
					{{ i18n.baseText('enums.row.button.save') }}
				</n8n-button>
			</div>
			<div v-else :class="[$style.buttons, $style.hoverButtons]">
				<div>
					<n8n-button
						data-test-id="enum-row-edit-button"
						type="tertiary"
						class="mr-xs"
						@click="onEdit"
					>
						{{ i18n.baseText('enums.row.button.edit') }}
					</n8n-button>
				</div>
				<div>
					<n8n-button data-test-id="enum-row-delete-button" type="tertiary" @click="onDelete">
						{{ i18n.baseText('enums.row.button.delete') }}
					</n8n-button>
				</div>
			</div>
		</td>
	</tr>
</template>

<style lang="scss" module>
.enumsRow {
	&:hover {
		.hoverButtons {
			opacity: 1;
		}
	}

	td {
		> div {
			display: flex;
			align-items: center;
			min-height: 40px;
		}
	}
}

.buttons {
	display: flex;
	flex-wrap: nowrap;
	justify-content: flex-end;
}

.hoverButtons {
	opacity: 0;
	transition: opacity 0.2s ease;
}

.aliasSyntax {
	cursor: pointer;
	background: var(--color-variables-usage-syntax-bg);
	color: var(--color-variables-usage-font);
	font-family: var(--font-family-monospace);
	font-size: var(--font-size-s);
}
</style>
