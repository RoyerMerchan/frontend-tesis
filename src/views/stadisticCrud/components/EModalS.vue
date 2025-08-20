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
const props = defineProps({ estadistica: Object });
const emit = defineEmits(['update']);

const conceptos = ref([]);
const miembros = ref([]);
const competencias = ref([]);

const form = ref({
  sport_statistic_id: null,
  statistic_concept_id: null,
  team_member_id: null,
  comp_id: null,
  statistic: ''
});

watch(() => props.estadistica, (val) => {
  if (val) {
    form.value = {
      sport_statistic_id: val.sport_statistic_id,
      statistic_concept_id: Number(val.statistic_concept_id),
      team_member_id: Number(val.team_member_id),
      comp_id: Number(val.comp_id),
      statistic: val.statistic
    };
  }
}, { immediate: true });

onMounted(async () => {
  try {
    const [conceptosRes, miembrosRes, competenciasRes] = await Promise.all([
      send({ endpoint: 'specific/meassure', method: 'get' }),
      send({ endpoint: 'teammember', method: 'get' }),
      send({ endpoint: 'competition', method: 'get' })
    ]);

    conceptos.value = (conceptosRes.data || []).map(c => ({
      ...c,
      unit_meassure: `${c.na_sport} - ${c.unit_meassure}`
    }));

    miembros.value = (miembrosRes.data || []).map(m => ({
      ...m,
      na_person: `${m.na_person} ${m.ln_person}`
    }));

    competencias.value = competenciasRes.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos.' });
  }
});

const schema = toTypedSchema(
  yup.object({
    statistic_concept_id: yup
      .object({ value: yup.number().required('Concepto requerido') })
      .required('Concepto requerido'),
    team_member_id: yup
      .object({ value: yup.number().required('Miembro requerido') })
      .required('Miembro requerido'),
    comp_id: yup
      .object({ value: yup.number().required('Competencia requerida') })
      .required('Competencia requerida'),
    statistic: yup
      .number()
      .typeError('Debe ser un número')
      .required('Valor requerido')
  })
);

const submit = async (values) => {
  const payload = {
    sport_statistic_id: form.value.sport_statistic_id,
    statistic_concept_id: values.statistic_concept_id.value,
    team_member_id: values.team_member_id.value,
    comp_id: values.comp_id.value,
    statistic: values.statistic
  };

  try {
    await send({
      endpoint: `sportstatistic`,
      method: 'put',
      body: payload
    });

    toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Estadística actualizada correctamente.' });
    visible.value = false;
    emit('update');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la estadística.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-4xl font-bold text-gray-800">Editar Estadística</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema" :initial-values="{ ...form }">
      <div class="grid gap-10">
        <!-- Concepto -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="statistic_concept_id" class="text-left">Concepto</label>
          <Field name="statistic_concept_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="conceptos"
              optionLabel="unit_meassure"
              :optionValue="opt => Number(opt.statistic_concept_id)"
              placeholder="Selecciona un concepto"
              class="w-full"
              id="statistic_concept_id"
            />
          </Field>
          <ErrorMessage name="statistic_concept_id" class="text-red-500 text-xs" />
        </div>

        <!-- Miembro -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="team_member_id" class="text-left">Miembro del equipo</label>
          <Field name="team_member_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="miembros"
              optionLabel="na_person"
              :optionValue="opt => Number(opt.team_member_id)"
              placeholder="Selecciona un miembro"
              class="w-full"
              id="team_member_id"
            />
          </Field>
          <ErrorMessage name="team_member_id" class="text-red-500 text-xs" />
        </div>

        <!-- Competencia -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="comp_id" class="text-left">Competencia</label>
          <Field name="comp_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="competencias"
              optionLabel="comp_id"
              :optionValue="opt => Number(opt.comp_id)"
              placeholder="Selecciona una competencia"
              class="w-full"
              id="comp_id"
            />
          </Field>
          <ErrorMessage name="comp_id" class="text-red-500 text-xs" />
        </div>

        <!-- Valor -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="statistic" class="text-left">Valor</label>
          <Field name="statistic" v-slot="{ field }">
            <InputText v-bind="field" id="statistic" placeholder="Ingrese valor" class="w-full" />
          </Field>
          <ErrorMessage name="statistic" class="text-red-500 text-xs" />
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
