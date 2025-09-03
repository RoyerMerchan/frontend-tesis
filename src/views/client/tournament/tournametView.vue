<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <Toast />

    <!-- Título y acciones -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-teal-900">Gestión de Torneos</h1>
      <Button label="Crear torneo" icon="pi pi-plus" @click="showCreate = true" class="bg-green-500 text-white" />
    </div>

    <!-- Filtro por deporte -->
    <div class="mb-6 flex flex-col md:flex-row items-center gap-4">
      <Dropdown
        v-model="selectedSport"
        :options="sports"
        optionLabel="na_sport"
        optionValue="id_sport"
        placeholder="Filtrar por deporte"
        class="w-full md:w-1/3"
        @change="filterTournaments"
      />
      <Button label="Limpiar filtro" icon="pi pi-times" @click="clearFilter" class="bg-gray-300 text-gray-800" />
    </div>

   <Dialog v-model:visible="showCreate" header="Crear nuevo torneo" :modal="true" class="w-full md:w-2/3 lg:w-1/2">
  <form @submit.prevent="createTournament" class="flex flex-col gap-4">
    <div class="flex flex-col">
      <label for="na_event" class="font-medium text-gray-700 mb-1">Nombre del torneo *</label>
      <InputText
        id="na_event"
        v-model="newTournament.name_event"
        required
        placeholder="Ej: Copa América 2023"
      />
    </div>

    <div class="flex justify-end mt-4">
      <Button label="Cancelar" icon="pi pi-times" class="bg-gray-300 text-gray-800 mr-2" @click="showCreate = false" />
      <Button label="Crear" icon="pi pi-check" type="submit" class="bg-green-500 text-white" />
    </div>
  </form>
