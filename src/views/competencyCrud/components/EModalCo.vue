<template>
<Dialog v-model:visible="visible" header="Editar competencia" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">

     <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="hora" class="text-left">descripcion</label>
      <Field name="hora" v-slot="{ field }">
        <InputText v-bind="field" id="hora" placeholder="Ingrese hora" class="w-full" />
      </Field>
      <ErrorMessage name="hora" class="text-red-500 text-xs" />
    </div>

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="place_event" class="text-left">lugar evento</label>
      <Field name="place_event" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="lugar_evento"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="place_event"
        />
      </Field>
      <ErrorMessage name="place_event" class="text-red-500 text-xs" />
    </div>

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="event" class="text-left">evento</label>
      <Field name="event" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="evento"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="event"
        />
      </Field>
      <ErrorMessage name="event" class="text-red-500 text-xs" />
    </div>

       <div class="flex flex-col w-full max-w-md mx-auto">tipo competicion  <Field name="id_competition" v-slot="{ field }">
        <Dropdown
          v-bind="field"
          :options="tipo_competencia"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="type_competition"
        />
      </Field>
      <ErrorMessage name="type_competition" class="text-red-500 text-xs" />
    </div>

  <div class="flex flex-col w-full max-w-md mx-auto">fecha
       <DatePicker
  v-model="fechaSeleccionada"
  placeholder="Selecciona una fecha"
  showIcon
  dateFormat="dd/mm/yy"
  class="w-full"
/>
      <ErrorMessage name="id_date" class="text-red-500 text-xs" />
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
import { ref, watch } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';



const visible = defineModel('visible');

// 🆕 Nuevas props
const props = defineProps({
  modoEdicion: Boolean,
  competencyEditando: Object,
});

const form = ref({
  hora: '',
  place_event: null,
  event: null,
  id_competition: null,
  id_date: null,
});

// 🧠 Rellenar campos si hay usuario a editar
watch(() => props.competencyEditando, (comp) => {
  if (props.modoEdicion && comp) {
    form.value = { ...comp };
  }
}, { immediate: true });

const evento = [
 { id: 101, nombre: 'Evento A' },
 { id: 102, nombre: 'Evento B' },
 { id: 103, nombre: 'Evento C' },
 { id: 104, nombre: 'Evento D' },
 { id: 105, nombre: 'Evento E' },
];

const lugar_evento = [
  { id: 106, nombre: 'Estadio A' },
  { id: 107, nombre: 'Estadio B' },
  { id: 108, nombre: 'Estadio C' },
  { id: 109, nombre: 'Estadio D' },
  { id: 110, nombre: 'Estadio E' },
];

const tipo_competencia = [
  { id: 111, nombre: 'Liga' },
  { id: 112, nombre: 'Torneo' },
  { id: 113, nombre: 'Copa' },
  { id: 114, nombre: 'Exhibición' },
];

const schema = toTypedSchema(
  yup.object({
    hora: yup.string().required('La hora es obligatoria'),
    place_event: yup.number().required('El lugar del evento es obligatorio').nullable(),
    event: yup.number().required('El evento es obligatorio').nullable(),
    id_competition: yup.number().required('El tipo de competencia es obligatorio').nullable(),
    id_date: yup.date().required('La fecha es obligatoria').nullable(),
  })
);

// ✨ Emitir evento diferente según modo
const emit = defineEmits(['guardar', 'actualizar']);
const submit = () => {
  if (props.modoEdicion) {
    emit('actualizar', form.value);
  } else {
    emit('guardar', form.value);
  }
  visible.value = false;
};
</script>
