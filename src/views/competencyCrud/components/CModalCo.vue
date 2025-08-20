<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import { send } from '@/api/send';
import { useToast } from 'primevue/usetoast';
import { ref, onMounted } from 'vue';

const toast = useToast();
const visible = defineModel('visible');
const emit = defineEmits(['create']);

const tiposCompetencia = ref([]);
const eventos = ref([]);
const lugares = ref([]);

const schema = toTypedSchema(
  yup.object({
    date_competition: yup.date().required('Fecha requerida'),
    hour_competition: yup.string().required('Hora requerida'),
    type_comp_id: yup
      .object({
        value: yup
          .number()
          .typeError('Debe seleccionar un tipo de competencia válido')
          .required('Tipo de competencia requerido')
      })
      .required('Tipo de competencia requerido'),
    event_id: yup
      .object({
        value: yup
          .number()
          .typeError('Debe seleccionar un evento válido')
          .required('Evento requerido')
      })
        .required('Evento requerido'),
    place_event_id: yup
      .object({
        value: yup
          .number()
          .typeError('Debe seleccionar un lugar de evento válido')
          .required('Lugar del evento requerido')
      })
      .required('Lugar del evento requerido')
  })
);

onMounted(async () => {
  try {
    const [tiposRes, eventosRes, lugaresRes] = await Promise.all([
      send({ endpoint: 'typecompetition', method: 'get' }),
      send({ endpoint: 'event', method: 'get' }),
      send({ endpoint: 'placeevent', method: 'get' })
    ]);

    tiposCompetencia.value = tiposRes.data || [];
    eventos.value = eventosRes.data || [];
    lugares.value = lugaresRes.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos.' });
  }
});

const submit = async (values) => {
  const payload = {
    date_competition: values.date_competition,
    hour_competition: values.hour_competition,
    type_comp_id: values.type_comp_id.value,
    event_id: values.event_id.value,
    place_event_id: values.place_event_id.value
  };

  try {
    await send({ endpoint: 'competition', method: 'post', body: payload });
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Competencia creada correctamente.' });
    emit('create');
    visible.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la competencia.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-4xl font-bold text-gray-800">Crear Competencia</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="grid gap-6">
        <!-- Fecha -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="date_competition" class="text-left">Fecha</label>
          <Field name="date_competition" v-slot="{ field }">
            <Calendar v-bind="field" id="date_competition" showIcon dateFormat="yy-mm-dd" class="w-full" />
          </Field>
          <ErrorMessage name="date_competition" class="text-red-500 text-xs" />
        </div>

        <!-- Hora -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="hour_competition" class="text-left">Hora</label>
          <Field name="hour_competition" v-slot="{ field }">
            <InputText v-bind="field" id="hour_competition" placeholder="HH:MM" class="w-full" />
          </Field>
          <ErrorMessage name="hour_competition" class="text-red-500 text-xs" />
        </div>

        <!-- Tipo de competencia -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="type_comp_id" class="text-left">Tipo de competencia</label>
          <Field name="type_comp_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="tiposCompetencia"
              optionLabel="na_type_comp"
              optionValue="type_comp_id"
              placeholder="Selecciona un tipo"
              class="w-full"
              id="type_comp_id"
            />
          </Field>
          <ErrorMessage name="type_comp_id" class="text-red-500 text-xs" />
        </div>

        <!-- Evento -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="event_id" class="text-left">Evento</label>
          <Field name="event_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="eventos"
              optionLabel="na_event"
              optionValue="event_id"
              placeholder="Selecciona un evento"
              class="w-full"
              id="event_id"
            />
          </Field>
          <ErrorMessage name="event_id" class="text-red-500 text-xs" />
        </div>

        <!-- Lugar del evento -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="place_event_id" class="text-left">Lugar del evento</label>
          <Field name="place_event_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="lugares"
              optionLabel="na_place_event"
              optionValue="place_event_id"
              placeholder="Selecciona un lugar"
              class="w-full"
              id="place_event_id"
            />
          </Field>
          <ErrorMessage name="place_event_id" class="text-red-500 text-xs" />
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
