<template>
    <div class="card w-full bg-gray-100 flex items-center justify-center">
        <div class="w-full">
            <h2 class="text-2xl font-bold mb-6">Mantenimiento de Usuarios</h2>
            <CModal v-model:visible="modalVisibleC" />
            <EModal v-model:visible="modalVisibleE" />
            <FModal v-model:visible="modalVisibleF" @cerrar="modalVisibleF = false" />

            <div class="flex flex-wrap gap-2 p-5">
                <Button label="Nuevo Usuario" icon="pi pi-plus" @click="abrirCrear" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" />
                <Button label="Filtrar" icon="pi pi-filter-fill" @click="abrirFiltro"></Button>
            </div>
            <div class="overflow-x-auto">
                <DataTable :value="usuariosVisibles" v-model:selection="seleccionados" selectionMode="single" dataKey="id" :rowHover="true" class="w-full">
                    <Column selectionMode="multiple" headerStyle="width: 3rem" />
                    <Column field="username" header="Usuario" />
                    <Column field="email" header="Email" />
                    <Column field="id_persona" header="ID Persona" />
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
import { computed, ref } from 'vue';

import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import CModal from '../components/CModalCU.vue';
import EModal from '../components/EModalCU.vue';
import FModal from '../components/FModalCU.vue'; // Si necesitas el filtro, descomentar esta línea

// Datos simulados
const usuarios = ref([
    { id: 1, username: 'admin', email: 'admin@mail.com', id_persona: 101 },
    { id: 2, username: 'admin2', email: 'admin2@mail.com', id_persona: 102 }
]);

const personas = [
    { id: 101, nombre: 'Juan', apellido: 'Pérez' },
    { id: 102, nombre: 'Ana', apellido: 'Gómez' }
];

const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const usuarioEditando = ref(null);

const formulario = ref({
    username: '',
    password: '',
    email: '',
    id_persona: null
});

const abrirCrear = () => {
    modoEdicion.value = false;
    usuarioEditando.value = null;
    formulario.value = {
        username: '',
        password: '',
        email: '',
        id_persona: null
    };
    modalVisibleC.value = true;
};

const abrirEditar = (usuario) => {
    modoEdicion.value = true;
    usuarioEditando.value = usuario;
    Object.assign(formulario.value, usuario);
    modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//   usuarios.value = usuarios.value.filter(u => u.id !== usuario.id);
// };
const filtroActivo = ref('');

const usuariosConPersona = computed(() =>
    usuarios.value.map((u) => {
        const persona = personas.find((p) => p.id === u.id_persona);
        return {
            ...u,
            nombreCompleto: persona ? `${persona.nombre} ${persona.apellido}` : '—'
        };
    })
);

const usuariosVisibles = computed(() => {
    if (!filtroActivo.value) {
        return usuariosConPersona.value; // sin filtro
    }
    return usuariosConPersona.value.filter((u) => u.nombreCompleto.toLowerCase().includes(filtroActivo.value));
});
const modalVisibleF = ref(false);

const abrirFiltro = () => {
    modalVisibleF.value = true;
};
</script>
