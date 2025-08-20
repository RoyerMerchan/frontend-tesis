<script setup>
import { onMounted, ref } from 'vue';

import { send } from '@/api/send';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';

import CModalPosition from '../components/CmodalP.vue';
import EModalPosition from '../components/EmodalP.vue';

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const posiciones = ref([]);
const seleccionadas = ref([]);
const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const posicionEditando = ref(null);

const abrirCrear = () => {
  posicionEditando.value = null;
  modalVisibleC.value = true;
};

const abrirEdicion = (posicion) => {
  if (posicion) {
    posicionEditando.value = posicion;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona una posición para editar.' });
  }
};

const cargarPosiciones = async () => {
  try {
    const response = await send({
      endpoint: 'position',
      method: 'get'
    });
    posiciones.value = response.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las posiciones.' });
  }
};

const eliminarPosiciones = async () => {
  if (!seleccionadas.value.length) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos una posición para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionadas.value.map(async (posicion) => {
        await send({
          endpoint: `position/${posicion.position_id}`,
          method: 'delete'
        });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Posiciones eliminadas correctamente.' });
    await cargarPosiciones();
    seleccionadas.value = [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todas las posiciones.' });
  }
};

onMounted(cargarPosiciones);
</script>

<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Posiciones</h2>

      <CModalPosition v-model:visible="modalVisibleC" @create="cargarPosiciones" />
      <EModalPosition v-model:visible="modalVisibleE" :posicion="posicionEditando" @update="cargarPosiciones" />

      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nueva Posición" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="eliminarPosiciones" />
      </div>

      <div class="overflow-x-auto">
        <DataTable :value="posiciones" v-model:selection="seleccionadas" selectionMode="multiple" dataKey="position_id" :rowHover="true" class="w-full">
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="na_position" header="Nombre de la Posición" />
          <Column header="Acciones">
            <template #body="{ data }">
              <Button label="Editar" icon="pi pi-pencil" class="p-button-sm mr-2" @click="abrirEdicion(data)" severity="success" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
