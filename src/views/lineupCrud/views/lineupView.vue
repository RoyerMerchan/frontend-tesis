<script setup>
import { onMounted, ref } from 'vue';
import { send } from '@/api/send';

import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';

import CModalLineUp from '../components/CModalLU.vue';
import EModalLineUp from '../components/EModalLU.vue';
import FModalLineUp from '../components/FModalLU.vue'; // Si necesitas el filtro, descomentar esta línea
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const alineaciones = ref([]);
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

const cargarAlineaciones = async () => {
  try {
    const res = await send({ endpoint: 'lineup', method: 'get' });
    alineaciones.value = res.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las alineaciones.' });
  }
};

const eliminarAlineaciones = async () => {
  if (!seleccionados.value.length) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos una alineación para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionados.value.map(async (alineacion) => {
        await send({ endpoint: `lineup/${alineacion.line_up_id}`, method: 'delete' });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Alineaciones eliminadas correctamente.' });
    await cargarAlineaciones();
    seleccionados.value = [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todas las alineaciones.' });
  }
};

const filtrarAli = async (typeLId) => {
  try {
    const res = await send({ endpoint: `lineup/filter/${typeLId}`, method: 'get' });
    alineaciones.value = res.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo filtrar por tipo.' });
  }
};

onMounted(cargarAlineaciones);
</script>

<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Alineaciones</h2>

      <CModalLineUp v-model:visible="modalVisibleC" @create="cargarAlineaciones" />
      <EModalLineUp v-model:visible="modalVisibleE" :alineacion="alineacionEditando" @update="cargarAlineaciones" />
        <FModalLineUp v-model:visible="modalVisibleF" @filtrar="filtrarAli" @limpiar="cargarAlineaciones" />

      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nueva Alineación" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="eliminarAlineaciones" />
        <Button label="Filtrar" icon="pi pi-filter"  @click="modalVisibleF = true" />
    </div>

      <div class="overflow-x-auto">
        <DataTable
          :value="alineaciones"
          v-model:selection="seleccionados"
          selectionMode="multiple"
          dataKey="line_up_id"
          :rowHover="true"
          class="w-full"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="na_position" header="Posición" />
          <Column field="na_line_up" header="Tipo de Alineación" />
          <Column field="na_person" header="Miembro del Equipo" />
          <Column field="ln_person" header="" />
          <Column field="de_line_up" header="Descripción" />
          <Column field="team_comp_id" header="Competencia del Equipo" />
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
