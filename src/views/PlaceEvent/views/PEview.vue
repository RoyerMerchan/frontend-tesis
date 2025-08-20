<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Lugares de Evento</h2>

      <CModal v-model:visible="modalVisibleC" @create="selectPlaceEvents" />
      <EModal v-model:visible="modalVisibleE" :lugar="lugarEditando" @update="selectPlaceEvents" />

      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nuevo Lugar" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="DeletePlaceEvent" />
      </div>

      <div class="overflow-x-auto">
        <DataTable
          :value="lugares"
          v-model:selection="seleccionados"
          selectionMode="multiple"
          dataKey="place_event_id"
          :rowHover="true"
          class="w-full"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="na_place_event" header="Nombre del Lugar" />
          <Column field="ubi_place_event" header="Ubicación" />
          <Column header="Acciones">
            <template #body="{ data }">
              <Button
                label="Editar"
                icon="pi pi-pencil"
                class="p-button-sm mr-2"
                @click="abrirModalEdicion(data)"
                severity="success"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import { send } from '@/api/send';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';

import CModal from '../components/CmodalPE.vue';
import EModal from '../components/EmodalPE.vue';

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const lugares = ref([]);
const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const lugarEditando = ref(null);

const abrirCrear = () => {
  lugarEditando.value = null;
  modalVisibleC.value = true;
};

const abrirModalEdicion = (lugar) => {
  if (lugar) {
    lugarEditando.value = lugar;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona un lugar para editar.' });
  }
};

const selectPlaceEvents = async () => {
  try {
    const response = await send({
      endpoint: 'placeevent',
      method: 'get'
    });
    lugares.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar lugares:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los lugares de evento.' });
  }
};

const DeletePlaceEvent = async () => {
  if (!seleccionados.value || seleccionados.value.length === 0) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos un lugar para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionados.value.map(async (lugar) => {
        await send({
          endpoint: `placeevent/${lugar.place_event_id}`,
          method: 'delete'
        });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Lugares eliminados correctamente.' });
    await selectPlaceEvents();
    seleccionados.value = [];
  } catch (error) {
    console.error('Error al eliminar lugar:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los lugares.' });
  }
};

onMounted(selectPlaceEvents);
</script>
