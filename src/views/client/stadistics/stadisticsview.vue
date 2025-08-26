<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <Toast />

    <!-- Título -->
    <h1 class="text-2xl font-bold text-blue-900 mb-6">📈 Tus estadísticas deportivas</h1>

    <!-- Filtros -->
    <div class="flex flex-col md:flex-row gap-4 mb-8">
      <Dropdown
        v-model="selectedSport"
        :options="sports"
        optionLabel="name"
        optionValue="id"
        placeholder="Filtrar por deporte"
        class="w-full md:w-1/3"
        @change="fetchStats"
      />
      <Dropdown
        v-model="selectedTournament"
        :options="tournaments"
        optionLabel="name"
        optionValue="id"
        placeholder="Filtrar por torneo"
        class="w-full md:w-1/3"
        @change="fetchStats"
      />
      <Button label="Limpiar filtros" icon="pi pi-times" @click="clearFilters" class="bg-gray-300 text-gray-800" />
    </div>

    <!-- Estadísticas generales -->
    <div class="mb-10">
      <h2 class="text-xl font-semibold text-blue-800 mb-4">📦 Totales generales</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="bg-white shadow-md p-4 text-center">
          <h3 class="text-lg font-bold text-blue-700">Partidos jugados</h3>
          <p class="text-3xl text-gray-800">{{ stats.total_games }}</p>
        </Card>
        <Card class="bg-white shadow-md p-4 text-center">
          <h3 class="text-lg font-bold text-green-700">Goles anotados</h3>
          <p class="text-3xl text-gray-800">{{ stats.total_goals }}</p>
        </Card>
        <Card class="bg-white shadow-md p-4 text-center">
          <h3 class="text-lg font-bold text-purple-700">Asistencias</h3>
          <p class="text-3xl text-gray-800">{{ stats.total_assists }}</p>
        </Card>
      </div>
    </div>

    <!-- Estadísticas por deporte -->
    <div v-if="stats.by_sport?.length" class="mb-10">
      <h2 class="text-xl font-semibold text-green-800 mb-4">🏅 Por deporte</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card v-for="s in stats.by_sport" :key="s.sport_id" class="bg-white shadow-sm p-4">
          <h3 class="text-lg font-bold text-green-700">{{ s.sport_name }}</h3>
          <p class="text-gray-600">Partidos: {{ s.games }}</p>
          <p class="text-gray-600">Goles: {{ s.goals }}</p>
          <p class="text-gray-600">Asistencias: {{ s.assists }}</p>
        </Card>
      </div>
    </div>

    <!-- Estadísticas por torneo -->
    <div v-if="stats.by_tournament?.length">
      <h2 class="text-xl font-semibold text-purple-800 mb-4">🎯 Por torneo</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card v-for="t in stats.by_tournament" :key="t.tournament_id" class="bg-white shadow-sm p-4">
          <h3 class="text-lg font-bold text-purple-700">{{ t.tournament_name }}</h3>
          <p class="text-gray-600">Partidos: {{ t.games }}</p>
          <p class="text-gray-600">Goles: {{ t.goals }}</p>
          <p class="text-gray-600">Asistencias: {{ t.assists }}</p>
        </Card>
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

const stats = ref({
  total_games: 0,
  total_goals: 0,
  total_assists: 0,
  by_sport: [],
  by_tournament: []
});

const sports = ref([]);
const tournaments = ref([]);
const selectedSport = ref(null);
const selectedTournament = ref(null);

const fetchStats = async () => {
  const query = [];
  if (selectedSport.value) query.push(`sport_id=${selectedSport.value}`);
  if (selectedTournament.value) query.push(`tournament_id=${selectedTournament.value}`);
  const res = await send({ endpoint: `user/stats?${query.join('&')}`, method: 'get' });
  stats.value = res.data || {};
};

const fetchFilters = async () => {
  const sportRes = await send({ endpoint: 'deport', method: 'get' });
  const tournamentRes = await send({ endpoint: 'competency', method: 'get' });
  sports.value = sportRes.data || [];
  tournaments.value = tournamentRes.data || [];
};

const clearFilters = () => {
  selectedSport.value = null;
  selectedTournament.value = null;
  fetchStats();
};

onMounted(() => {
  fetchFilters();
  fetchStats();
});
</script>
