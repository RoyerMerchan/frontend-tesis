<template>
  <div class="min-h-screen w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full max-w-6xl bg-white rounded shadow-md py-10 px-4 mx-auto">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de tipo alineacion</h2>
      <CModal v-model:visible="modalVisibleC"/>
      <EModal v-model:visible="modalVisibleE"/>
      <FModal v-model:visible="modalVisibleF" @cerrar="modalVisibleF = false"/>


      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nuevo tipo alineacion" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger"/>
        <Button label="Filtrar" icon="pi pi-filter-fill" @click="abrirFiltro"></Button>
      </div>
      <div class="overflow-x-auto">
        <DataTable
          :value="tluVisibles"
          v-model:selection="seleccionados"
          selectionMode="single"
          dataKey="id"
          :rowHover="true"
          class="w-full"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="name" header="nombre tipo alineacion" />
          <Column field="de_type_lineup" header="descripcion" />
          <Column field="SportName" header="deporte" />
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
import CModal from '../components/CModalTLU.vue';
import EModal from '../components/EModalTLU.vue';
import FModal from '../components/FModalTLU.vue'; // Si necesitas el filtro, descomentar esta línea


// Datos simulados
const tlu = ref([
  { id: 1, name: 'Alineacion A', de_type_lineup: '4-4-2', id_sport: 101 },
  { id: 2, name: 'Alineacion B', de_type_lineup: '3-5-2', id_sport: 102 },
  { id: 3, name: 'Alineacion C', de_type_lineup: '4-3-3', id_sport: 101 },

]);

const sport = [
  { id: 101, nombre: 'Fútbol' },
  { id: 102, nombre: 'Baloncesto' },
  { id: 103, nombre: 'Natación' },
  { id: 104, nombre: 'Atletismo' },
  { id: 105, nombre: 'Tenis' },
  { id: 106, nombre: 'Béisbol' },
];



const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const tluEditando = ref(null);

const formulario = ref({
  name: '',
  de_type_lineup: '',
  id_sport: null,

});

const abrirCrear = () => {
  modoEdicion.value = false;
 tluEditando.value = null;
  formulario.value = {
    name: '',
    de_type_lineup: '',
    id_sport: null,

  };
  modalVisibleC.value = true;
};



const abrirEditar = (tc) => {
  modoEdicion.value = true;
tluEditando.value = tc;
  Object.assign(formulario.value, tc);
  modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//   tc.value = tc.value.filter(u => u.id !== usuario.id);
// };
const filtroActivo = ref('');

const tluConDeporte = computed(() =>
  tlu.value.map((u) => {
    const sports = sport.find((p) => p.id === u.id_sport);
    return {
      ...u,
      SportName: sports ? `${sports.nombre} ` : '—',
    };
  })
);


const tluVisibles = computed(() => {
  if (!filtroActivo.value) {
    return tluConDeporte.value; // sin filtro
  }
  return tluConDeporte.value.filter(u =>
    u.nombreCompleto.toLowerCase().includes(filtroActivo.value)
  );
});
const modalVisibleF = ref(false);

const abrirFiltro = () => {
  modalVisibleF.value = true;
};

</script>
