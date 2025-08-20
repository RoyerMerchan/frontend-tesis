<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { send } from '@/api/send';
import { useToast } from 'primevue/usetoast';
import { ref, onMounted } from 'vue';

const toast = useToast();
const visible = defineModel('visible');
const emit = defineEmits(['create']);

const sports = ref([]);
const institutions = ref([]);

const schema = toTypedSchema(
  yup.object({
    na_team: yup.string().required('Nombre requerido'),
    sport_id: yup
      .object({
        value: yup.number().typeError('Selecciona un deporte válido').required('Requerido')
      })
      .required('Requerido'),
    institution_id: yup
      .object({
        value: yup.number().typeError('Selecciona una institución válida').required('Requerido')
      })
      .required('Requerido')
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

const submit = async (values) => {
  visible.value = false;

  const payload = {
    na_team: values.na_team,
    sport_id: values.sport_id.value,
    institution_id: values.institution_id.value
  };
console.log('Payload:', payload);

  try {
    await send({
      endpoint: 'team',
      method: 'post',
      body: payload
    });
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Equipo creado correctamente.' });
    emit('create');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el equipo.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-3xl font-bold text-gray-800">Crear Equipo</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="grid gap-6">
        <!-- Nombre del equipo -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="na_team" class="text-left">Nombre del equipo</label>
          <Field name="na_team" v-slot="{ field }">
            <InputText v-bind="field" id="na_team" placeholder="" class="w-full" />
          </Field>
          <ErrorMessage name="na_team" class="text-red-500 text-xs" />
        </div>

        <!-- Deporte -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="sport_id" class="text-left">Deporte</label>
          <Field name="sport_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="sports"
              optionLabel="na_sport"
              :optionValue="(option) => Number(option.sport_id)"
              placeholder="Selecciona un deporte"
              class="w-full"
              id="sport_id"
            />
          </Field>
          <ErrorMessage name="sport_id" class="text-red-500 text-xs" />
        </div>

        <!-- Institución -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="institution_id" class="text-left">Institución</label>
          <Field name="institution_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="institutions"
              optionLabel="na_institucion"
              :optionValue="(option) => Number(option.institucion_id)"
              placeholder="Selecciona una institución"
              class="w-full"
              id="institution_id"
            />
          </Field>
          <ErrorMessage name="institution_id" class="text-red-500 text-xs" />
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
