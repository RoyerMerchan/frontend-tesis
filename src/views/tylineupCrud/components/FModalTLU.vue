<template>
  <Dialog v-model:visible="visible"  :modal="true" :closable="true" :style="{ width: '400px' }">
     <template #header>
        <h2 class="text-3xl font-bold text-gray-800">filtrar tipo alineacion</h2>
      </template>
    <Form @submit="submit" :validation-schema="schema">
      <div class="flex flex-col gap-4 ">
        <label for="sport_id" class="text-sm font-semibold"></label>
        <Field name="sport_id" v-slot="{ field }">
          <Dropdown
            v-bind="field"
            :options="deportes"
            optionLabel="na_sport"
            :optionValue="(option) => Number(option.sport_id)"
            placeholder="Selecciona deporte"
            class="w-full"
            id="sport_id"
          />
        </Field>
        <ErrorMessage name="sport_id" class="text-red-500 text-xs" />

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
const emit = defineEmits(['filtrar', 'cerrar']);

const deportes = ref([]);

const schema = toTypedSchema(
  yup.object({
    sport_id: yup
      .object({
        value: yup
          .number()
          .typeError('Debe seleccionar un deporte válido')
          .required('deporte requerido')
      })
      .required('deporte requerido')
  })
);

onMounted(async () => {
  try {
    const response = await send({ endpoint: 'sport', method: 'get' });
    deportes.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar deportes:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los perfiles.' });
  }
});

const submit = (values) => {
  emit('filtrar', values.sport_id.value);
  visible.value = false;
};

const limpiar = () => {
  emit('limpiar', null);
  visible.value = false;
};

const cerrar = () => {
  emit('cerrar');
  visible.value = false;
};
</script>
