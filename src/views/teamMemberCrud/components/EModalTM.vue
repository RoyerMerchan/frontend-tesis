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
  jugador: Object
});

const teams = ref([]);
const form = ref({
  team_member_id: null,
  num_team_member: '',
  team_id: null
});

const schema = toTypedSchema(
  yup.object({
    num_team_member: yup.string().required('numero requerido'),
    team_id: yup
      .object({
        value: yup.number().typeError('Selecciona un equipo válido').required('Requerido')
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
});

watch(() => props.jugador, (val) => {
  if (val) {
    form.value = {
      team_member_id: val.team_member_id,
      num_team_member: val.num_team_member,
      team_id: { value: Number(val.team_id) }
    };
  }
}, { immediate: true });

const submit = async (values) => {
  visible.value = false;

  const payload = {
    team_member_id: form.value.team_member_id,
    num_team_member: values.num_team_member,
    team_id: values.team_id.value,
  };

  try {
    await send({
      endpoint: `teammember`,
      method: 'put',
      body: payload
    });
    toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Jugador actualizado correctamente.' });
    emit('update');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el jugador.' });
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :style="{ width: '500px' }">
    <template #header>
      <h2 class="text-3xl font-bold text-gray-800">Editar jugador</h2>
    </template>

    <Form @submit="submit" :validation-schema="schema" :initial-values="form">
      <div class="grid gap-6">
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="num_team_member" class="text-left">Numero de jugador</label>
          <Field name="num_team_member" v-slot="{ field }">
            <InputText v-bind="field" id="num_team_member" class="w-full" />
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
              :optionValue="option => Number(option.team_id)"
              placeholder="Selecciona un equipo"
              class="w-full"
              id="team_id"
            />
          </Field>
          <ErrorMessage name="team_id" class="text-red-500 text-xs" />
        </div>


        <div class="flex justify-end w-full max-w-md mx-auto gap-2 mt-4">
          <Button label="Cancelar" @click="visible = false" severity="secondary" />
          <Button label="Actualizar" type="submit" />
        </div>
      </div>
    </Form>
  </Dialog>
</template>
