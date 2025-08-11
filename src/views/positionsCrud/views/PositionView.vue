<template>
  <div class="min-h-screen w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full max-w-6xl bg-white rounded shadow-md py-10 px-4 mx-auto">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Posiciones
      </h2>
      <CModal v-model:visible="modalVisibleC"/>
      <EModal v-model:visible="modalVisibleE"/>



      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nueva posicion" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger"/>
      </div>
      <div class="overflow-x-auto">
        <DataTable
          :value="posicionVisibles"
          v-model:selection="seleccionados"
          selectionMode="single"
          dataKey="id"
          :rowHover="true"
          class="w-full"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="position_name" header="Nombre posicion" />
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
import { ref, } from 'vue';


import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import CModal from '../components/CmodalP.vue';
import EModal from '../components/EmodalP.vue';
// import FModal from '../components/FModalCU.vue'; // Si necesitas el filtro, descomentar esta línea


// Datos simulados
const position = ref([
  { id: 1, position_name: 'Portero' },
  { id: 2, position_name: 'Defensa' },
  { id: 3, position_name: 'Centrocampista' },
  { id: 4, position_name: 'Delantero' },
  { id: 5, position_name: 'Extremo' },
  { id: 6, position_name: 'Mediocampista' },
  { id: 7, position_name: 'Lateral' },
  { id: 8, position_name: 'Volante' },
  { id: 9, position_name: 'Delantero centro' },
  { id: 10, position_name: 'Defensa central' },
  { id: 11, position_name: 'Ala' },
  { id: 12, position_name: 'Pivot' },
  { id: 13, position_name: 'Carrilero' },
  { id: 14, position_name: 'Interior' },
  { id: 15, position_name: 'Extremo derecho' },
  { id: 16, position_name: 'Extremo izquierdo' },
  { id: 17, position_name: 'Segundo delantero' },
  { id: 18, position_name: 'Mediapunta' },
  { id: 19, position_name: 'Defensa lateral' },
  { id: 20, position_name: 'Defensa central izquierdo' },
]);
const posicionVisibles = ref(position);






const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const positionedit = ref(null);

const formulario = ref({
  position_name: '',
});

const abrirCrear = () => {
  modoEdicion.value = false;
  positionedit.value = null;
  formulario.value = {
    descripcion: '',
  };
  modalVisibleC.value = true;
};



const abrirEditar = (posit) => {
  modoEdicion.value = true;
  positionedit.value = posit;
  Object.assign(formulario.value, posit);
  modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//   usuarios.value = usuarios.value.filter(u => u.id !== usuario.id);
// };



</script>
