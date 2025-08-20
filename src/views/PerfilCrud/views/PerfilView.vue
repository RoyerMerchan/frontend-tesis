<script setup>
import { onMounted, ref } from 'vue';

import { send } from '@/api/send';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';

import CModalPerfil from '../components/CmodalPe.vue';
import EModalPerfil from '../components/EmodalPe.vue';

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const perfiles = ref([]);
const seleccionados = ref([]);
const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const perfilEditando = ref(null);

const abrirCrear = () => {
  perfilEditando.value = null;
  modalVisibleC.value = true;
};

const abrirEdicion = (perfil) => {
  if (perfil) {
    perfilEditando.value = perfil;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona un perfil para editar.' });
  }
};

const cargarPerfiles = async () => {
  try {
    const response = await send({
      endpoint: 'profile',
      method: 'get'
    });
    perfiles.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar perfiles:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los perfiles.' });
  }
};

const eliminarPerfiles = async () => {
  if (!seleccionados.value.length) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos un perfil para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionados.value.map(async (perfil) => {
        await send({
          endpoint: `profile/${perfil.profile_id}`,
          method: 'delete'
        });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Perfiles eliminados correctamente.' });
    await cargarPerfiles();
    seleccionados.value = [];
  } catch (error) {
    console.error('Error al eliminar perfiles:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los perfiles.' });
  }
};

onMounted(cargarPerfiles);
</script>

<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Perfiles</h2>

      <CModalPerfil v-model:visible="modalVisibleC" @create="cargarPerfiles" />
      <EModalPerfil v-model:visible="modalVisibleE" :perfil="perfilEditando" @update="cargarPerfiles" />

      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nuevo Perfil" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="eliminarPerfiles" />
      </div>

      <div class="overflow-x-auto">
        <DataTable :value="perfiles" v-model:selection="seleccionados" selectionMode="multiple" dataKey="profile_id" :rowHover="true" class="w-full">
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="profile_de" header="Descripción del Perfil" />
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
