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

const typePersons = ref([]);

const schema = toTypedSchema(
  yup.object({
    na_person: yup.string().required('Nombre requerido'),
    ln_person: yup.string().required('Apellido requerido'),
    type_person_id: yup
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
    const response = await send({
      endpoint: 'typeperson',
      method: 'get'
    });
    typePersons.value = response.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de persona.' });
  }
});

const submit = async (values) => {
  visible.value = false;

  const payload = {
    na_person: values.na_person,
    ln_person: values.ln_person,
    id_type_person: values.type_person_id.value
  };

  try {
    await send({
      endpoint: 'person',
      method: 'post',
      body: payload
    });
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Persona creada correctamente.' });
    emit('create');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la persona.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-2xl font-bold text-gray-800">Crear Persona</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="grid gap-6">
        <!-- Nombre -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="na_person">Nombre</label>
          <Field name="na_person" v-slot="{ field }">
            <InputText v-bind="field" id="na_person" placeholder="Ingrese nombre" class="w-full" />
          </Field>
          <ErrorMessage name="na_person" class="text-red-500 text-xs" />
        </div>

        <!-- Apellido -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="ln_person">Apellido</label>
          <Field name="ln_person" v-slot="{ field }">
            <InputText v-bind="field" id="ln_person" placeholder="Ingrese apellido" class="w-full" />
          </Field>
          <ErrorMessage name="ln_person" class="text-red-500 text-xs" />
        </div>

        <!-- Tipo de persona -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="type_person_id">Tipo de persona</label>
          <Field name="type_person_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="typePersons"
              optionLabel="de_type_person"
              :optionValue="(option) => Number(option.type_person_id)"
              placeholder="Selecciona uno"
              class="w-full"
              id="type_person_id"
            />
          </Field>
          <ErrorMessage name="type_person_id" class="text-red-500 text-xs" />
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
