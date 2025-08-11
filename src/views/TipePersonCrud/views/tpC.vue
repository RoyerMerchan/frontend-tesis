<template>
  <div class="min-h-screen w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full max-w-6xl bg-white rounded shadow-md py-10 px-4 mx-auto">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Tipo Persona</h2>
      <CModal v-model:visible="modalVisibleC"/>
      <EModal v-model:visible="modalVisibleE"/>



      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nuevo TipePerson" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger"/>
      </div>
      <div class="overflow-x-auto">
        <DataTable
          :value="tpVisibles"
          v-model:selection="seleccionados"
          selectionMode="single"
          dataKey="id"
          :rowHover="true"
          class="w-full"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="descripcion" header="Descripcion" />
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
import CModal from '../components/CModalTP.vue';
import EModal from '../components/EModalTP.vue';
// import FModal from '../components/FModalCU.vue'; // Si necesitas el filtro, descomentar esta línea


// Datos simulados
const TypePerson = ref([
  { id: 1, descripcion: 'estudiante',  },
   { id: 2, descripcion: 'maestro', },
   { id: 3, descripcion: 'administrador', }
]);
const tpVisibles = ref(TypePerson);






const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const tpEditando = ref(null);

const formulario = ref({
  descripcion: '',

});

const abrirCrear = () => {
  modoEdicion.value = false;
  tpEditando.value = null;
  formulario.value = {
    descripcion: '',
  };
  modalVisibleC.value = true;
};



const abrirEditar = (tp) => {
  modoEdicion.value = true;
  tpEditando.value = tp;
  Object.assign(formulario.value, tp);
  modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//   usuarios.value = usuarios.value.filter(u => u.id !== usuario.id);
// };



</script>
