<template>
  <Dialog v-model:visible="visible" header="Crear estadistica" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="stadistic" class="text-left">estadistica</label>
      <Field name="stadistic" v-slot="{ field }">
        <InputText v-bind="field" id="stadistic" placeholder="Ingrese nombre" class="w-full" />
      </Field>
      <ErrorMessage name="stadistic" class="text-red-500 text-xs" />
    </div>

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="id_stadistic_concept" class="text-left">concepto estadistico</label>
      <Field name="id_stadistic_concept" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="tiposConcepto"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="id_stadistic_concept"
        />
      </Field>
      <ErrorMessage name="id_stadistic_concept" class="text-red-500 text-xs" />
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

const tiposConcepto = [
  { label: 'Goles', value: 1 },
  { label: 'Asistencias', value: 2 },
  { label: 'Tarjetas Amarillas', value: 3 },
  { label: 'Tarjetas Rojas', value: 4 },
  { label: 'Faltas Cometidas', value: 5 },
  { label: 'Faltas Recibidas', value: 6 },
  { label: 'Pases Completados', value: 7 },
  { label: 'Pases Fallidos', value: 8 },
  { label: 'Tiros a Puerta', value: 9 },
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

const schema = toTypedSchema(
  yup.object({
    id_stadistic_concept: yup.number().required('El concepto estadístico es obligatorio').nullable(),
    id_player: yup.number().required('El jugador es obligatorio').nullable(),
    id_competition: yup.number().required('La competición es obligatoria').nullable(),
    stadistic: yup.string().required('La estadística es obligatoria'),
  })
);




const submit = () => {
  console.log('Formulario válido:', form.value);
  visible.value = false;
  // Aquí puedes emitir el evento o hacer la llamada a API
};
</script>
