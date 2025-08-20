<template>
  <Dialog v-model:visible="visible" header="Crear tipo persona" :modal="true" :closable="true" :style="{ width: '500px' }">
    <Form @submit="submit" :validation-schema="schema">
      <div class="grid gap-4 p-4">
        <!-- Campo: Descripción -->
        <div class="flex flex-col">
          <label for="de_type_person" class="text-left">Descripción</label>
          <Field name="de_type_person" v-slot="{ field }">
            <InputText v-bind="field" id="de_type_person" placeholder="Ingrese descripción" class="w-full" />
          </Field>
          <ErrorMessage name="de_type_person" class="text-red-500 text-xs" />
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
    de_type_person: yup
      .string()
      .required('La descripción es obligatoria')
      .min(3, 'Debe tener al menos 3 caracteres'),
  })
);

const submit = async (values) => {
  const insert = {
    de_type_person: values.de_type_person,
  };

  try {
    const response = await send({
      endpoint: 'typeperson',
      method: 'post',
      body: insert, // ✅ usa "data" en lugar de "body"
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Tipo de persona creado:', response.data);
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Tipo de persona creado correctamente.' });
    emit('create');
    visible.value = false;
  } catch (error) {
    console.error('Error al crear tipo de persona:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el tipo de persona.' });
  }
};
</script>
