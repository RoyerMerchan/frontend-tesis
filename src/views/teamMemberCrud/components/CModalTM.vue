<template>
  <Dialog v-model:visible="visible" header="Crear miembro equipo" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="number_player" class="text-left">numero jugardor equipo</label>
      <Field name="number_player" v-slot="{ field }">
        <InputText v-bind="field" id="number_player" placeholder="Ingrese numero" class="w-full" />
      </Field>
      <ErrorMessage name="number_player" class="text-red-500 text-xs" />
    </div>

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="id_team" class="text-left">equipo</label>
      <Field name="id_team" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="tiposEquipo"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="id_team"
        />
      </Field>
      <ErrorMessage name="id_team" class="text-red-500 text-xs" />
    </div>

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="id_person" class="text-left">jugador</label>
      <Field name="id_person" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="tiposPersonas"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="id_person"
        />
      </Field>
      <ErrorMessage name="id_person" class="text-red-500 text-xs" />
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
  id_person: null,
  number_player: null,
  id_team: null,
});

const tiposEquipo = [
  { label: 'Equipo A', value: 1 },
  { label: 'Equipo B', value: 2 },
  { label: 'Equipo C', value: 3 },
];

const tiposPersonas = [
  { label: 'Jugador 1', value: 101 },
  { label: 'Jugador 2', value: 102 },
  { label: 'Jugador 3', value: 103 },
  { label: 'Jugador 4', value: 104 },
  { label: 'Jugador 5', value: 105 },
];

const schema = toTypedSchema(
  yup.object({
    id_person: yup.number().required('El jugador es obligatorio').nullable(),
    number_player: yup.number().required('El numero de jugador es obligatorio').nullable(),
    id_team: yup.number().required('El equipo es obligatorio').nullable(),
  })
);




const submit = () => {
  console.log('Formulario válido:', form.value);
  visible.value = false;
  // Aquí puedes emitir el evento o hacer la llamada a API
};
</script>
