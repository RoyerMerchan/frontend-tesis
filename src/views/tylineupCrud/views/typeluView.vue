<script setup>
import { onMounted, ref } from 'vue';
import { send } from '@/api/send';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';
import CModalLineUp from '../components/CModalTLU.vue';
import EModalLineUp from '../components/EModalTLU.vue';
import FModalLineUp from '../components/FModalTLU.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const lineUps = ref([]);
const seleccionados = ref([]);
const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const modalVisibleF = ref(false);
const alineacionEditando = ref(null);

const abrirCrear = () => {
  alineacionEditando.value = null;
  modalVisibleC.value = true;
};

const abrirEdicion = (alineacion) => {
  if (alineacion) {
    alineacionEditando.value = alineacion;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona una alineación para editar.' });
  }
};

const cargarLineUps = async () => {
  try {
    const res = await send({ endpoint: 'typelineup', method: 'get' });
    lineUps.value = res.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las alineaciones.' });
  }
};

const filtrarPorDeporte = async (sportId) => {
  try {
    const res = await send({ endpoint: `typelineup/filter/${sportId}`, method: 'get' });
    lineUps.value = res.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo filtrar por deporte.' });
  }
};

const eliminarLineUps = async () => {
  if (!seleccionados.value || seleccionados.value.length === 0) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos una alineación para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionados.value.map(async (alineacion) => {
        await send({ endpoint: `typelineup/${alineacion.type_line_up_id}`, method: 'delete' });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Alineaciones eliminadas correctamente.' });
    await cargarLineUps();
    seleccionados.value = [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todas las alineaciones.' });
  }
};

onMounted(cargarLineUps);
</script>

<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de tipo alineacion</h2>

      <CModalLineUp v-model:visible="modalVisibleC" @create="cargarLineUps" />
      <EModalLineUp v-model:visible="modalVisibleE" :alineacion="alineacionEditando" @update="cargarLineUps" />
      <FModalLineUp v-model:visible="modalVisibleF" @filtrar="filtrarPorDeporte" @limpiar="cargarLineUps" @cerrar="modalVisibleF = false" />

      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nueva Alineación" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="eliminarLineUps" />
        <Button label="Filtrar" icon="pi pi-filter" @click="modalVisibleF = true" />
      </div>

      <div class="overflow-x-auto">
        <DataTable :value="lineUps" v-model:selection="seleccionados" selectionMode="multiple" dataKey="type_line_up_id" :rowHover="true" class="w-full">
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="na_line_up" header="Nombre" />
          <Column field="de_line_up" header="Descripción" />
          <Column field="na_sport" header="Deporte" />
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
