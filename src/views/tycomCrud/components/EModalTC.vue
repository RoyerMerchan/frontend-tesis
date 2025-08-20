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
  competencia: Object
});

const sports = ref([]);
const form = ref({
  type_comp_id: null,
  na_type_comp: '',
  sport_id: null
});

const schema = toTypedSchema(
  yup.object({
    na_type_comp: yup.string().required('nombre requerido'),
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

watch(() => props.competencia, (val) => {
  if (val) {
    form.value = {
      type_comp_id: val.type_comp_id,
      na_type_comp: val.na_type_comp,
      sport_id: { value: Number(val.sport_id) }
    };
  }
}, { immediate: true });

const submit = async (values) => {
  visible.value = false;

  const payload = {
    type_comp_id: form.value.type_comp_id,
    na_type_comp: values.na_type_comp,
    sport_id: values.sport_id.value,
  };

  try {
    await send({
      endpoint: `typecompetition`,
      method: 'put',
      body: payload
    });
    toast.add({ severity: 'success', summary: 'Actualizado', detail: 'tipo competencia actualizado correctamente.' });
    emit('update');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el tipo competicion.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-3xl font-bold text-gray-800">Editar tipo competencia</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema" :initial-values="form">
      <div class="grid gap-6">
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="na_type_comp" class="text-left">Nombre de tipo</label>
          <Field name="na_type_comp" v-slot="{ field }">
            <InputText v-bind="field" id="na_type_comp" class="w-full" />
          </Field>
          <ErrorMessage name="na_type_comp" class="text-red-500 text-xs" />
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