</Dialog>


    <!-- Torneos activos -->
    <div v-if="activeTournaments.length" class="mb-10">
      <h2 class="text-xl font-semibold text-green-700 mb-4">🏆 Torneos en curso</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="t in activeTournaments" :key="t.id" class="bg-white shadow-md p-4 cursor-pointer" @click="openTournament(t)">
          <h3 class="text-lg font-bold text-green-800">{{ t.name }}</h3>
          <p class="text-gray-600">Deporte: {{ t.sport_name }}</p>
          <p class="text-gray-500 text-sm">Fecha inicio: {{ t.start_date }}</p>
        </Card>
      </div>
    </div>

    <!-- Todos los torneos -->
    <div>
      <h2 class="text-xl font-semibold text-green-800 mb-4">📋 Todos los torneos</h2>
      <div v-if="filteredTournaments.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="t in filteredTournaments" :key="t.id" class="bg-white shadow-sm p-4 cursor-pointer" @click="openTournament(t)">
          <h3 class="text-lg font-bold text-green-700">{{ t.na_event }}</h3>
        </div>
      </div>
      <div v-else class="text-gray-500 italic">No hay torneos disponibles.</div>
    </div>

    <!-- Modal detalles del torneo -->
    <Dialog v-model:visible="showTournamentModal" header="Detalles del torneo" :modal="true" class="w-full md:w-3/4">
      <template #default>
        <h3 class="text-xl font-bold text-green-900 mb-4">{{ selectedTournament.name }}</h3>

        <div v-if="selectedMatchDetails" class="bg-white p-4 rounded-lg shadow-md mb-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Detalles del partido</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600"><strong>Fecha:</strong> {{ formatDate(selectedMatchDetails.fecha) }}</p>
              <p class="text-sm text-gray-600"><strong>Hora:</strong> {{ selectedMatchDetails.hora }}</p>
            </div>
            <div>
              <p class="text-lg font-bold text-center">
                {{ selectedMatchDetails.equipo_local }}
                <span class="text-blue-600 mx-2">{{ selectedMatchDetails.goles_local !== null ? selectedMatchDetails.goles_local : '0' }}</span>
                -
                <span class="text-blue-600 mx-2">{{ selectedMatchDetails.goles_visitante !== null ? selectedMatchDetails.goles_visitante : '0' }}</span>
                {{ selectedMatchDetails.equipo_visitante }}
              </p>
            </div>
          </div>
        </div>

        <h4 class="text-lg font-semibold text-gray-700 mb-2">Tabla de posiciones</h4>
        <DataTable :value="standings" class="mb-4" responsiveLayout="scroll">
          <Column field="equipo" header="Equipo" />
          <Column field="partidos_jugados" header="PJ" />
          <Column field="victorias" header="V" />
          <Column field="empates" header="E" />
          <Column field="derrotas" header="D" />
          <Column field="goles_favor" header="GF" />
          <Column field="goles_contra" header="GC" />
          <Column field="diferencia_goles" header="DG" />
          <Column field="puntos" header="Pts" />
        </DataTable>

        <h4 class="text-lg font-semibold text-gray-700 mb-2">Todos los partidos</h4>
        <div class="space-y-3">
          <div v-for="match in matches" :key="match.id"
               class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-blue-50"
               @click="selectMatch(match)">

            <div class="text-center mb-2">
              <span class="font-bold text-lg text-gray-800">{{ match.equipo_local }}</span>
              <span class="mx-2 text-gray-500">vs</span>
              <span class="font-bold text-lg text-gray-800">{{ match.equipo_visitante }}</span>
            </div>

            <div class="text-center mb-2">
              <span class="text-2xl font-bold text-teal-600">
                {{ match.goles_local !== null ? match.goles_local : '0' }}
              </span>
              <span class="mx-2 text-gray-500">-</span>
              <span class="text-2xl font-bold text-green-600">
                {{ match.goles_visitante !== null ? match.goles_visitante : '0' }}
              </span>
            </div>

            <div class="text-center text-sm text-gray-500">
              {{ formatDate(match.fecha) }} {{ match.hora }}
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <Button label="Agregar partido" icon="pi pi-calendar-plus" class="bg-teal-500 text-white" @click="showAddMatch = true" />
          <Button label="Editar torneo" icon="pi pi-pencil" class="bg-yellow-500 text-white" @click="showEditTournament = true" />
        </div>
      </template>
    </Dialog>

    <!-- Modal agregar partido con estadísticas -->
    <Dialog v-model:visible="showAddMatch" header="Agregar partido y estadísticas" :modal="true" class="w-full md:w-3/4">
      <form @submit.prevent="addMatchWithStats" class="flex flex-col gap-4">
        <!-- Información básica del partido -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Dropdown v-model="newMatch.team1_id" :options="teams" optionLabel="na_team" optionValue="team_id"
                   placeholder="Equipo local" class="w-full" @change="loadTeamPlayers($event.value, 'local')" />
          <Dropdown v-model="newMatch.team2_id" :options="teams" optionLabel="na_team" optionValue="team_id"
                   placeholder="Equipo visitante" class="w-full" @change="loadTeamPlayers($event.value, 'visitante')" />
          <Calendar v-model="newMatch.date_competition" placeholder="Fecha del partido" class="w-full" />
          <InputText v-model="newMatch.hour_competition" placeholder="Hora (HH:MM:SS)" class="w-full" />
        </div>

        <!-- Estadísticas del equipo local -->
        <div v-if="localPlayers.length" class="mb-6">
          <h5 class="font-semibold text-gray-700 mb-3">Estadísticas - Equipo Local</h5>
          <div v-for="(stat, index) in localStats" :key="'local-' + index" class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
            <Dropdown v-model="stat.player_id" :options="localPlayers" optionLabel="na_person" optionValue="team_member_id"
                     placeholder="Jugador" class="w-full" />
            <Dropdown v-model="stat.statistic_id" :options="statistics" optionLabel="unit_meassure" optionValue="statistic_concept_id"
                     placeholder="Estadística" class="w-full" />
            <InputNumber v-model="stat.quantity" placeholder="Cantidad" class="w-full" />
            <Button icon="pi pi-times" class="p-button-danger" @click="removeStat('local', index)" />
          </div>
          <Button icon="pi pi-plus" label="Agregar estadística" @click="addStat('local')" class="p-button-outlined" />
        </div>

        <!-- Estadísticas del equipo visitante -->
        <div v-if="visitantePlayers.length" class="mb-6">
          <h5 class="font-semibold text-gray-700 mb-3">Estadísticas - Equipo Visitante</h5>
          <div v-for="(stat, index) in visitanteStats" :key="'visitante-' + index" class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
            <Dropdown v-model="stat.player_id" :options="visitantePlayers" optionLabel="na_person" optionValue="team_member_id"
                     placeholder="Jugador" class="w-full" />
            <Dropdown v-model="stat.statistic_id" :options="statistics" optionLabel="unit_meassure" optionValue="statistic_concept_id"
                     placeholder="Estadística" class="w-full" />
            <InputNumber v-model="stat.quantity" placeholder="Cantidad" class="w-full" />
            <Button icon="pi pi-times" class="p-button-danger" @click="removeStat('visitante', index)" />
          </div>
          <Button icon="pi pi-plus" label="Agregar estadística" @click="addStat('visitante')" class="p-button-outlined" />
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <Button label="Cancelar" @click="showAddMatch = false" class="bg-gray-300 text-gray-800" />
          <Button label="Crear partido con estadísticas" type="submit" class="bg-green-500 text-white"
                  :disabled="!newMatch.team1_id || !newMatch.team2_id" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import MultiSelect from 'primevue/multiselect';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputNumber from 'primevue/inputnumber';
import { send } from '@/api/send';

const tournaments = ref([]);
const sports = ref([]);
const teams = ref([]);
const selectedSport = ref(null);
const showCreate = ref(false);
const showTournamentModal = ref(false);
const showEditTournament = ref(false);
const showAddMatch = ref(false);
const selectedTournament = ref({});
const standings = ref([]);
const localPlayers = ref([]);
const visitantePlayers = ref([]);
const statistics = ref([]);
const localStats = ref([]);
const visitanteStats = ref([]);
const matches = ref([]);
const selectedMatch = ref(null);
const selectedMatchDetails = ref(null);

const newTournament = ref({
  name_event: ''
});

