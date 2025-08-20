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
    na_type_comp: yup.string().required('Nombre requerido'),
    sport_id: yup
            .object({
                value: yup
                    .number()
                    .typeError('Debe seleccionar un perfil válido')
                    .required('Tipo requerido')
            })
            .required('Tipo requerido'),
  })
);

onMounted(async () => {
  try {
    const response = await send({ endpoint: 'sport', method: 'get' });
    sports.value = response.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los deportes.' });
  }
});

const submit = async (values) => {
  const payload = {
    na_type_comp: values.na_type_comp,
    sport_id: values.sport_id.value
  };

  try {
    await send({ endpoint: 'typecompetition', method: 'post', body: payload });
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
      <h2 class="text-3xl font-bold text-gray-800">Crear Tipo de Competencia</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="grid gap-6">
        <!-- Nombre de competencia -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="na_type_comp" class="text-left">Nombre</label>
          <Field name="na_type_comp" v-slot="{ field }">
            <InputText v-bind="field" id="na_type_comp" placeholder="Ej. Liga Nacional" class="w-full" />
          </Field>
          <ErrorMessage name="na_type_comp" class="text-red-500 text-xs" />
        </div>

        <!-- Deporte -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="sport_id" class="text-left">Deporte</label>
          <Field name="sport_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="sports"
              optionLabel="na_sport"
              optionValue="sport_id"
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
