<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { send } from '@/api/send';
import { useToast } from 'primevue/usetoast';
import { ref, watch } from 'vue';

const toast = useToast();
const visible = defineModel('visible');
const props = defineProps({ posicion: Object });
const emit = defineEmits(['update']);

const form = ref({
  position_id: null,
  na_position: ''
});

watch(
  () => props.posicion,
  (val) => {
    if (val) {
      form.value = {
        position_id: val.position_id,
        na_position: val.na_position
      };
    }
  },
  { immediate: true }
);

const schema = toTypedSchema(
  yup.object({
    na_position: yup.string().required('Requerido')
  })
);

const submit = async (values) => {
  const payload = {
    id_position: form.value.position_id,
    name_position: values.na_position
  };

  try {
    await send({
      endpoint: 'position',
      method: 'put',
      body: payload
    });

    toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Posición actualizada correctamente.' });
    visible.value = false;
    emit('update');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la posición.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-4xl font-bold text-gray-800">Editar Posición</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema" :initial-values="form">
      <div class="grid gap-10">
        <!-- Campo: Nombre de la posición -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="na_position" class="text-left">Nombre de la Posición</label>
          <Field name="na_position" v-slot="{ field }">
            <InputText v-bind="field" id="na_position" placeholder="Ingrese nuevo nombre" class="w-full" />
          </Field>
          <ErrorMessage name="na_position" class="text-red-500 text-xs" />
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
