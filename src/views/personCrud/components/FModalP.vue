<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '400px' }">
    <template #header>
      <h2 class="text-3xl font-bold text-gray-800">Filtrar por Tipo de Persona</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="flex flex-col gap-4">
        <label for="id_type_person" class="text-sm font-semibold">Tipo de Persona</label>
        <Field name="id_type_person" v-slot="{ field }">
          <Dropdown
            v-bind="field"
            :options="typePersons"
            optionLabel="de_type_person"
            :optionValue="option => Number(option.type_person_id)"
            placeholder="Selecciona tipo"
            class="w-full"
            id="id_type_person"
          />
        </Field>
        <ErrorMessage name="id_type_person" class="text-red-500 text-xs" />

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

const typePersons = ref([]);

const schema = toTypedSchema(
  yup.object({
    id_type_person: yup
      .object({
        value: yup
          .number()
          .typeError('Debe seleccionar un perfil válido')
          .required('Perfil requerido')
      })
      .required('Perfil requerido')
  })
);

onMounted(async () => {
  try {
    const response = await send({ endpoint: 'typeperson', method: 'get' });
    typePersons.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar tipos de persona:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de persona.' });
  }
});

const submit = (values) => {
  emit('filtrar', values.id_type_person.value);
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
