<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { send } from '@/api/send';
import { useToast } from 'primevue/usetoast';
import { ref, watch } from 'vue';

const toast = useToast();
const visible = defineModel('visible');
const props = defineProps({ tipo: Object });
const emit = defineEmits(['update']);

const form = ref({
    id_type_person: null,
   de_type_person: '',
});

watch(() => props.tipo, (val) => {
    if (val) {
        form.value = {
            id_type_person: val.type_person_id,
            de_type_person: val.de_type_person,
        };
    }
}, { immediate: true });

const schema = toTypedSchema(
    yup.object({
        de_type_person: yup
            .string()
            .required('La descripción es obligatoria')
            .min(3, 'Debe tener al menos 3 caracteres'),
    })
);

const submit = async (values) => {
    const payload = {
       id_type_person: form.value.id_type_person,
        de_type_person: values.de_type_person,
    };

    try {
        const response = await send({
            endpoint: 'typeperson',
            method: 'put',
            body: payload
        });

        toast.add({ severity: 'success', summary: 'Actualizado', detail: 'tipo de persona  actualizado correctamente.' });
        visible.value = false;
        emit('update');
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el tipo de persona.' });
    }
};
</script>

<template>
    <Dialog v-model:visible="visible"  :modal="true" :closable="true"
        :style="{ width: '500px' }">
         <template #header>
        <h2 class="text-4xl font-bold text-gray-800">Editar tipo persona</h2>
      </template>
        <Form @submit="submit" :validation-schema="schema" :initial-values="form">
            <div class="grid gap-10 ">
                <!-- Campo: Username -->
                <div class="flex flex-col w-full max-w-md mx-auto">
                    <label for="de_type_person" class="text-left">Descripcion</label>
                    <Field name="de_type_person" v-slot="{ field }">
                        <InputText v-bind="field" id="de_type_person" placeholder="Ingrese nuevo descripcion" class="w-full" />
                    </Field>
                    <ErrorMessage name="de_type_person" class="text-red-500 text-xs" />
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
