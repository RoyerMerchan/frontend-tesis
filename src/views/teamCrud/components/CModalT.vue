<template>
  <Dialog v-model:visible="visible" header="Crear equipo" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="name_team" class="text-left">nombre equipo</label>
      <Field name="name_team" v-slot="{ field }">
        <InputText v-bind="field" id="name_team" placeholder="Ingrese nombre" class="w-full" />
      </Field>
      <ErrorMessage name="name_team" class="text-red-500 text-xs" />
    </div>

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="id_sport" class="text-left">deporte</label>
      <Field name="id_sport" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="tiposDeporte"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="id_sport"
        />
      </Field>
      <ErrorMessage name="id_sport" class="text-red-500 text-xs" />
    </div>

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="id_institucion" class="text-left">deporte</label>
      <Field name="id_institucion" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="tiposInstitucion"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="id_institucion"
        />
      </Field>
      <ErrorMessage name="id_sport" class="text-red-500 text-xs" />
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
import Dropdown from 'primevue/dropdown';




// Props para control externo (opcional)
const visible = defineModel('visible');

const form = ref({
  name_team: '',
  id_sport: null,
  id_institucion: null,
});

const tiposDeporte = [
  { label: 'Fútbol', value: 1 },
  { label: 'Baloncesto', value: 2 },
  { label: 'Tenis', value: 3 },
  { label: 'Natación', value: 4 },
  { label: 'Atletismo', value: 5 },
];

const tiposInstitucion = [
  { label: 'Institución A', value: 1 },
  { label: 'Institución B', value: 2 },
  { label: 'Institución C', value: 3 },
];

const schema = toTypedSchema(
  yup.object({
    name_team: yup.string().required('El nombre del equipo es obligatorio'),
    id_sport: yup.number().required('El deporte es obligatorio'),
    id_institucion: yup.number().required('La institución es obligatoria'),
  })
);




const submit = () => {
  console.log('Formulario válido:', form.value);
  visible.value = false;
  // Aquí puedes emitir el evento o hacer la llamada a API
};
</script>
