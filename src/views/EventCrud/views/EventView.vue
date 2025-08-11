<template>
    <div class="card w-full bg-gray-100 flex items-center justify-center">
        <div class="w-full">
            <h2 class="text-2xl font-bold mb-6">Mantenimiento de Evento</h2>
            <CModal v-model:visible="modalVisibleC" />
            <EModal v-model:visible="modalVisibleE" />

            <div class="flex flex-wrap gap-2 p-5">
                <Button label="Nuevo Evento" icon="pi pi-plus" @click="abrirCrear" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" />
            </div>
            <div class="overflow-x-auto">
                <DataTable :value="usuariosVisibles" v-model:selection="seleccionados" selectionMode="single" dataKey="id" :rowHover="true" class="w-full">
                    <Column selectionMode="multiple" headerStyle="width: 3rem" />
                    <Column field="name_event" header="Nombre Evento" />
                    <Column header="Acciones">
                        <template #body="{ data }">
                            <Button label="editar" icon="pi pi-pencil" class="p-button-sm mr-2" @click="abrirEditar(data)" severity="success" />
                            <!-- <Button label="borrar" icon="pi pi-trash" class="p-button-sm p-button-danger" @click="confirmarEliminar(data)" /> -->
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import CModal from '../components/CmodalEv.vue';
import EModal from '../components/EmodalEv.vue';
// import FModal from '../components/FModalCU.vue'; // Si necesitas el filtro, descomentar esta línea

// Datos simulados
const event = ref([
    { id: 1, name_event: 'uruleague' },
    { id: 2, name_event: 'padeluru' },
    { id: 3, name_event: 'basketsportleague' }
]);
const usuariosVisibles = ref(event);

const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const usuarioEditando = ref(null);

const formulario = ref({
    name_event: ''
});

const abrirCrear = () => {
    modoEdicion.value = false;
    usuarioEditando.value = null;
    formulario.value = {
        descripcion: ''
    };
    modalVisibleC.value = true;
};

const abrirEditar = (event) => {
    modoEdicion.value = true;
    usuarioEditando.value = event;
    Object.assign(formulario.value, event);
    modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//   usuarios.value = usuarios.value.filter(u => u.id !== usuario.id);
// };
</script>
