<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { send } from '@/api/send';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const toast = useToast();
const visible = defineModel('visible');
const emit = defineEmits(['create']);

const schema = toTypedSchema(
  yup.object({
    profile_de: yup.string().required('Descripción requerida')
  })
);

const submit = async (values) => {
  const payload = {
    profile_de: values.profile_de
  };

  try {
    const response = await send({
      endpoint: 'profile',
      method: 'post',
      body: payload
    });

    toast.add({ severity: 'success', summary: 'Creado', detail: 'Perfil creado correctamente.' });
    visible.value = false;
    emit('create');
  } catch (error) {
    console.error('Error al crear perfil:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el perfil.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-4xl font-bold text-gray-800">Crear Perfil</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="grid gap-10">
        <!-- Campo: Descripción del perfil -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="profile_de" class="text-left">Descripción del Perfil</label>
          <Field name="profile_de" v-slot="{ field }">
            <InputText v-bind="field" id="profile_de" placeholder="Ingrese descripción" class="w-full" />
          </Field>
          <ErrorMessage name="profile_de" class="text-red-500 text-xs" />
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
