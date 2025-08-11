<template>
  <div class="min-h-screen w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full max-w-6xl bg-white rounded shadow-md py-10 px-4 mx-auto">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de miembros de equipo</h2>
      <CModal v-model:visible="modalVisibleC"/>
      <EModal v-model:visible="modalVisibleE"/>
      <FModal v-model:visible="modalVisibleF" @cerrar="modalVisibleF = false"/>


      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nuevo miembro equipo" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger"/>
        <Button label="Filtrar" icon="pi pi-filter-fill" @click="abrirFiltro"></Button>
      </div>
      <div class="overflow-x-auto">
        <DataTable
          :value="teamVisibles"
          v-model:selection="seleccionados"
          selectionMode="single"
          dataKey="id"
          :rowHover="true"
          class="w-full"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="name" header="nombre jugador" />
          <Column field="team_name" header="equipo" />
          <Column field="number_player" header="numero de jugador" />
          <Column header="Acciones">
            <template #body="{ data }">
              <Button label="editar" icon="pi pi-pencil" class="p-button-sm mr-2" @click="abrirEditar(data)" severity="success"/>
              <!-- <Button label="borrar" icon="pi pi-trash" class="p-button-sm p-button-danger" @click="confirmarEliminar(data)" /> -->
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';


import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import CModal from '../components/CModalTM.vue';
import EModal from '../components/EModalTM.vue';
import FModal from '../components/FModalTM.vue'; // Si necesitas el filtro, descomentar esta línea


// Datos simulados
const team_member = ref([
  { id: 2, id_person: 101, team: 'Equipo 1', number_player: 11, id_team: 106 },
  { id: 1, id_person: 102, team: 'Equipo 1', number_player: 10, id_team: 106 },
  { id: 3, id_person: 103, team: 'Equipo 2', number_player: 12, id_team: 107 },


]);

const person = [
  { id: 101, nombre: 'Royer' },
  { id: 102, nombre: 'henry' },
  { id: 103, nombre: 'manuel' },
  { id: 104, nombre: 'santi' },
  { id: 105, nombre: 'pablo' },
  { id: 106, nombre: 'gero' },
];

const team = [
  { id: 106, nombre: 'Inequipo 1' },
  { id: 107, nombre: 'equipo B' },
  { id: 108, nombre: 'equipo C' },
  { id: 109, nombre: 'equipo D' },
  { id: 110, nombre: 'equipo E' },
];



const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const teamMEditando = ref(null);

const formulario = ref({
  id_person: null,
  number_player: null,
  id_team: null,

});

const abrirCrear = () => {
  modoEdicion.value = false;
 teamMEditando.value = null;
  formulario.value = {
    name: '',
    id_sport: null,
    id_institucion: null,

  };
  modalVisibleC.value = true;
};



const abrirEditar = (tc) => {
  modoEdicion.value = true;
teamMEditando.value = tc;
  Object.assign(formulario.value, tc);
  modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//   tc.value = tc.value.filter(u => u.id !== usuario.id);
// };
const filtroActivo = ref('');

const teamConRel = computed(() =>
  team_member.value.map((u) => {
    const sports = person.find((p) => p.id === u.id_sport);
    const institucionData = team.find((i) => i.id === u.id_institucion);
    return {
      ...u,
      name: sports ? `${sports.nombre} ` : '—',
      team_name: institucionData ? `${institucionData.nombre} ` : '—',
    };
  })
);




const teamVisibles = computed(() => {
  if (!filtroActivo.value) {
    return teamConRel.value; // sin filtro
  }
  return teamConRel.value.filter(u =>
    u.nombreCompleto.toLowerCase().includes(filtroActivo.value)
  );
});
const modalVisibleF = ref(false);



const abrirFiltro = () => {
  modalVisibleF.value = true;
};

</script>
