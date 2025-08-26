<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <Toast />

    <!-- Título y acciones -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-blue-900">Gestión de Torneos</h1>
      <Button label="Crear torneo" icon="pi pi-plus" @click="showCreate = true" class="bg-green-500 text-white" />
    </div>

    <!-- Filtro por deporte -->
    <div class="mb-6 flex flex-col md:flex-row items-center gap-4">
      <Dropdown
        v-model="selectedSport"
        :options="sports"
        optionLabel="name"
        optionValue="id"
        placeholder="Filtrar por deporte"
        class="w-full md:w-1/3"
        @change="filterTournaments"
      />
      <Button label="Limpiar filtro" icon="pi pi-times" @click="clearFilter" class="bg-gray-300 text-gray-800" />
    </div>

    <!-- Torneos activos -->
    <div v-if="activeTournaments.length" class="mb-10">
      <h2 class="text-xl font-semibold text-green-700 mb-4">🏆 Torneos en curso</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="t in activeTournaments" :key="t.id" class="bg-white shadow-md p-4">
          <h3 class="text-lg font-bold text-green-800">{{ t.name }}</h3>
          <p class="text-gray-600">Deporte: {{ t.sport_name }}</p>
          <p class="text-gray-500 text-sm">Fecha inicio: {{ t.start_date }}</p>
        </Card>
      </div>
    </div>

    <!-- Todos los torneos -->
    <div>
      <h2 class="text-xl font-semibold text-blue-800 mb-4">📋 Todos los torneos</h2>
      <div v-if="filteredTournaments.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="t in filteredTournaments" :key="t.id" class="bg-white shadow-sm p-4">
          <h3 class="text-lg font-bold text-blue-700">{{ t.name }}</h3>
          <p class="text-gray-600">Deporte: {{ t.sport_name }}</p>
          <p class="text-gray-500 text-sm">Estado: {{ t.status }}</p>
        </Card>
      </div>
      <div v-else class="text-gray-500 italic">No hay torneos disponibles.</div>
    </div>

    <!-- Modal crear torneo -->
    <Dialog v-model:visible="showCreate" header="Crear torneo" :modal="true" :closable="false" class="w-full md:w-1/2">
      <Form @submit="createTournament" :validation-schema="schema" class="flex flex-col gap-4">
        <Field name="name" v-slot="{ field }">
          <InputText v-bind="field" placeholder="Nombre del torneo" class="w-full" />
        </Field>
        <Field name="sport_id" v-slot="{ field }">
          <Dropdown
            v-bind="field"
            :options="sports"
            optionLabel="name"
            optionValue="id"
            placeholder="Selecciona deporte"
            class="w-full"
          />
        </Field>
        <Field name="start_date" v-slot="{ field }">
          <Calendar v-bind="field" placeholder="Fecha de inicio" class="w-full" />
        </Field>
        <div class="flex justify-end gap-2 mt-4">
          <Button label="Cancelar" @click="showCreate = false" class="bg-gray-300 text-gray-800" />
          <Button label="Crear" type="submit" class="bg-green-500 text-white" />
        </div>
      </Form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import { send } from '@/api/send';

const tournaments = ref([]);
const sports = ref([]);
const selectedSport = ref(null);
const showCreate = ref(false);

const schema = yup.object({
  name: yup.string().required('Nombre requerido'),
  sport_id: yup.number().required('Deporte requerido'),
  start_date: yup.date().required('Fecha requerida')
});

const fetchTournaments = async () => {
  const res = await send({ endpoint: 'competency', method: 'get' });
  tournaments.value = res.data || [];
};

const fetchSports = async () => {
  const res = await send({ endpoint: 'deport', method: 'get' });
  sports.value = res.data || [];
};

onMounted(() => {
  fetchTournaments();
  fetchSports();
});

const filteredTournaments = computed(() => {
  if (!selectedSport.value) return tournaments.value;
  return tournaments.value.filter(t => t.sport_id === selectedSport.value);
});

const activeTournaments = computed(() =>
  tournaments.value.filter(t => t.status === 'activo')
);

const filterTournaments = () => {
  // ya se filtran automáticamente con computed
};

const clearFilter = () => {
  selectedSport.value = null;
};

const createTournament = async (values) => {
  await send({ endpoint: 'competency', method: 'post', body: values });
  showCreate.value = false;
  fetchTournaments();
};
</script>
