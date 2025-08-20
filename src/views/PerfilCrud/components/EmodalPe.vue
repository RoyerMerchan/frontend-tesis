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
const props = defineProps({ perfil: Object });
const emit = defineEmits(['update']);

const form = ref({
  profile_id: null,
  profile_de: ''
});

watch(() => props.perfil, (val) => {
  if (val) {
    form.value = {
      profile_id: val.profile_id,
      profile_de: val.profile_de
    };
  }
}, { immediate: true });

const schema = toTypedSchema(
  yup.object({
    profile_de: yup.string().required('Descripción requerida')
  })
);

const submit = async (values) => {
  const payload = {
    id_profile: form.value.profile_id,
    profile_de: values.profile_de
  };

  try {
    await send({
      endpoint: 'profile',
      method: 'put',
      body: payload
    });

    toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Perfil actualizado correctamente.' });
    visible.value = false;
    emit('update');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el perfil.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-4xl font-bold text-gray-800">Editar Perfil</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema" :initial-values="{ ...form }">
      <div class="grid gap-10">
        <!-- Campo: Descripción del perfil -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="profile_de" class="text-left">Descripción</label>
          <Field name="profile_de" v-slot="{ field }">
            <InputText v-bind="field" id="profile_de" placeholder="Ej. Administrador" class="w-full" />
          </Field>
          <ErrorMessage name="profile_de" class="text-red-500 text-xs" />
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
