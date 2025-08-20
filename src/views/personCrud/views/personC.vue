<script setup>
import { onMounted, ref } from 'vue';

import { send } from '@/api/send';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';

import CModalPerson from '../components/CModalP.vue';
import EModalPerson from '../components/EModalP.vue';
import FModalPerson from '../components/FModalP.vue'; // Si necesitas el filtro, descomentar esta línea

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const personas = ref([]);
const seleccionadas = ref([]);
const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const modalVisibleF = ref(false); // Si necesitas el filtro, descomentar esta línea
const personaEditando = ref(null);

const abrirCrear = () => {
  personaEditando.value = null;
  modalVisibleC.value = true;
};

const abrirEdicion = (persona) => {
  if (persona) {
    personaEditando.value = persona;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona una persona para editar.' });
  }
};

const filtrarPorTipoPersona = async (id_type_person) => {
  try {
    const response = await send({
      endpoint: `person/persontp/${id_type_person}`,
      method: 'get'
    });
    personas.value = response.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las personas.' });
  }
};

const cargarPersonas = async () => {
  try {
    const response = await send({
      endpoint: 'person',
      method: 'get'
    });
    personas.value = response.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las personas.' });
  }
};

const eliminarPersonas = async () => {
  if (!seleccionadas.value.length) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos una persona para eliminar.' });
    return;
  }

  try {
    await Promise.all(
      seleccionadas.value.map(async (persona) => {
        await send({
          endpoint: `person/${persona.person_id}`,
          method: 'delete'
        });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Personas eliminadas correctamente.' });
    await cargarPersonas();
    seleccionadas.value = [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todas las personas.' });
  }
};

onMounted(cargarPersonas);
</script>

<template>
  <Toast />
  <div class="card w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Personas</h2>

      <CModalPerson v-model:visible="modalVisibleC" @create="cargarPersonas" />
      <EModalPerson v-model:visible="modalVisibleE" :persona="personaEditando" @update="cargarPersonas" />
      <FModalPerson v-model:visible="modalVisibleF" @filtrar="filtrarPorTipoPersona" @limpiar="cargarPersonas" @cerrar="modalVisibleF = false"/> <!-- Si necesitas el filtro, descomentar esta línea -->

      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nueva Persona" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="eliminarPersonas" />
        <Button label="Filtrar" icon="pi pi-filter" @click="modalVisibleF = true" /> <!-- Si necesitas el filtro, descomentar esta línea -->
      </div>

      <div class="overflow-x-auto">
        <DataTable :value="personas" v-model:selection="seleccionadas" selectionMode="multiple" dataKey="person_id" :rowHover="true" class="w-full">
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="na_person" header="Nombre" />
          <Column field="ln_person" header="Apellido" />
          <Column field="de_type_person" header="Tipo de Persona" />
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
