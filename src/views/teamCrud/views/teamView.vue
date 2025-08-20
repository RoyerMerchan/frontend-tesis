<script setup>
import { onMounted, ref } from 'vue';

import { send } from '@/api/send';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';

import CModalTeam from '../components/CModalT.vue';
import EModalTeam from '../components/EModalT.vue';
import FModalTeam from '../components/FModalT.vue'; // Si necesitas el filtro, descomentar esta línea

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const equipos = ref([]);
const seleccionados = ref([]);
const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const modalVisibleF = ref(false);
const equipoEditando = ref(null);

const abrirCrear = () => {
  equipoEditando.value = null;
  modalVisibleC.value = true;
};

const abrirEdicion = (equipo) => {
  if (equipo) {
    equipoEditando.value = equipo;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona un equipo para editar.' });
  }
};

const cargarEquipos = async () => {
  try {
    const response = await send({
      endpoint: 'team',
      method: 'get'
    });
    equipos.value = response.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los equipos.' });
  }
};

const filtrarEquipos = async (filtros) => {
  try {
    const sport = filtros.sport_id.value || 'null';
    const institution = filtros.institution_id.value || 'null';

    const response = await send({
      endpoint: `team/filter/${sport}/${institution}`,
      method: 'get'
    });

    equipos.value = response.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron filtrar los equipos.' });
  }
};

const eliminarEquipos = async () => {
  if (!seleccionados.value.length) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos un equipo para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionados.value.map(async (equipo) => {
        await send({
          endpoint: `team/${equipo.team_id}`,
          method: 'delete'
        });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Equipos eliminados correctamente.' });
    await cargarEquipos();
    seleccionados.value = [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los equipos.' });
  }
};

onMounted(cargarEquipos);
</script>

<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Equipos</h2>

      <CModalTeam v-model:visible="modalVisibleC" @create="cargarEquipos" />
      <EModalTeam v-model:visible="modalVisibleE" :equipo="equipoEditando" @update="cargarEquipos" />
        <FModalTeam v-model:visible="modalVisibleF" @filtrar="filtrarEquipos" @limpiar="cargarEquipos" @cerrar="modalVisibleF = false"   />
      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nuevo Equipo" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="eliminarEquipos" />
        <Button label="Filtrar" icon="pi pi-filter" @click="modalVisibleF = true"></Button>
      </div>

      <div class="overflow-x-auto">
        <DataTable :value="equipos" v-model:selection="seleccionados" selectionMode="multiple" dataKey="team_id" :rowHover="true" class="w-full">
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="na_team" header="Nombre del Equipo" />
          <Column field="na_sport" header=" Deporte" />
          <Column field="na_institucion" header=" Institución" />
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
