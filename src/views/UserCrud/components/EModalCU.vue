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
const props = defineProps({ usuario: Object });
const emit = defineEmits(['update']);

const form = ref({
    user_id: null,
    username: '',
    password: ''
});

watch(() => props.usuario, (val) => {
    if (val) {
        form.value = {
            user_id: val.user_id,
            username: val.na_user,
            password: ''
        };
    }
}, { immediate: true });

const schema = toTypedSchema(
    yup.object({
        username: yup.string().required('Requerido'),
        password: yup
            .string()
            .transform((value) => (value === '' ? null : value))
            .nullable()
            .notRequired()
            .min(6, 'Mínimo 6 caracteres')
    })
);

const submit = async (values) => {
    const payload = {
        id: form.value.user_id,
        username: values.username,
        password: values.password || undefined
    };

    try {
        const response = await send({
            endpoint: 'user',
            method: 'put',
            body: payload
        });

        toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Usuario actualizado correctamente.' });
        visible.value = false;
        emit('update');
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario.' });
    }
};
</script>

<template>
    <Dialog v-model:visible="visible"  :modal="true" :closable="true"
        :style="{ width: '500px' }">
         <template #header>
        <h2 class="text-4xl font-bold text-gray-800">Editar Usuario</h2>
      </template>
        <Form @submit="submit" :validation-schema="schema" :initial-values="form">
            <div class="grid gap-10 ">
                <!-- Campo: Username -->
                <div class="flex flex-col w-full max-w-md mx-auto">
                    <label for="username" class="text-left">Username</label>
                    <Field name="username" v-slot="{ field }">
                        <InputText v-bind="field" id="username" placeholder="Ingrese nuevo username" class="w-full" />
                    </Field>
                    <ErrorMessage name="username" class="text-red-500 text-xs" />
                </div>

                <!-- Campo: Password -->
                <div class="flex flex-col w-full max-w-md mx-auto">
                    <label for="password" class="text-left">Password (opcional)</label>
                    <Field name="password" v-slot="{ field }">
                        <Password v-bind="field" toggleMask placeholder="Ingrese nueva contraseña" class="w-full" />
                    </Field>
                    <ErrorMessage name="password" class="text-red-500 text-xs" />
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
