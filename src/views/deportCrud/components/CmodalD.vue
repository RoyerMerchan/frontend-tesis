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
    na_sport: yup.string().required('Nombre requerido'),
    de_sport: yup.string().required('Descripción requerida')
  })
);

const submit = async (values) => {
  visible.value = false;

  try {
    const response = await send({
      endpoint: 'sport',
      method: 'post',
      body: {
        name_sport: values.na_sport,
        de_sport: values.de_sport
      }
    });

    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Deporte creado correctamente.' });
    emit('create');
  } catch (error) {
    console.error('Error al crear deporte:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el deporte.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '400px' }">
    <template #header>
      <h2 class="text-2xl font-bold text-gray-800">Crear Deporte</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="grid gap-4">
        <!-- Nombre del deporte -->
        <div class="flex flex-col">
          <label for="na_sport">Nombre</label>
          <Field name="na_sport" v-slot="{ field }">
            <InputText v-bind="field" id="na_sport" placeholder="Ej. Fútbol" class="w-full" />
          </Field>
          <ErrorMessage name="na_sport" class="text-red-500 text-xs" />
        </div>

        <!-- Descripción del deporte -->
        <div class="flex flex-col">
          <label for="de_sport">Descripción</label>
          <Field name="de_sport" v-slot="{ field }">
            <InputText v-bind="field" id="de_sport" placeholder="Ej. Deporte de equipo con balón" class="w-full" />
          </Field>
          <ErrorMessage name="de_sport" class="text-red-500 text-xs" />
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-2 mt-4">
          <Button label="Cancelar" @click="visible = false" severity="secondary" />
          <Button label="Guardar" type="submit" />
        </div>
      </div>
    </Form>
  </Dialog>
</template>
