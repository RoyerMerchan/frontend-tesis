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
const props = defineProps({ evento: Object });
const emit = defineEmits(['update']);

const form = ref({
  id_event: null,
  name_event: ''
});

watch(() => props.evento, (val) => {
  if (val) {
    form.value = {
      id_event: val.event_id,
      name_event: val.na_event
    };
  }
}, { immediate: true });

console.log('Evento:', props.evento);


const schema = toTypedSchema(
  yup.object({
    name_event: yup.string().required('Nombre del evento requerido')
  })
);

const submit = async (values) => {
  const payload = {
    id_event: form.value.id_event,
    name_event: values.name_event
  };

  try {
    await send({
      endpoint: 'event',
      method: 'put',
      body: payload
    });

    toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Evento actualizado correctamente.' });
    visible.value = false;
    emit('update');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el evento.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-4xl font-bold text-gray-800">Editar Evento</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema" :initial-values="form">
      <div class="grid gap-10">
        <!-- Campo: Nombre del evento -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="name_event" class="text-left"></label>
          <Field name="name_event" v-slot="{ field }">
            <InputText v-bind="field" id="name_event" placeholder="Ingrese nuevo nombre" class="w-full" />
          </Field>
          <ErrorMessage name="name_event" class="text-red-500 text-xs" />
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
