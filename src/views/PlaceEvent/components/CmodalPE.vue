<template>
  <Dialog v-model:visible="visible" header="Crear lugar de evento" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="name_place" class="text-left">nombre de lugar</label>
      <Field name="name_place" v-slot="{ field }">
        <InputText v-bind="field" id="name_place" placeholder="Ingrese nombre lugar" class="w-full" />
      </Field>
      <ErrorMessage name="name_place" class="text-red-500 text-xs" />
    </div>


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="ubication" class="text-left">ubicacion</label>
      <Field name="ubication" v-slot="{ field }">
        <InputText v-bind="field" id="ubication" placeholder="Ingrese ubicacion" class="w-full" />
      </Field>
      <ErrorMessage name="ubication" class="text-red-500 text-xs" />
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
    name_place: yup.string().required('El nombre del lugar es obligatorio').min(3, 'El nombre del lugar debe tener al menos 3 caracteres'),
    ubication: yup.string().required('La ubicación es obligatoria').min(3, 'La ubicación debe tener al menos 3 caracteres'),
  })
);

// Reactive form data
const form = ref({
  name_place: '',
  ubication: '',
});

// Watch for changes in the form to reset errors



const submit = () => {
  console.log('Formulario válido:', form.value);
  visible.value = false;
  // Aquí puedes emitir el evento o hacer la llamada a API
};
</script>
