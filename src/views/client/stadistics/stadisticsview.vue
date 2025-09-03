<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <Toast />

    <!-- Título -->
    <h1 class="text-2xl font-bold text-green-900 mb-6">📈 Tus estadísticas deportivas</h1>

    <!-- Filtros -->
    <div class="flex flex-col md:flex-row gap-4 mb-8">
      <Dropdown
        v-model="selectedSport"
        :options="sports"
        optionLabel="na_sport"
        optionValue="sport_id"
        placeholder="Filtrar por deporte"
        class="w-full md:w-1/3"
        @change="fetchStatsBySport"
      />
      <Dropdown
        v-model="selectedTournament"
        :options="tournaments"
        optionLabel="na_event"
        optionValue="event_id"
        placeholder="Filtrar por torneo"
        class="w-full md:w-1/3"
        @change="fetchStatsByTournament"
      />
      <Button label="Limpiar filtros" icon="pi pi-times" @click="clearFilters" class="bg-gray-300 text-gray-800" />
    </div>


   <!-- Estadísticas dinámicas -->
<div class="mb-10">
  <h2 class="text-xl font-semibold text-teal-800 mb-4">📦 Totales generales</h2>
  <div class="flex flex-col gap-3">
  <div v-for="c in stats" :key="c.statistic_concept_id"
    class="bg-white shadow-md p-3 text-center rounded-lg">
    <h3 class="text-sm font-semibold text-green-700">{{ c.unit_meassure }}</h3>
    <p class="text-xl text-gray-800">{{ c.total }}</p>
  </div>
</div>
  </div>
</div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import Toast from 'primevue/toast';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { send } from '@/api/send';

const stats = ref([]);



const sports = ref([]);
const tournaments = ref([]);
const selectedSport = ref(null);
const selectedTournament = ref(null);

const fetchStats = async () => {
  const query = [];
  if (selectedSport.value) query.push(`sport_id=${selectedSport.value}`);
  if (selectedTournament.value) query.push(`event_id=${selectedTournament.value}`);

  const res = await send({ endpoint: `sportstatistic/all?${query.join('&')}`, method: 'get' });


  stats.value = res.data || [];
};


// 🔹 Traer TODOS sin filtros
const fetchAllStats = async () => {
  const res = await send({ endpoint: "sportstatistic/all", method: "get" });
  stats.value = res.data || [];
};

// 🔹 Traer solo por deporte
const fetchStatsBySport = async (sportId) => {
  const res = await send({
    endpoint: `sportstatistic/all?sport_id=${sportId.value}`,
    method: "get"
  });
  stats.value = res.data || [];
};

// 🔹 Traer solo por torneo
const fetchStatsByTournament = async (tournamentId) => {
  const res = await send({
    endpoint: `sportstatistic/all?event_id=${tournamentId.value}`,
    method: "get"
  });
  stats.value = res.data || [];
};

const fetchFilters = async () => {
  const sportRes = await send({ endpoint: 'sport', method: 'get' });
  const tournamentRes = await send({ endpoint: 'event', method: 'get' });
  sports.value = sportRes.data || [];
  tournaments.value = tournamentRes.data || [];
};

const clearFilters = () => {
  selectedSport.value = null;
  selectedTournament.value = null;
  fetchAllStats()
};

onMounted(() => {
  fetchFilters();
  fetchAllStats()
});
</script>
