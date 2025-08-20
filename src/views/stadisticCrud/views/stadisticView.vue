<script setup>
import { onMounted, ref } from 'vue';
import { send } from '@/api/send';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';
import CModalStatistic from '../components/CModalS.vue';
import EModalStatistic from '../components/EModalS.vue';
import FModalStatistic from '../components/FModalS.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const estadisticas = ref([]);
const seleccionados = ref([]);
const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const modalVisibleF = ref(false);
const estadisticaEditando = ref(null);

const abrirCrear = () => {
  estadisticaEditando.value = null;
  modalVisibleC.value = true;
};

const abrirEdicion = (estadistica) => {
  if (estadistica) {
    estadisticaEditando.value = estadistica;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona una estadística para editar.' });
  }
};

const cargarEstadisticas = async () => {
  try {
    const res = await send({ endpoint: 'sportstatistic', method: 'get' });
    estadisticas.value = res.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las estadísticas.' });
  }
};

const filtrarPorJugador = async (teamMid) => {
  try {
    const res = await send({ endpoint: `sportstatistic/filter/${teamMid}`, method: 'get' });
    estadisticas.value = res.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo filtrar por competencia.' });
  }
};

const eliminarEstadisticas = async () => {
  if (!seleccionados.value.length) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos una estadística para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionados.value.map(async (estadistica) => {
        await send({ endpoint: `sportstatistic/${estadistica.sport_statistic_id}`, method: 'delete' });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Estadísticas eliminadas correctamente.' });
    await cargarEstadisticas();
    seleccionados.value = [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todas las estadísticas.' });
  }
};

onMounted(cargarEstadisticas);
</script>

<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de estadísticas deportivas</h2>

      <CModalStatistic v-model:visible="modalVisibleC" @create="cargarEstadisticas" />
      <EModalStatistic v-model:visible="modalVisibleE" :estadistica="estadisticaEditando" @update="cargarEstadisticas" />
      <FModalStatistic v-model:visible="modalVisibleF" @filtrar="filtrarPorJugador" @limpiar="cargarEstadisticas" @cerrar="modalVisibleF = false" />

      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nueva Estadística" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="eliminarEstadisticas" />
        <Button label="Filtrar" icon="pi pi-filter" @click="modalVisibleF = true" />
      </div>

      <div class="overflow-x-auto">
        <DataTable
          :value="estadisticas"
          v-model:selection="seleccionados"
          selectionMode="multiple"
          dataKey="sport_statistic_id"
          :rowHover="true"
          class="w-full"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="statistic" header="Valor" />
          <Column field="unit_meassure" header="Concepto" />
          <Column field="na_person" header="nombre jugador" />
          <Column field="ln_person" header="apellido jugador" />
          <Column field="comp_id" header="ID Competencia" />
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
