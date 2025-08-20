<script setup>
import { onMounted, ref } from 'vue';

import { send } from '@/api/send';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';

import CModalTeam from '../components/CModalTM.vue';
import EModalTeam from '../components/EModalTM.vue';
import FModalTeam from '../components/FModalTM.vue'; // Si necesitas el filtro, descomentar esta línea

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const jugadores = ref([]);
const seleccionados = ref([]);
const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const modalVisibleF = ref(false);
const jugadorEditando = ref(null);

const abrirCrear = () => {
  jugadorEditando.value = null;
  modalVisibleC.value = true;
};

const abrirEdicion = (jugador) => {
  if (jugador) {
    jugadorEditando.value = jugador;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona un jugador para editar.' });
  }
};

const cargarjugadores = async () => {
  try {
    const response = await send({
      endpoint: 'teammember',
      method: 'get'
    });
    jugadores.value = response.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los jugadores.' });
  }
};

const filtrarjugadores = async (teamId) => {
  console.log('Team ID recibido:', teamId); // 👈 Verifica esto

  try {
    const response = await send({
      endpoint: `teammember/filter/${teamId}`,
      method: 'get'
    });

    jugadores.value = response.data || [];
    toast.add({ severity: 'success', summary: 'Filtrado', detail: 'Jugadores filtrados correctamente.' });
    modalVisibleF.value = false; // Cerrar el modal de filtro después de filtrar
  } catch (error) {
    console.error('Error al filtrar jugadores:', error); // 👈 Verifica el error real
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron filtrar los jugadores.' });
  }
}

const eliminarjugadores = async () => {
  if (!seleccionados.value.length) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos un jugador para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionados.value.map(async (jugador) => {
        await send({
          endpoint: `teammember/${jugador.team_member_id}`,
          method: 'delete'
        });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'jugadors eliminados correctamente.' });
    await cargarjugadores();
    seleccionados.value = [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los jugadors.' });
  }
};

onMounted(cargarjugadores);
</script>

<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de jugadores</h2>

      <CModalTeam v-model:visible="modalVisibleC" @create="cargarjugadores" />
      <EModalTeam v-model:visible="modalVisibleE" :jugador="jugadorEditando" @update="cargarjugadores" />
        <FModalTeam v-model:visible="modalVisibleF" @filtrar="filtrarjugadores" @limpiar="cargarjugadores" @cerrar="modalVisibleF = false"   />
      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nuevo jugador" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="eliminarjugadores" />
        <Button label="Filtrar" icon="pi pi-filter" @click="modalVisibleF = true"></Button>
      </div>

      <div class="overflow-x-auto">
        <DataTable :value="jugadores" v-model:selection="seleccionados" selectionMode="multiple" dataKey="team_member_id" :rowHover="true" class="w-full">
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="num_team_member" header="Numero del jugador" />
          <Column field="na_team" header=" Equipo" />
          <Column field="na_person" header=" Nombre" />
          <Column field="ln_person" header=" Apellido" />
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
