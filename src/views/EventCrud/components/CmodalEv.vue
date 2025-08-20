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
    name: yup.string().required('El nombre del evento es obligatorio')
  })
);

const submit = async (values) => {
  visible.value = false;

  try {
    const response = await send({
      endpoint: 'event',
      method: 'post',
      body: {
        name_event: values.name
      }
    });

    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Evento creado correctamente.' });
    emit('create');
  } catch (error) {
    console.error('Error al crear evento:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el evento.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-4xl font-bold text-gray-800">Crear Evento</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="grid gap-6 p-4">
        <!-- Campo: Nombre del evento -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="name" class="text-left">Nombre del Evento</label>
          <Field name="name" v-slot="{ field }">
            <InputText v-bind="field" id="name" placeholder="Ej. Conferencia de Tecnología" class="w-full" />
          </Field>
          <ErrorMessage name="name" class="text-red-500 text-xs" />
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
