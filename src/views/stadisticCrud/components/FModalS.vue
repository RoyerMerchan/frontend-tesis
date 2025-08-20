<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '400px' }">
    <template #header>
      <h2 class="text-3xl font-bold text-gray-800">Filtrar por Miembro</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="flex flex-col gap-4">
        <label for="team_member_id" class="text-sm font-semibold">Miembro del equipo</label>
        <Field name="team_member_id" v-slot="{ field }">
          <Dropdown
            v-bind="field"
            :options="miembros"
            optionLabel="na_person"
            :optionValue="(option) => Number(option.team_member_id)"
            placeholder="Selecciona un miembro"
            class="w-full"
            id="team_member_id"
          />
        </Field>
        <ErrorMessage name="team_member_id" class="text-red-500 text-xs" />

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

const miembros = ref([]);

const schema = toTypedSchema(
  yup.object({
    team_member_id: yup
      .object({
        value: yup
          .number()
          .typeError('Debe seleccionar un miembro válido')
          .required('Miembro requerido')
      })
      .required('Miembro requerido')
  })
);

onMounted(async () => {
  try {
    const response = await send({ endpoint: 'teammember', method: 'get' });
    miembros.value = (response.data || []).map(m => ({
      ...m,
      na_person: `${m.na_person} ${m.ln_person}`
    }));
  } catch (error) {
    console.error('Error al cargar miembros:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los miembros.' });
  }
});

const submit = (values) => {
  emit('filtrar', values.team_member_id.value);
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
