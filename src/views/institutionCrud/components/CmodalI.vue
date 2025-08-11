<template>
  <Dialog v-model:visible="visible" header="Crear institucion" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="name_institucion" class="text-left">institucion</label>
      <Field name="name_institucion" v-slot="{ field }">
        <InputText v-bind="field" id="name_institucion" placeholder="Ingrese institucion" class="w-full" />
      </Field>
      <ErrorMessage name="name_institucion" class="text-red-500 text-xs" />
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
    name_institucion: yup.string().required('El nombre de la institución es obligatorio'),
  })
);

// Reactive form data
const form = ref({
  name_institucion: '',
});

// Watch for changes in the form to reset errors



const submit = () => {
  console.log('Formulario válido:', form.value);
  visible.value = false;
  // Aquí puedes emitir el evento o hacer la llamada a API
};
</script>
