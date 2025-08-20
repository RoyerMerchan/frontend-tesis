<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '400px' }">
    <template #header>
      <h2 class="text-3xl font-bold text-gray-800">Filtrar Equipos</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="flex flex-col gap-4">
        <!-- Deporte -->
        <label for="sport_id" class="text-sm font-semibold">Deporte</label>
        <Field name="sport_id" v-slot="{ field }">
          <Dropdown
            v-bind="field"
            :options="sports"
            optionLabel="na_sport"
            :optionValue="option => Number(option.sport_id)"
            placeholder="Selecciona un deporte"
            class="w-full"
            id="sport_id"
          />
        </Field>
        <ErrorMessage name="sport_id" class="text-red-500 text-xs" />

        <!-- Institución -->
        <label for="institution_id" class="text-left">Institución</label>
          <Field name="institution_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="institutions"
              optionLabel="na_institucion"
              :optionValue="option => Number(option.institucion_id)"
              placeholder="Selecciona una institución"
              class="w-full"
              id="institution_id"
            />
          </Field>
          <ErrorMessage name="institution_id" class="text-red-500 text-xs" />
        <!-- Botones -->
        <div class="flex justify-end gap-2 mt-4">
          <Button label="Cancelar" severity="secondary" @click="cerrar" />
          <Button label="Filtrar" icon="pi pi-search" severity="primary" type="submit" />
          <Button label="Limpiar filtro" icon="pi pi-times" severity="danger" @click="limpiar" />
        </div>
      </div>
    </Form>
  </Dialog>
</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { send } from '@/api/send';
import { useToast } from 'primevue/usetoast';
import { ref, onMounted } from 'vue';

const toast = useToast();
const visible = defineModel('visible');
const emit = defineEmits(['filtrar', 'limpiar', 'cerrar']);

const sports = ref([]);
const institutions = ref([]);

const schema = toTypedSchema(
  yup.object({
    sport_id: yup
      .object({
        value: yup
          .number()
          .typeError('Debe seleccionar un deporte válido')
          .nullable()
      })
      .nullable(),
    institution_id: yup
      .object({
        value: yup
          .number()
          .typeError('Debe seleccionar una institución válida')
          .nullable()
      })
      .nullable()
  }).test('at-least-one', 'Selecciona al menos un filtro', (values) => {
    return values.sport_id || values.institution_id;
  })
);

onMounted(async () => {
  try {
    const sportRes = await send({ endpoint: 'sport', method: 'get' });
    sports.value = sportRes.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los deportes.' });
  }

  try {
    const instRes = await send({ endpoint: 'institution', method: 'get' });
    institutions.value = instRes.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las instituciones.' });
  }
});

const submit = (values) => {
  emit('filtrar', {
    sport_id: values.sport_id || null,
    institution_id: values.institution_id || null
  });
  visible.value = false;
};

const limpiar = () => {
  emit('limpiar');
  visible.value = false;
};

const cerrar = () => {
  emit('cerrar');
  visible.value = false;
};
</script>
