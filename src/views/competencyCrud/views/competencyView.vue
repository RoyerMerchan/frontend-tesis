<template>
  <div class="min-h-screen w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full max-w-6xl bg-white rounded shadow-md py-10 px-4 mx-auto">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de competencia</h2>
      <CModal v-model:visible="modalVisibleC"/>
      <EModal v-model:visible="modalVisibleE"/>
      <FModal v-model:visible="modalVisibleF" @cerrar="modalVisibleF = false"/>


      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nueva competencia" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger"/>
        <Button label="Filtrar" icon="pi pi-filter-fill" @click="abrirFiltro"></Button>
      </div>
      <div class="overflow-x-auto">
        <DataTable
          :value="lineupVisibles"
          v-model:selection="seleccionados"
          selectionMode="single"
          dataKey="id"
          :rowHover="true"
          class="w-full"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="evento" header="evento" />
          <Column field="lugar_evento" header="lugar de evento" />
          <Column field="tipo_competencia" header="tipo de competencia" />
          <Column field="fecha" header="fecha" />
          <Column field="hora" header="hora" />

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
import CModal from '../components/CModalCo.vue';
import EModal from '../components/EModalCo.vue';
import FModal from '../components/FModalCo.vue'; // Si necesitas el filtro, descomentar esta línea


// Datos simulados
const competencia = ref([
  {id :1, id_evento: 101, id_lugar_evento: 106, id_tipo_competencia: 111, id_fecha: 115, hora: '10:00 AM'},
  {id :2, id_evento: 102, id_lugar_evento: 107, id_tipo_competencia: 112, id_fecha: 116, hora: '11:00 AM'},
  {id :3, id_evento: 103, id_lugar_evento: 108, id_tipo_competencia: 113, id_fecha: 117, hora: '12:00 PM'},
  {id :4, id_evento       : 104, id_lugar_evento: 109, id_tipo_competencia: 114, id_fecha: 118, hora: '01:00 PM'},
  {id :5, id_evento: 105, id_lugar_evento:  110, id_tipo_competencia: 111, id_fecha: 119, hora: '02:00 PM'},
]);

const evento = [
  { id: 101, nombre: 'Evento A' },
  { id: 102, nombre: 'Evento B' },
  { id: 103, nombre: 'Evento C' },
  { id: 104, nombre: 'Evento D' },
  { id: 105, nombre: 'Evento E' },
];

const lugar_evento = [
  { id: 106, nombre: 'Estadio A' },
  { id: 107, nombre: 'Estadio B' },
  { id: 108, nombre: 'Estadio C' },
  { id: 109, nombre: 'Estadio D' },
  { id: 110, nombre: 'Estadio E' },
];

const tipo_competencia = [
  { id: 111, nombre: 'Liga' },
  { id: 112, nombre: 'Torneo' },
  { id: 113, nombre: 'Copa' },
  { id: 114, nombre: 'Exhibición' },

];

const fecha = [
  { id: 115, nombre: '2023-10-01' },
  { id: 116, nombre: '2023-10-02' },
  { id: 117, nombre: '2023-10-03' },
  { id: 118, nombre: '2023-10-04' },
  { id: 119, nombre: '2023-10-05' },

];



const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const competitionEditando = ref(null);

const formulario = ref({
  id_evento: null,
  id_lugar_evento: null,
  id_tipo_competencia: null,
  id_fecha: null,
  hora: '',

});

const abrirCrear = () => {
  modoEdicion.value = false;
 competitionEditando.value = null;
  formulario.value = {
    id_evento: null,
    id_lugar_evento: null,
    id_tipo_competencia: null,
    id_fecha: null,
    hora: '',

  };
  modalVisibleC.value = true;
};



const abrirEditar = (tc) => {
  modoEdicion.value = true;
competitionEditando.value = tc;
  Object.assign(formulario.value, tc);
  modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//   tc.value = tc.value.filter(u => u.id !== usuario.id);
// };
const filtroActivo = ref('');

const teamConRel = computed(() =>
  competencia.value.map((u) => {
const eventoData = evento.find((p) => p.id === u.id_evento);
const lugar_eventoData = lugar_evento.find((p) => p.id === u.id_lugar_evento);
const tipo_competenciaData = tipo_competencia.find((c) => c.id === u.id_tipo_competencia);
const fechaData = fecha.find((p) => p.id === u.id_fecha);
    return {
      ...u,
      evento: eventoData ? `${eventoData.nombre} ` : '—',
      lugar_evento: lugar_eventoData ? `${lugar_eventoData.nombre} ` : '—',
      tipo_competencia: tipo_competenciaData ? `${tipo_competenciaData.nombre} ` : '—',
      fecha: fechaData ? `${fechaData.nombre} ` : '—',

    };
  })
);




const lineupVisibles = computed(() => {
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
