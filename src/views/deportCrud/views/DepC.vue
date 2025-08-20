<script setup>
import { onMounted, ref } from 'vue';

import { send } from '@/api/send';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';

import CModalSport from '../components/CmodalD.vue';
import EModalSport from '../components/EmodalD.vue';

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const deportes = ref([]);
const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const deporteEditando = ref(null);

const abrirCrear = () => {
  deporteEditando.value = null;
  modalVisibleC.value = true;
};

const abrirModalEdicion = (deporte) => {
  if (deporte) {
    deporteEditando.value = deporte;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona un deporte para editar.' });
  }
};

const selectSports = async () => {
  try {
    const response = await send({
      endpoint: 'sport',
      method: 'get'
    });
    deportes.value = response.data || [];
  } catch (err) {
    console.error('Error al cargar deportes:', err);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los deportes.' });
  }
};

const DeleteSport = async () => {
  if (!seleccionados.value || seleccionados.value.length === 0) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos un deporte para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionados.value.map(async (deporte) => {
        await send({
          endpoint: `sport/${deporte.sport_id}`,
          method: 'delete'
        });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Deportes eliminados correctamente.' });
    await selectSports();
    seleccionados.value = [];
  } catch (error) {
    console.error('Error al eliminar deporte:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los deportes.' });
  }
};

onMounted(selectSports);
</script>

<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Deportes</h2>

      <CModalSport v-model:visible="modalVisibleC" @create="selectSports" />
      <EModalSport v-model:visible="modalVisibleE" :deporte="deporteEditando" @update="selectSports" />

      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nuevo Deporte" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="DeleteSport" />
      </div>

      <div class="overflow-x-auto">
        <DataTable
          :value="deportes"
          v-model:selection="seleccionados"
          selectionMode="multiple"
          dataKey="sport_id"
          :rowHover="true"
          class="w-full"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="na_sport" header="Nombre" />
          <Column field="de_sport" header="Descripción" />
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
