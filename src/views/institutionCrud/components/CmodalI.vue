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
    name_institutions: yup.string().required('Nombre requerido')
  })
);

const submit = async (values) => {
  visible.value = false;

  try {
    const response = await send({
      endpoint: 'institution',
      method: 'post',
      body: {
        name_institutions: values.name_institutions
      }
    });

    console.log('Institución creada:', response);
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Institución creada correctamente.' });
    emit('create');
  } catch (error) {
    console.error('Error al crear institución:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la institución.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-3xl font-bold text-gray-800">Crear Institución</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="grid gap-6 space-y-4">
        <!-- Campo: Nombre de institución -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="name_institutions" class="text-left">Nombre de la institución</label>
          <Field name="name_institutions" v-slot="{ field }">
            <InputText v-bind="field" id="name_institutions" placeholder="" class="w-full" />
          </Field>
          <ErrorMessage name="name_institutions" class="text-red-500 text-xs" />
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
