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

const schema = toTypedSchema(
  yup.object({
    na_line_up: yup.string().required('Nombre requerido'),
    de_line_up: yup.string().required('Descripción requerida'),
    sport_id: yup
      .object({
        value: yup
          .number()
          .typeError('Debe seleccionar un deporte válido')
          .required('Requerido')
      })
      .required('Requerido')
  })
);

onMounted(async () => {
  try {
    const response = await send({ endpoint: 'sport', method: 'get' });
    sports.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar deportes:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los deportes.' });
  }
});

const submit = async (values) => {
  visible.value = false;

  const payload = {
    na_line_up: values.na_line_up,
    de_line_up: values.de_line_up,
    sport_id: values.sport_id.value
  };

  try {
    await send({ endpoint: 'typelineup', method: 'post', body: payload });
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Alineación creada correctamente.' });
    emit('create');
  } catch (error) {
    console.error('Error al crear alineación:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la alineación.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-2xl font-bold text-gray-800">Crear Alineación</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="grid gap-6 space-y-2">

        <!-- Nombre -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="na_line_up" class="text-left">Nombre</label>
          <Field name="na_line_up" v-slot="{ field }">
            <InputText v-bind="field" id="na_line_up" placeholder="Nombre de la alineación" class="w-full" />
          </Field>
          <ErrorMessage name="na_line_up" class="text-red-500 text-xs" />
        </div>

        <!-- Descripción -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="de_line_up" class="text-left">Descripción</label>
          <Field name="de_line_up" v-slot="{ field }">
            <InputText v-bind="field" id="de_line_up" placeholder="Descripción" class="w-full" />
          </Field>
          <ErrorMessage name="de_line_up" class="text-red-500 text-xs" />
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

        <!-- Botones -->
        <div class="flex justify-end w-full max-w-md mx-auto gap-2 mt-4">
          <Button label="Cancelar" @click="visible = false" severity="secondary" />
          <Button label="Guardar" type="submit" />
        </div>
      </div>
    </Form>
  </Dialog>
</template>
