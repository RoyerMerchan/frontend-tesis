<template>
  <div class="min-h-screen w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full max-w-6xl bg-white rounded shadow-md py-10 px-4 mx-auto">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de equipo</h2>
      <CModal v-model:visible="modalVisibleC"/>
      <EModal v-model:visible="modalVisibleE"/>
      <FModal v-model:visible="modalVisibleF" @cerrar="modalVisibleF = false"/>


      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nuevo equipo" icon="pi pi-plus" @click="abrirCrear" />
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
          <Column field="name" header="nombre equipo" />
          <Column field="SportName" header="deporte" />
          <Column field="institution" header="institucion" />
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
import CModal from '../components/CModalT.vue';
import EModal from '../components/EModalT.vue';
import FModal from '../components/FModalT.vue'; // Si necesitas el filtro, descomentar esta línea


// Datos simulados
const teams = ref([
  { id: 1, name: 'Equipo A', id_sport: 101, id_institucion: 106 },
  { id: 2, name: 'Equipo B', id_sport: 102, id_institucion: 107 },
  { id: 3, name: 'Equipo C', id_sport: 101, id_institucion: 108 },
  { id: 4, name: 'Equipo D', id_sport: 103, id_institucion: 109 },
  { id: 5, name: 'Equipo E', id_sport: 104, id_institucion: 110 },


]);

const sport = [
  { id: 101, nombre: 'Fútbol' },
  { id: 102, nombre: 'Baloncesto' },
  { id: 103, nombre: 'Natación' },
  { id: 104, nombre: 'Atletismo' },
  { id: 105, nombre: 'Tenis' },
  { id: 106, nombre: 'Béisbol' },
];

const institucion = [
  { id: 106, nombre: 'Institución A' },
  { id: 107, nombre: 'Institución B' },
  { id: 108, nombre: 'Institución C' },
  { id: 109, nombre: 'Institución D' },
  { id: 110, nombre: 'Institución E' },
];



const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const teamEditando = ref(null);

const formulario = ref({
  name: '',
  id_sport: null,
  id_institucion: null,

});

const abrirCrear = () => {
  modoEdicion.value = false;
 teamEditando.value = null;
  formulario.value = {
    name: '',
    id_sport: null,
    id_institucion: null,

  };
  modalVisibleC.value = true;
};



const abrirEditar = (tc) => {
  modoEdicion.value = true;
teamEditando.value = tc;
  Object.assign(formulario.value, tc);
  modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//   tc.value = tc.value.filter(u => u.id !== usuario.id);
// };
const filtroActivo = ref('');

const teamConRel = computed(() =>
  teams.value.map((u) => {
    const sports = sport.find((p) => p.id === u.id_sport);
    const institucionData = institucion.find((i) => i.id === u.id_institucion);
    return {
      ...u,
      SportName: sports ? `${sports.nombre} ` : '—',
      institution: institucionData ? `${institucionData.nombre} ` : '—',
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
