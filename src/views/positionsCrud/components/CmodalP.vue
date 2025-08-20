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

const form = ref({
  name_position: ''
});

const schema = toTypedSchema(
  yup.object({
    name_position: yup.string().required('Requerido')
  })
);

const submit = async (values, { resetForm }) => {
  try {
    await send({
      endpoint: 'position',
      method: 'post',
      body: values
    });

    toast.add({ severity: 'success', summary: 'Creado', detail: 'Posición creada correctamente.' });
    visible.value = false;
    emit('create');
    resetForm();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la posición.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-4xl font-bold text-gray-800">Nueva Posición</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema" >
      <div class="grid gap-10">
        <!-- Campo: Nombre de la posición -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="name_position" class="text-left">Nombre de la Posición</label>
          <Field name="name_position" v-slot="{ field }">
            <InputText v-bind="field" id="name_position" placeholder="Ingrese nombre de la posición" class="w-full" />
          </Field>
          <ErrorMessage name="name_position" class="text-red-500 text-xs" />
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
