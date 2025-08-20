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
    name_place_event: yup.string().required('Nombre requerido'),
    ubication_place_event: yup.string().required('Ubicación requerida')
  })
);

const submit = async (values) => {
  visible.value = false;

  try {
    const response = await send({
      endpoint: 'placeevent',
      method: 'post',
      body: values
    });

    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lugar creado correctamente.' });
    emit('create');
  } catch (error) {
    console.error('Error al crear lugar:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el lugar.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-2xl font-bold text-gray-800">Crear Lugar de Evento</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema" >
      <div class="grid gap-6 space-y-4">
        <!-- Nombre del lugar -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="name_place_event" class="text-left">Nombre del lugar</label>
          <Field name="name_place_event" v-slot="{ field }">
            <InputText v-bind="field" id="name_place_event" placeholder="" class="w-full" />
          </Field>
          <ErrorMessage name="name_place_event" class="text-red-500 text-xs" />
        </div>

        <!-- Ubicación -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="ubication_place_event" class="text-left">Ubicación</label>
          <Field name="ubication_place_event" v-slot="{ field }">
            <InputText v-bind="field" id="ubication_place_event" placeholder="" class="w-full" />
          </Field>
          <ErrorMessage name="ubication_place_event" class="text-red-500 text-xs" />
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
