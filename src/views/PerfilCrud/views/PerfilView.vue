<template>
    <div class="card w-full bg-gray-100 flex items-center justify-center">
        <div class="w-full">
            <h2 class="text-2xl font-bold mb-6">Mantenimiento de Perfil</h2>
            <CModal v-model:visible="modalVisibleC" />
            <EModal v-model:visible="modalVisibleE" />

            <div class="flex flex-wrap gap-2 p-5">
                <Button label="Nuevo Perfil" icon="pi pi-plus" @click="abrirCrear" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" />
            </div>
            <div class="overflow-x-auto">
                <DataTable :value="PerfilesVisibles" v-model:selection="seleccionados" selectionMode="single" dataKey="id" :rowHover="true" class="w-full">
                    <Column selectionMode="multiple" headerStyle="width: 3rem" />
                    <Column field="de_perfil" header="Descripcion Perfil" />
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
import CModal from '../components/CmodalPe.vue';
import EModal from '../components/EmodalPe.vue';
// import FModal from '../components/FModalCU.vue'; // Si necesitas el filtro, descomentar esta línea

// Datos simulados
const perfil = ref([
    { id: 1, de_perfil: 'Administrador' },
    { id: 2, de_perfil: 'Usuario' },
    { id: 3, de_perfil: 'Invitado' }
]);
const PerfilesVisibles = ref(perfil);

const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const perfilEditando = ref(null);

const formulario = ref({
    de_perfil: ''
});

const abrirCrear = () => {
    modoEdicion.value = false;
    perfilEditando.value = null;
    formulario.value = {
        de_perfil: ''
    };
    modalVisibleC.value = true;
};

const abrirEditar = (event) => {
    modoEdicion.value = true;
    perfilEditando.value = event;
    Object.assign(formulario.value, event);
    modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//  Perfiles.value = usuarios.value.filter(u => u.id !== usuario.id);
// };
</script>
