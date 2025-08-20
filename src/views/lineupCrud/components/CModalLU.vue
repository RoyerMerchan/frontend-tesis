<script setup>
import { ref, onMounted } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { send } from '@/api/send';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const visible = defineModel('visible');
const emit = defineEmits(['create']);

const positions = ref([]);
const types = ref([]);
const members = ref([]);
const teamComps = ref([]);

const schema = toTypedSchema(
  yup.object({
    de_line_up: yup.string().required('Descripción requerida'),
    position_id: yup
        .object({
            value: yup
            .number()
            .typeError('Debe seleccionar una posición válida')
            .required('Posición requerida')
        })
        .required('Posición requerida'),
    type_line_up_id: yup
        .object({
            value: yup
            .number()
            .typeError('Debe seleccionar un tipo de alineación válido')
            .required('Tipo de alineación requerido')
        })
        .required('Tipo de alineación requerido'),
    team_member_id: yup
        .object({
            value: yup
            .number()
            .typeError('Debe seleccionar un miembro del equipo válido')
            .required('Miembro del equipo requerido')
        })
        .required('Miembro del equipo requerido'),
    team_comp_id: yup
        .object({
            value: yup
            .number()
            .typeError('Debe seleccionar una competencia válida')
            .required('Competencia requerida')
        })
        .required('Competencia requerida')
  })
);

onMounted(async () => {
  try {
    const [posRes, typeRes, memberRes, compRes] = await Promise.all([
      send({ endpoint: 'position', method: 'get' }),
      send({ endpoint: 'typelineup', method: 'get' }),
      send({ endpoint: 'teammember', method: 'get' }),
      send({ endpoint: 'specific/teamcomp', method: 'get' })
    ]);

    positions.value = posRes.data || [];
    types.value = typeRes.data || [];
    members.value = (memberRes.data || []).map(m => ({
      ...m,
      na_person: `${m.na_person} ${m.ln_person}`
    }));
    teamComps.value = compRes.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos.' });
  }
});

const submit = async (values) => {
  const payload = {
    de_line_up: values.de_line_up,
    position_id: values.position_id.value,
    type_line_up_id: values.type_line_up_id.value,
    team_member_id: values.team_member_id.value,
    team_comp_id: values.team_comp_id.value
  };

  try {
    await send({ endpoint: 'lineup', method: 'post', body: payload });
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Alineación creada correctamente.' });
    emit('create');
    visible.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la alineación.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" header="Crear Alineación" :modal="true" :closable="true" :style="{ width: '600px' }">
    <Form @submit="submit" :validation-schema="schema">
      <div class="grid gap-6">
        <!-- Descripción -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="de_line_up" class="text-left">Descripción</label>
          <Field name="de_line_up" v-slot="{ field }">
            <InputText v-bind="field" id="de_line_up" placeholder="Ingrese descripción" class="w-full" />
          </Field>
          <ErrorMessage name="de_line_up" class="text-red-500 text-xs" />
        </div>

        <!-- Posición -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="position_id" class="text-left">Posición</label>
          <Field name="position_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="positions"
              optionLabel="na_position"
              optionValue="position_id"
              placeholder="Selecciona una posición"
              class="w-full"
              id="position_id"
            />
          </Field>
          <ErrorMessage name="position_id" class="text-red-500 text-xs" />
        </div>

        <!-- Tipo de alineación -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="type_line_up_id" class="text-left">Tipo de alineación</label>
          <Field name="type_line_up_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="types"
              optionLabel="na_line_up"
              optionValue="type_line_up_id"
              placeholder="Selecciona un tipo"
              class="w-full"
              id="type_line_up_id"
            />
          </Field>
          <ErrorMessage name="type_line_up_id" class="text-red-500 text-xs" />
        </div>

        <!-- Miembro del equipo -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="team_member_id" class="text-left">Jugador</label>
          <Field name="team_member_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="members"
              optionLabel="na_person"
               optionValue="team_member_id"
              placeholder="Selecciona un jugador"
              class="w-full"
              id="team_member_id"
            />
          </Field>
          <ErrorMessage name="team_member_id" class="text-red-500 text-xs" />
        </div>

        <!-- Competencia del equipo -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="team_comp_id" class="text-left">Competencia</label>
          <Field name="team_comp_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="teamComps"
              optionLabel="team_comp_id"
               optionValue="team_comp_id"
              placeholder="Selecciona una competencia"
              class="w-full"
              id="team_comp_id"
            />
          </Field>
          <ErrorMessage name="team_comp_id" class="text-red-500 text-xs" />
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
