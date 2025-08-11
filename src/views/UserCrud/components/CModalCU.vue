<template>
  <Dialog v-model:visible="visible" header="Crear Usuario" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">

    <!-- Campo: Username -->
    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="username" class="text-left">Username</label>
      <Field name="username" v-slot="{ field }">
        <InputText v-bind="field" id="username" placeholder="Ingrese username" class="w-full" />
      </Field>
      <ErrorMessage name="username" class="text-red-500 text-xs" />
    </div>

    <!-- Campo: Password -->
    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="password" class="text-left ">Password</label>
      <Field name="password" v-slot="{ field }">
        <Password v-bind="field" toggleMask placeholder="Ingrese contraseña" class="w-full" />
      </Field>
      <ErrorMessage name="password" class="text-red-500 text-xs" />
    </div>

    <!-- Email -->
    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="email" class="text-left">Email institucional</label>
      <Field name="email" v-slot="{ field }">
        <InputText v-bind="field" id="email" placeholder="Correo institucional" class="w-full" />
      </Field>
      <ErrorMessage name="email" class="text-red-500 text-xs" />
    </div>

    <!-- Nombre -->
    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="nombre" class="text-left">Nombre</label>
      <Field name="nombre" v-slot="{ field }">
        <InputText v-bind="field" id="nombre" placeholder="Ingrese nombre" class="w-full" />
      </Field>
      <ErrorMessage name="nombre" class="text-red-500 text-xs" />
    </div>

    <!-- Apellido -->
    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="apellido" class="text-left">Apellido</label>
      <Field name="apellido" v-slot="{ field }">
        <InputText v-bind="field" id="apellido" placeholder="Ingrese apellido" class="w-full" />
      </Field>
      <ErrorMessage name="apellido" class="text-red-500 text-xs" />
    </div>

    <!-- Tipo Persona -->
    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="id_tipopersona" class="text-left">Tipo de Persona</label>
      <Field name="id_tipopersona" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="tiposPersona"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="id_tipopersona"
        />
      </Field>
      <ErrorMessage name="id_tipopersona" class="text-red-500 text-xs" />
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
import Password from 'primevue/password';
import Dropdown from 'primevue/dropdown';




// Props para control externo (opcional)
const visible = defineModel('visible');

const form = ref({
  username: '',
  password: '',
  email: '',
  nombre: '',
  apellido: '',
  id_tipopersona: null
});

const tiposPersona = [
  { label: 'Estudiante', value: 1 },
  { label: 'Docente', value: 2 },
  { label: 'Administrativo', value: 3 }
];

const schema = toTypedSchema(
  yup.object({
    username: yup.string().required('Requerido'),
    password: yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
    email: yup.string().email('Correo inválido').required('Requerido'),
    nombre: yup.string().required('Requerido'),
    apellido: yup.string().required('Requerido'),
    id_tipopersona: yup
  .number()
  .transform((value, originalValue) =>
    typeof originalValue === 'object' && originalValue?.value
      ? Number(originalValue.value)
      : Number(originalValue)
  )
  .typeError('Debes seleccionar un tipo de persona válido')
  .required('Este campo es obligatorio') })
);




const submit = () => {
  console.log('Formulario válido:', form.value);
  visible.value = false;
  // Aquí puedes emitir el evento o hacer la llamada a API
};
</script>
