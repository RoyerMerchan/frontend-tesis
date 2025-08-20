<script setup>
import { onMounted, ref } from 'vue';
import { send } from '@/api/send';

import Toast from 'primevue/toast';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

import CModalTypeComp from '../components/CModalTC.vue';
import EModalTypeComp from '../components/EModalTC.vue';
import FModalTypeComp from '../components/FModalTC.vue';

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const competencias = ref([]);
const seleccionados = ref([]);
const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const modalVisibleF = ref(false);
const competenciaEditando = ref(null);

const abrirCrear = () => {
  modalVisibleC.value = true;
};

const abrirModalEdicion = (competencia) => {
  if (competencia) {
    competenciaEditando.value = competencia;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona una competencia para editar.' });
  }
};

const selectCompetitions = async () => {
  try {
    const response = await send({
      endpoint: 'typecompetition', // ajustá si tu endpoint es distinto
      method: 'get'
    });
    competencias.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar competencias:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las competencias.' });
  }
};

const filtrarPorDeporte = async (sportId) => {
  try {
    const res = await send({ endpoint: `typecompetition/filter/${sportId}`, method: 'get' });
    competencias.value = res.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo filtrar por deporte.' });
  }
};


const deleteCompetitions = async () => {
  if (!seleccionados.value.length) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos una competencia para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionados.value.map(async (comp) => {
        await send({
          endpoint: `typecompetition/${comp.type_comp_id}`,
          method: 'delete'
        });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Competencias eliminadas correctamente.' });
    await selectCompetitions();
    seleccionados.value = [];
  } catch (error) {
    console.error('Error al eliminar competencias:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todas las competencias.' });
  }
};

onMounted(async () => {
  await selectCompetitions();
});
</script>

<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Tipo de Competición</h2>


      <CModalTypeComp v-model:visible="modalVisibleC" @create="selectCompetitions" />
      <EModalTypeComp v-model:visible="modalVisibleE" :competencia="competenciaEditando" @update="selectCompetitions" />
    <FModalTypeComp v-model:visible="modalVisibleF" @filtrar="filtrarPorDeporte" @limpiar="selectCompetitions" @cerrar="modalVisibleF"  />

      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nueva Competencia" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="deleteCompetitions" />
        <Button label="Filtrar" icon="pi pi-filter" @click="modalVisibleF = true" />
      </div>

      <div class="overflow-x-auto">
        <DataTable :value="competencias" v-model:selection="seleccionados" selectionMode="multiple" dataKey="type_comp_id"
          :rowHover="true" class="w-full">
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="na_type_comp" header="Tipo de Competencia" />
          <Column field="na_sport" header="Deporte" />
          <Column header="Acciones">
            <template #body="{ data }">
              <Button label="Editar" icon="pi pi-pencil" class="p-button-sm mr-2"
                @click="abrirModalEdicion(data)" severity="success" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
