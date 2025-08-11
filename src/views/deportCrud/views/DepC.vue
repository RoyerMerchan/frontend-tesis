<template>
    <div class="card w-full bg-gray-100 flex items-center justify-center">
        <div class="w-full">
            <h2 class="text-2xl font-bold mb-6">Mantenimiento de Deportes</h2>
            <CModal v-model:visible="modalVisibleC" />
            <EModal v-model:visible="modalVisibleE" />

            <div class="flex flex-wrap gap-2 p-5">
                <Button label="Nuevo Deporte" icon="pi pi-plus" @click="abrirCrear" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" />
            </div>
            <div class="overflow-x-auto">
                <DataTable :value="sportVisibles" v-model:selection="seleccionados" selectionMode="single" dataKey="id" :rowHover="true" class="w-full">
                    <Column selectionMode="multiple" headerStyle="width: 3rem" />
                    <Column field="nombre" header="Nombre Deporte" />
                    <Column field="descripcion" header="Descripcion" />
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
import CModal from '../components/CmodalD.vue';
import EModal from '../components/EmodalD.vue';
// import FModal from '../components/FModalCU.vue'; // Si necesitas el filtro, descomentar esta línea

// Datos simulados
const sport = ref([
    { id: 1, nombre: 'futbol', descripcion: 'Deporte con el pie' },
    { id: 2, nombre: 'Basket', descripcion: 'Deporte Con la mano' },
    { id: 3, nombre: 'voleyball', descripcion: 'Deporte con malla' }
]);
const sportVisibles = ref(sport);

const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const sportEditando = ref(null);

const formulario = ref({
    descripcion: ''
});

const abrirCrear = () => {
    modoEdicion.value = false;
    sportEditando.value = null;
    formulario.value = {
        descripcion: ''
    };
    modalVisibleC.value = true;
};

const abrirEditar = (sp) => {
    modoEdicion.value = true;
    sportEditando.value = sp;
    Object.assign(formulario.value, sp);
    modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//   usuarios.value = usuarios.value.filter(u => u.id !== usuario.id);
// };
</script>
