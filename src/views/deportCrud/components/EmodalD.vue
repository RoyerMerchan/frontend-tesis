<template>
    <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
        <template #header>
            <h2 class="text-4xl font-bold text-gray-800">Editar Deporte</h2>
        </template>
        <Form @submit="submit" :validation-schema="schema" :initial-values="form">
            <div class="grid gap-10">
                <!-- Campo: Nombre del deporte -->
                <div class="flex flex-col w-full max-w-md mx-auto">
                    <label for="name" class="text-left">Nombre</label>
                    <Field name="name" v-slot="{ field }">
                        <InputText v-bind="field" id="name" placeholder="Ingrese nombre del deporte" class="w-full" />
                    </Field>
                    <ErrorMessage name="name" class="text-red-500 text-xs" />
                </div>

                <!-- Campo: Descripción -->
                <div class="flex flex-col w-full max-w-md mx-auto">
                    <label for="description" class="text-left">Descripción (opcional)</label>
                    <Field name="description" v-slot="{ field }">
                        <InputText v-bind="field" id="description" placeholder="Ingrese descripción" class="w-full" />
                    </Field>
                    <ErrorMessage name="description" class="text-red-500 text-xs" />
                </div>

                <!-- Botones -->
                <div class="flex justify-end w-full max-w-md mx-auto gap-2 mt-4">
                    <Button label="Cancelar" @click="visible = false" severity="secondary" />
                    <Button label="Guardar" type="submit" />
                </div>
            </div>
        </Form>
    </Dialog>
</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { send } from '@/api/send';
import { useToast } from 'primevue/usetoast';
import { ref, watch } from 'vue';

const toast = useToast();
const visible = defineModel('visible');
const props = defineProps({ deporte: Object });
const emit = defineEmits(['update']);

const form = ref({
    sport_id: null,
    name: '',
    description: ''
});

watch(() => props.deporte, (val) => {
    if (val) {
        form.value = {
            sport_id: val.sport_id,
            name: val.na_sport,
            description: val.de_sport || ''
        };
    }
}, { immediate: true });

const schema = toTypedSchema(
    yup.object({
        name: yup.string().required('Requerido'),
        description: yup
            .string()
            .transform((value) => (value === '' ? null : value))
            .nullable()
            .notRequired()
            .min(3, 'Mínimo 3 caracteres')
    })
);

const submit = async (values) => {
    const payload = {
        id_sport: form.value.sport_id,
        name_sport: values.name,
        de_sport: values.description || undefined
    };

    try {
        const response = await send({
            endpoint: 'sport',
            method: 'put',
            body: payload
        });

        toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Deporte actualizado correctamente.' });
        visible.value = false;
        emit('update');
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el deporte.' });
    }
};
</script>
