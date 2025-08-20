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
import { ref, onMounted, computed, watch } from 'vue';

const toast = useToast();
const visible = defineModel('visible');
const emit = defineEmits(['update']);
const props = defineProps({
  alineacion: Object
});

const sports = ref([]);
const form = ref({
  type_line_up_id: null,
  na_line_up: '',
  de_line_up: '',
  sport_id: null
});

const schema = toTypedSchema(
  yup.object({
    na_line_up: yup.string().required('nombre requerido'),
    de_line_up: yup.string().required('descripción requerida'),
    sport_id: yup
      .object({
        value: yup.number().typeError('Selecciona un equipo válido').required('Requerido')
      })
      .required('Requerido')
  })
);

onMounted(async () => {
  try {
    const sportRes = await send({ endpoint: 'sport', method: 'get' });
    sports.value = sportRes.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los deportes.' });
  }
});

watch(() => props.alineacion, (val) => {
  if (val) {
    form.value = {
      type_line_up_id: val.type_line_up_id,
      de_line_up: val.de_line_up,
      na_line_up: val.na_line_up,
      sport_id: { value: Number(val.sport_id) }
    };
  }
}, { immediate: true });

const submit = async (values) => {
  visible.value = false;

  const payload = {
    type_line_up_id: form.value.type_line_up_id,
    na_line_up: values.na_line_up,
    de_line_up: values.de_line_up,
    sport_id: values.sport_id.value,
  };

  try {
    await send({
      endpoint: `typelineup`,
      method: 'put',
      body: payload
    });
    toast.add({ severity: 'success', summary: 'Actualizado', detail: 'tipo alineacion actualizado correctamente.' });
    emit('update');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el tipo alineacion.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-3xl font-bold text-gray-800">Editar tipo alineacion</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema" :initial-values="form">
      <div class="grid gap-6">
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="na_line_up" class="text-left">Nombre de tipo</label>
          <Field name="na_line_up" v-slot="{ field }">
            <InputText v-bind="field" id="na_line_up" class="w-full" />
          </Field>
          <ErrorMessage name="na_line_up" class="text-red-500 text-xs" />
        </div>

        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="de_line_up" class="text-left">Descripción</label>
          <Field name="de_line_up" v-slot="{ field }">
            <InputText v-bind="field" id="de_line_up" class="w-full" />
          </Field>
          <ErrorMessage name="de_line_up" class="text-red-500 text-xs" />
        </div>

        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="sport_id" class="text-left">Equipo</label>
          <Field name="sport_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="sports"
              optionLabel="na_sport"
              :optionValue="option => Number(option.sport_id)"
              placeholder="Selecciona un deporte"
              class="w-full"
              id="sport_id"
            />
          </Field>
          <ErrorMessage name="sport_id" class="text-red-500 text-xs" />
        </div>


        <div class="flex justify-end w-full max-w-md mx-auto gap-2 mt-4">
          <Button label="Cancelar" @click="visible = false" severity="secondary" />
          <Button label="Actualizar" type="submit" />
        </div>
      </div>
    </Form>
  </Dialog>
</template>
