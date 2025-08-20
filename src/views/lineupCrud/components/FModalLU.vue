<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '400px' }">
    <template #header>
      <h2 class="text-3xl font-bold text-gray-800">Filtrar por Tipo de Alineación</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="flex flex-col gap-4">
        <label for="type_line_up_id" class="text-sm font-semibold">Tipo de alineación</label>
        <Field name="type_line_up_id" v-slot="{ field }">
          <Dropdown
            v-bind="field"
            :options="tipos"
            optionLabel="na_line_up"
            :optionValue="(option) => Number(option.type_line_up_id)"
            placeholder="Selecciona un tipo"
            class="w-full"
            id="type_line_up_id"
          />
        </Field>
        <ErrorMessage name="type_line_up_id" class="text-red-500 text-xs" />

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

const tipos = ref([]);

const schema = toTypedSchema(
  yup.object({
    type_line_up_id: yup
      .object({
        value: yup
          .number()
          .typeError('Debe seleccionar un tipo válido')
          .required('Tipo requerido')
      })
      .required('Tipo requerido')
  })
);

onMounted(async () => {
  try {
    const response = await send({ endpoint: 'typelineup', method: 'get' });
    tipos.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar tipos:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de alineación.' });
  }
});

const submit = (values) => {
  emit('filtrar', values.type_line_up_id.value);
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
