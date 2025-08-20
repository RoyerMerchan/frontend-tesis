<script setup>
import { onMounted, ref } from 'vue';

import { send } from '@/api/send';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';
import CModal from '../components/CmodalI.vue';
import EModal from '../components/EmodalI.vue';

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const instituciones = ref([]);
const seleccionadas = ref([]);
const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const institucionEditando = ref(null);

const abrirCrearInstitucion = () => {
  institucionEditando.value = null;
  modalVisibleC.value = true;
};

const abrirEditarInstitucion = (institucion) => {
  if (institucion) {
    institucionEditando.value = institucion;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona una institución para editar.' });
  }
};

const cargarInstituciones = async () => {
  try {
    const response = await send({
      endpoint: 'institution',
      method: 'GET'
    });
    instituciones.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar instituciones:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las instituciones.' });
  }
};

const eliminarInstituciones = async () => {
  if (!seleccionadas.value.length) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos una institución para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionadas.value.map(async (institucion) => {
        await send({
          endpoint: `institution/${institucion.institucion_id}`,
          method: 'DELETE'
        });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Instituciones eliminadas correctamente.' });
    await cargarInstituciones();
    seleccionadas.value = [];
  } catch (error) {
    console.error('Error al eliminar instituciones:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todas las instituciones.' });
  }
};

onMounted(async () => {
  await cargarInstituciones();
});
</script>

<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Instituciones</h2>

      <CModal v-model:visible="modalVisibleC" @create="cargarInstituciones" />
      <EModal v-model:visible="modalVisibleE" :institucion="institucionEditando" @update="cargarInstituciones" />

      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nueva Institución" icon="pi pi-plus" @click="abrirCrearInstitucion" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="eliminarInstituciones" />
      </div>

      <div class="overflow-x-auto">
        <DataTable :value="instituciones" v-model:selection="seleccionadas" selectionMode="multiple" dataKey="institucion_id" :rowHover="true" class="w-full">
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="na_institucion" header="Nombre" />
          <Column header="Acciones">
            <template #body="{ data }">
              <Button label="Editar" icon="pi pi-pencil" class="p-button-sm mr-2" @click="abrirEditarInstitucion(data)" severity="success" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
