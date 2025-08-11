<template>
<Dialog v-model:visible="visible" header="Editar estadistica" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="stadistic" class="text-left">estadistica</label>
      <Field name="stadistic" v-slot="{ field }">
        <InputText v-bind="field" id="stadistic" placeholder="Ingrese estadistica" class="w-full" />
      </Field>
      <ErrorMessage name="stadistic" class="text-red-500 text-xs" />
    </div>


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="id_stadistic_concept" class="text-left">concepto estadistico</label>
      <Field name="id_stadistic_concept" v-slot="{ field }">
        <Select
          v-bind="field"
          :options="tiposStadisticConcept"
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
        <Select
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

     <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="id_competition" class="text-left">competicion</label>
      <Field name="id_competition" v-slot="{ field }">
        <Select
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
    <div class="flex justify-end gap-2 mt-4">
      <Button label="Cancelar" severity="secondary" @click="visible = false" />
      <Button :label="modoEdicion ? 'Actualizar' : 'Guardar'" type="submit" />
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
import { Select } from 'primevue';



const visible = defineModel('visible');

// 🆕 Nuevas props
const props = defineProps({
  modoEdicion: Boolean,
  teamEditando: Object,
});

const form = ref({
  id_stadistic_concept: null,
  id_player: null,
  id_competition: null,
  stadistic: '',
});

// 🧠 Rellenar campos si hay usuario a editar
watch(() => props.teamEditando, (teamE) => {
  if (props.modoEdicion && teamE) {
    form.value = { ...teamE };
  }
}, { immediate: true });

const tiposStadisticConcept = [
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
    id_person: yup.number().required('El jugador es obligatorio').nullable(),
    id_competition: yup.number().required('La competición es obligatoria').nullable(),
    stadistic: yup.string().required('La estadística es obligatoria'),
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
