<template>
  <Dialog v-model:visible="visible" header="Crear Perfil" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="de_perfil" class="text-left">Perfil</label>
      <Field name="de_perfil" v-slot="{ field }">
        <InputText v-bind="field" id="de_perfil" placeholder="Ingrese Perfil" class="w-full" />
      </Field>
      <ErrorMessage name="de_perfil" class="text-red-500 text-xs" />
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
    de_perfil: yup.string().required('El campo Perfil es obligatorio'),
  })
);

// Reactive form data
const form = ref({
  de_perfil: '',
});

// Watch for changes in the form to reset errors



const submit = () => {
  console.log('Formulario válido:', form.value);
  visible.value = false;
  // Aquí puedes emitir el evento o hacer la llamada a API
};
</script>
