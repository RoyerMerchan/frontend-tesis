<template>
  <Dialog v-model:visible="visible" header="Crear tipo persona" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="descripcion" class="text-left">descripcion</label>
      <Field name="descripcion" v-slot="{ field }">
        <InputText v-bind="field" id="descripcion" placeholder="Ingrese descripcion" class="w-full" />
      </Field>
      <ErrorMessage name="descripcion" class="text-red-500 text-xs" />
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

<script setup>
import { ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';





// Props para control externo (opcional)
const visible = defineModel('visible');

// Validación del formulario
const schema = toTypedSchema(
  yup.object({
    descripcion: yup.string().required('La descripción es obligatoria').min(3, 'La descripción debe tener al menos 3 caracteres'),
  })
);

// Reactive form data
const form = ref({
  descripcion: '',
});

// Watch for changes in the form to reset errors



const submit = () => {
  console.log('Formulario válido:', form.value);
  visible.value = false;
  // Aquí puedes emitir el evento o hacer la llamada a API
};
</script>
