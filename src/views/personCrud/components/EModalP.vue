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
import { ref, watch, onMounted } from 'vue';

const toast = useToast();
const visible = defineModel('visible');
const props = defineProps({ persona: Object });
const emit = defineEmits(['update']);

const typePersons = ref([]);

const form = ref({
  person_id: null,
  na_person: '',
  ln_person: '',
  id_type_person: null
});

watch(() => props.persona, (val) => {
  if (val) {
    form.value = {
      person_id: val.person_id,
      na_person: val.na_person,
      ln_person: val.ln_person,
    id_type_person: Number(val.id_type_person)    };
  }
}, { immediate: true });

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

const schema = toTypedSchema(
  yup.object({
    id_type_person: yup
      .object({
        value: yup
          .number()
          .typeError('Debe seleccionar un tipo persona válido')
          .required('tipo persona requerido')
      })
      .required('tipo persona requerido')
  })
);

const submit = async (values) => {
  const payload = {
    id_person: form.value.person_id,
    na_person: values.na_person,
    ln_person: values.ln_person,
    id_type_person: values.id_type_person.value
  };

  try {
    await send({
      endpoint: 'person',
      method: 'put',
      body: payload
    });

    toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Persona actualizada correctamente.' });
    visible.value = false;
    emit('update');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la persona.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-4xl font-bold text-gray-800">Editar Persona</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema" :initial-values="{ ...form }">
      <div class="grid gap-10">
        <!-- Nombre -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="na_person" class="text-left">Nombre</label>
          <Field name="na_person" v-slot="{ field }">
            <InputText v-bind="field" id="na_person" placeholder="Ingrese nuevo nombre" class="w-full" />
          </Field>
          <ErrorMessage name="na_person" class="text-red-500 text-xs" />
        </div>

        <!-- Apellido -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="ln_person" class="text-left">Apellido</label>
          <Field name="ln_person" v-slot="{ field }">
            <InputText v-bind="field" id="ln_person" placeholder="Ingrese nuevo apellido" class="w-full" />
          </Field>
          <ErrorMessage name="ln_person" class="text-red-500 text-xs" />
        </div>

        <!-- Tipo de persona -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="id_type_person" class="text-left">Tipo de persona</label>
          <Field name="id_type_person" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="typePersons"
              optionLabel="de_type_person"
                :optionValue="option => Number(option.type_person_id)"              placeholder="Selecciona uno"
              class="w-full"
              id="id_type_person"
            />
          </Field>
          <ErrorMessage name="id_type_person" class="text-red-500 text-xs" />
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
