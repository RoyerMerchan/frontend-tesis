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

const teams = ref([]);
const persons = ref([]);

const schema = toTypedSchema(
    yup.object({
        num_team_member: yup.string().required('numero requerido'),
        team_id: yup
            .object({
                value: yup.number().typeError('Selecciona un equipo válido').required('Requerido')
            })
            .required('Requerido'),
        person_id: yup
            .object({
                value: yup.number().typeError('Selecciona una persona válida').required('Requerido')
            })
            .required('Requerido')
    })
);

onMounted(async () => {
  try {
    const teamRes = await send({ endpoint: 'team', method: 'get' });
    teams.value = teamRes.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los equipos.' });
  }

  try {
    const personRes = await send({ endpoint: 'person', method: 'get' });
    persons.value = personRes.data || [];
     persons.value = personRes.data
  .map((p) => ({
    ...p,
    full_name: `${p.na_person} ${p.ln_person}`
  }))
  .sort((a, b) => a.full_name.localeCompare(b.full_name));
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las personas.' });
  }

});

const submit = async (values) => {
  visible.value = false;

  const payload = {
    num_team_member: values.num_team_member,
    team_id: values.team_id.value,
    person_id: values.person_id.value
  };
console.log('Payload:', payload);

  try {
    await send({
      endpoint: 'teammember',
      method: 'post',
      body: payload
    });
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'jugador creado correctamente.' });
    emit('create');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el jugador.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-3xl font-bold text-gray-800">Crear jugador</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema">
      <div class="grid gap-6">

        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="num_team_member" class="text-left">Numero de jugador</label>
          <Field name="num_team_member" v-slot="{ field }">
            <InputText v-bind="field" id="num_team_member" placeholder="" class="w-full" />
          </Field>
          <ErrorMessage name="num_team_member" class="text-red-500 text-xs" />
        </div>


        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="team_id" class="text-left">Equipo</label>
          <Field name="team_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="teams"
              optionLabel="na_team"
              :optionValue="(option) => Number(option.team_id)"
              placeholder="Selecciona un equipo"
              class="w-full"
              id="team_id"
            />
          </Field>
          <ErrorMessage name="team_id" class="text-red-500 text-xs" />
        </div>

        <!--  -->
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="person_id" class="text-left">persona</label>
          <Field name="person_id" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="persons"
              optionLabel="full_name"
              :optionValue="(option) => Number(option.person_id)"
              placeholder="Selecciona una persona"
              class="w-full"
              id="person_id"
            />
          </Field>
          <ErrorMessage name="person_id" class="text-red-500 text-xs" />
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
