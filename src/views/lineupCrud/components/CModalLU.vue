<template>
  <Dialog v-model:visible="visible" header="Crear alineacion" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="description" class="text-left">descripcion</label>
      <Field name="description" v-slot="{ field }">
        <InputText v-bind="field" id="description" placeholder="Ingrese descripcion" class="w-full" />
      </Field>
      <ErrorMessage name="description" class="text-red-500 text-xs" />
    </div>

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="position" class="text-left">posicion</label>
      <Field name="position" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="tiposposcion"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="position"
        />
      </Field>
      <ErrorMessage name="position" class="text-red-500 text-xs" />
    </div>

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="id_person" class="text-left">jugador</label>
      <Field name="id_person" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="tipospersonas"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="id_person"
        />
      </Field>
      <ErrorMessage name="id_person" class="text-red-500 text-xs" />
    </div>

       <div class="flex flex-col w-full max-w-md mx-auto">competicion  <Field name="id_competition" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="tiposCompeticion"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="id_competition"
        />
      </Field>
      <ErrorMessage name="id_competition" class="text-red-500 text-xs" />
    </div>

  <div class="flex flex-col w-full max-w-md mx-auto">tipo posicion  <Field name="id_type_position" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="tipostypos"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="id_type_position"
        />
      </Field>
      <ErrorMessage name="id_type_position" class="text-red-500 text-xs" />
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
  id_stadistic_concept: null,
  id_player: null,
  id_competition: null,
  stadistic: '',
});

const tiposposcion = [
+ { label: 'Portero', value: 1 },
  { label: 'Defensa', value: 2 },
  { label: 'Centrocampista', value: 3 },
  { label: 'Delantero', value: 4 },
  { label: 'Suplente', value: 5 },
];

const tiposCompeticion = [
  { label: 'Competición A', value: 1 },
  { label: 'Competición B', value: 2 },
  { label: 'Competición C', value: 3 },
  { label: 'Competición D', value: 4 },
  { label: 'Competición E', value: 5 },
];

const tipospersonas = [
  { label: 'Jugador A', value: 1 },
  { label: 'Jugador B', value: 2 },
  { label: 'Jugador C', value: 3 },
  { label: 'Jugador D', value: 4 },
  { label: 'Jugador E', value: 5 },
];

const tipostypos = [
  { label: 'Titular', value: 1 },
  { label: 'Suplente', value: 2 },
  { label: 'Lesionado', value: 3 },
  { label: 'Transferible', value: 4 },
];

const schema = toTypedSchema(
  yup.object({
    description: yup.string().required('La descripción es obligatoria'),
    position: yup.number().required('La posición es obligatoria').nullable(),
    id_person: yup.number().required('El jugador es obligatorio').nullable(),
    id_competition: yup.number().required('La competición es obligatoria').nullable(),
    id_type_position: yup.number().required('El tipo de posición es obligatorio').nullable(),
  })
);




const submit = () => {
  console.log('Formulario válido:', form.value);
  visible.value = false;
  // Aquí puedes emitir el evento o hacer la llamada a API
};
</script>
