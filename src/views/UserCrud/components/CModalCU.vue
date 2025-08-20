<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Dropdown from 'primevue/dropdown';
import { send } from '@/api/send';
import { useToast } from 'primevue/usetoast';
import { ref, onMounted, Text } from 'vue';

const toast = useToast();
const visible = defineModel('visible');

const profiles = ref([]);
const typePersons = ref([]);

const schema = toTypedSchema(
    yup.object({
        username: yup.string().required('Requerido'),
        institutional_email: yup.string().email('Correo inválido').required('Requerido'),
        password: yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
        id_profile: yup
            .object({
                value: yup
                    .number()
                    .typeError('Debe seleccionar un perfil válido')
                    .required('Tipo requerido')
            })
            .required('Tipo requerido'),
        na_person: yup.string().required('Nombre requerido'),
        ln_person: yup.string().required('Apellido requerido'),
        type_person_id: yup
            .object({
                value: yup
                    .number()
                    .typeError('Debe seleccionar un tipo de persona válido')
                    .required('Tipo requerido')
            })
            .required('Tipo requerido')
    })
);

onMounted(async () => {
    try {
        const response = await send({
            endpoint: 'profile',
            method: 'get'
        });
        console.log('Perfiles:', response.data);
        profiles.value = response.data || [];
    } catch (error) {
        console.error('Error al cargar perfiles:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los perfiles.' });
    }

    try {
        const response = await send({
            endpoint: 'typeperson',
            method: 'get'
        });
        console.log('Tipos de persona:', typeof response.data[0].type_person_id);


        typePersons.value = response.data || [];
    } catch (error) {
        console.error('Error al cargar tipos de persona:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de persona.' });
    }
});
const emit = defineEmits(['create']);

const submit = async (values) => {
    console.log('Formulario válido:', values);
    visible.value = false;
    const insert = {
        username: values.username,
        password: values.password,
        institutional_email: values.institutional_email,
        id_profile: values.id_profile.value,
        na_person: values.na_person,
        ln_person: values.ln_person,
        type_person_id: values.type_person_id.value
    };

    try {
        const response = await send({
            endpoint: 'user/person',
            method: 'post',
            body: insert
        });
        console.log('Usuario creado:', response);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente.' });
        emit('create');
    } catch (error) {
        console.error('Error al crear usuario:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario.' });
    }
};
</script>

<template>
    <Dialog v-model:visible="visible"  :modal="true" :closable="true" :style="{ width: '500px',  }">
      <template #header>
        <h2 class="text-4xl font-bold text-gray-800">Crear Usuario</h2>
      </template>
        <Form @submit="submit" :validation-schema="schema" class="">
            <div class="grid gap 10 space-y-4">
                <!-- Campo: Username -->
                <div class="flex flex-col w-full max-w-md mx-auto">
                    <label for="username" class="text-left">Username</label>
                    <Field name="username" v-slot="{ field }">
                        <InputText v-bind="field" id="username" placeholder="Ingrese username" class="w-full" />
                    </Field>
                    <ErrorMessage name="username" class="text-red-500 text-xs" />
                </div>

                <!-- Campo: Password -->
                <div class="flex flex-col w-full max-w-md mx-auto">
                    <label for="password" class="text-left">Password</label>
                    <Field name="password" v-slot="{ field }">
                        <Password v-bind="field" toggleMask placeholder="Ingrese contraseña" class="w-full" />
                    </Field>
                    <ErrorMessage name="password" class="text-red-500 text-xs" />
                </div>

                <!-- Email -->
                <div class="flex flex-col w-full max-w-md mx-auto">
                    <label for="email" class="text-left">Email institucional</label>
                    <Field name="institutional_email" v-slot="{ field }">
                        <InputText v-bind="field" id="email" placeholder="Correo institucional" class="w-full" />
                    </Field>
                    <ErrorMessage name="institutional_email" class="text-red-500 text-xs" />
                </div>
                <!-- Tipo de perfil -->

                <div class="flex flex-col w-full max-w-md mx-auto">
                    <label for="profile_id" class="text-left">Tipo de perfil</label>
                    <Field name="id_profile" v-slot="{ field }">
                        <Dropdown v-bind="field" :options="profiles" optionLabel="profile_de" optionValue="profile_id"
                            placeholder="Selecciona uno" class="w-full" id="profile_id" />
                    </Field>
                    <ErrorMessage name="id_profile" class="text-red-500 text-xs" />
                </div>
                <!-- Nombre de persona -->
                <div class="flex flex-col w-full max-w-md mx-auto">
                    <label for="na_person" class="text-left">Nombre</label>
                    <Field name="na_person" v-slot="{ field }">
                        <InputText v-bind="field" id="na_person" placeholder="Ingrese nombre" class="w-full" />
                    </Field>
                    <ErrorMessage name="na_person" class="text-red-500 text-xs" />
                </div>
                <!-- Apellido de persona -->
                <div class="flex flex-col w-full max-w-md mx-auto">
                    <label for="ln_person" class="text-left">Apellido</label>
                    <Field name="ln_person" v-slot="{ field }">
                        <InputText v-bind="field" id="ln_person" placeholder="Ingrese apellido" class="w-full" />
                    </Field>
                    <ErrorMessage name="ln_person" class="text-red-500 text-xs" />
                </div>

                <!-- Tipo de persona -->
                <div class="flex flex-col w-full max-w-md mx-auto">
                    <label for="type_person_id" class="text-left">Tipo de persona</label>
                    <Field name="type_person_id" v-slot="{ field }">
                        <Dropdown v-bind="field" :options="typePersons" optionLabel="de_type_person"
                            :optionValue="(option) => Number(option.type_person_id)" placeholder="Selecciona uno"
                            class="w-full" id="type_person_id" />
                    </Field>
                    <ErrorMessage name="type_person_id" class="text-red-500 text-xs" />
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
