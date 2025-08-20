<script setup>
import { onMounted, ref } from 'vue';
import { send } from '@/api/send';

import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';

import CModalCompetition from '../components/CModalCo.vue';
import EModalCompetition from '../components/EModalCo.vue';
import FModalCompetition from '../components/FModalCo.vue'; // Si necesitas el filtro, descomentar esta línea
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const competencias = ref([]);
const seleccionados = ref([]);
const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const modalVisibleF = ref(false); // Si necesitas el filtro, descomentar esta línea
const competenciaEditando = ref(null);

const abrirCrear = () => {
  competenciaEditando.value = null;
  modalVisibleC.value = true;
};

const abrirEdicion = (competencia) => {
  if (competencia) {
    competenciaEditando.value = competencia;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona una competencia para editar.' });
  }
};

const cargarCompetencias = async () => {
  try {
    const res = await send({ endpoint: 'competition', method: 'get' });
    competencias.value = res.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las competencias.' });
  }
};

const eliminarCompetencias = async () => {
  if (!seleccionados.value.length) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos una competencia para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionados.value.map(async (competencia) => {
        await send({ endpoint: `competition/${competencia.comp_id}`, method: 'delete' });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Competencias eliminadas correctamente.' });
    await cargarCompetencias();
    seleccionados.value = [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todas las competencias.' });
  }
};

onMounted(cargarCompetencias);
</script>

<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Competencias</h2>

      <CModalCompetition v-model:visible="modalVisibleC" @create="cargarCompetencias" />
      <EModalCompetition v-model:visible="modalVisibleE" :competencia="competenciaEditando" @update="cargarCompetencias" />
      <FModalCompetition v-model:visible="modalVisibleF" @filter="cargarCompetencias" />

      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nueva Competencia" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="eliminarCompetencias" />
        <Button label="Filtrar" icon="pi pi-filter" @click="modalVisibleF = true"></Button>
    </div>

      <div class="overflow-x-auto">
        <DataTable
          :value="competencias"
          v-model:selection="seleccionados"
          selectionMode="multiple"
          dataKey="comp_id"
          :rowHover="true"
          class="w-full"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="date_competition" header="Fecha" />
          <Column field="hour_competition" header="Hora" />
          <Column field="na_type_comp" header="Tipo de Competencia" />
          <Column field="na_event" header="Evento" />
          <Column field="na_place_event" header="Lugar del Evento" />
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