// Nuevo objeto para el partido
const newMatch = ref({
  team1_id: null,
  team2_id: null,
  date_competition: null,
  hour_competition: ''
});

onMounted(() => {
  fetchTournaments();
  fetchSports();
  fetchTeams();
  fetchStatistics();
});



const fetchStatistics = async () => {
  const res = await send({ endpoint: 'specific/meassure', method: 'get' });
  statistics.value = res.data || [];
};

const loadTeamPlayers = async (team_id, type) => {
  try {
    const res = await send({ endpoint: `teammember/filter/${team_id}`, method: 'get' });
    if (type === 'local') {
      localPlayers.value = res.data || [];
    } else {
      visitantePlayers.value = res.data || [];
    }
  } catch (error) {
    console.error('Error loading players:', error);
  }
};

const fetchTournaments = async () => {
  const res = await send({ endpoint: 'event', method: 'get' });
  tournaments.value = res.data || [];
};

const fetchSports = async () => {
  const res = await send({ endpoint: 'sport', method: 'get' });
  sports.value = res.data || [];
};

const fetchTeams = async () => {
  const res = await send({ endpoint: 'team', method: 'get' });
  teams.value = res.data || [];
};

const filteredTournaments = computed(() => {
  if (!selectedSport.value) return tournaments.value;
  return tournaments.value.filter(t => t.sport_id === selectedSport.value);
});

const activeTournaments = computed(() =>
  tournaments.value.filter(t => t.status === 'activo')
);

const clearFilter = () => {
  selectedSport.value = null;
};

const openTournament = async (tournament) => {
  selectedTournament.value = tournament;
  showTournamentModal.value = true;

  const resTable = await send({ endpoint: `specific/tournament/${tournament.event_id}`, method: 'get' });
  standings.value = resTable.data || [];

  const resMatches = await send({ endpoint: `specific/matches/${tournament.event_id}`, method: 'get' });
  matches.value = resMatches || [];
};

const selectMatch = (match) => {
  selectedMatch.value = match.id;
  selectedMatchDetails.value = match;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

const addStat = (type) => {
  if (type === 'local') {
    localStats.value.push({ player_id: null, statistic_id: null, quantity: 0 });
  } else {
    visitanteStats.value.push({ player_id: null, statistic_id: null, quantity: 0 });
  }
};

const removeStat = (type, index) => {
  if (type === 'local') {
    localStats.value.splice(index, 1);
  } else {
    visitanteStats.value.splice(index, 1);
  }
};

const createTournament = async () => {
  try {
    const res = await send({
      endpoint: 'event',
      method: 'post',
      body: newTournament.value
    });

    console.log('✅ Torneo creado:', res);

    // Cierra modal
    showCreate.value = false;

    // Limpia formulario
    newTournament.value = { na_event: '' };

    // Recarga lista de torneos
    await fetchTournaments();

  } catch (error) {
    console.error('❌ Error creando torneo:', error);
  }
};

const addMatchWithStats = async () => {
  try {
    console.log('📍 Iniciando creación de partido...');

    // 1. Crear la competencia (partido)
    const compData = {
      team1_id: newMatch.value.team1_id,
      team2_id: newMatch.value.team2_id,
      date_competition: newMatch.value.date_competition,
      hour_competition: newMatch.value.hour_competition,
      event_id: selectedTournament.value.event_id,
      place_event_id: 1,
      type_comp_id: 1
    };

    console.log('📦 Datos del partido:', compData);

    const compRes = await send({
      endpoint: 'competition',
      method: 'post',
      body: compData
    });

    console.log('✅ Partido creado con ID:', compRes);
    const compId = compRes.comp_id;

    // 2. Insertar estadísticas del equipo local
    console.log('📊 Estadísticas locales:', localStats.value);
    for (const stat of localStats.value) {
      if (stat.player_id && stat.statistic_id && stat.quantity > 0) {
        await send({
          endpoint: 'sportstatistic',
          method: 'post',
          body: {
            comp_id: compId,
            team_member_id: stat.player_id,
            statistic_concept_id: stat.statistic_id,
            statistic: stat.quantity
          }
        });
      }
    }

    // 3. Insertar estadísticas del equipo visitante
    console.log('📊 Estadísticas visitante:', visitanteStats.value);
    for (const stat of visitanteStats.value) {
      if (stat.player_id && stat.statistic_id && stat.quantity > 0) {
        await send({
          endpoint: 'sportstatistic',
          method: 'post',
          body: {
            comp_id: compId,
            team_member_id: stat.player_id,
            statistic_concept_id: stat.statistic_id,
            statistic: stat.quantity
          }
        });
      }
    }

    console.log('🎉 Partido y estadísticas creados exitosamente');

    // Limpiar todo
    showAddMatch.value = false;
    newMatch.value = { team1_id: null, team2_id: null, date_competition: null, hour_competition: '' };
    localStats.value = [];
    visitanteStats.value = [];
    localPlayers.value = [];
    visitantePlayers.value = [];

    // Recargar partidos
    await openTournament(selectedTournament.value);

  } catch (error) {
    console.error('❌ Error creating match with stats:', error);
  }
};
</script>
