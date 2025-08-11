<template>
    <div class="card w-full bg-gray-100 flex items-center justify-center">
        <div class="w-full">
            <h2 class="text-2xl font-bold mb-6">Mantenimiento de alineacion</h2>
            <CModal v-model:visible="modalVisibleC" />
            <EModal v-model:visible="modalVisibleE" />
            <FModal v-model:visible="modalVisibleF" @cerrar="modalVisibleF = false" />

            <div class="flex flex-wrap gap-2 p-5">
                <Button label="Nueva alineacion" icon="pi pi-plus" @click="abrirCrear" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" />
                <Button label="Filtrar" icon="pi pi-filter-fill" @click="abrirFiltro"></Button>
            </div>
            <div class="overflow-x-auto">
                <DataTable :value="lineupVisibles" v-model:selection="seleccionados" selectionMode="single" dataKey="id" :rowHover="true" class="w-full">
                    <Column selectionMode="multiple" headerStyle="width: 3rem" />
                    <Column field="description" header="descripcion" />
                    <Column field="position" header="posicion" />
                    <Column field="competition" header="competicion" />
                    <Column field="type_position" header="tipo posicion" />
                    <Column field="player" header="jugador" />

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
import CModal from '../components/CModalLU.vue';
import EModal from '../components/EModalLU.vue';
import FModal from '../components/FModalLU.vue'; // Si necesitas el filtro, descomentar esta línea

// Datos simulados
const lineup = ref([
    { id: 1, description: 'Alineación A', position: 115, competition: 101, type_position: 111, person: 106 },
    { id: 2, description: 'Alineación B', position: 116, competition: 102, type_position: 112, person: 107 },
    { id: 3, description: 'Alineación C', position: 117, competition: 103, type_position: 113, person: 108 }
]);

const competition = [
    { id: 101, nombre: 'Competición A' },
    { id: 102, nombre: 'Competición B' },
    { id: 103, nombre: 'Competición C' },
    { id: 104, nombre: 'Competición D' },
    { id: 105, nombre: 'Competición E' }
];

const player = [
    { id: 106, nombre: 'Jugador A' },
    { id: 107, nombre: 'Jugador B' },
    { id: 108, nombre: 'Jugador C' },
    { id: 109, nombre: 'Jugador D' },
    { id: 110, nombre: 'Jugador E' }
];

const type_position = [
    { id: 111, nombre: 'Delantero' },
    { id: 112, nombre: 'Centrocampista' },
    { id: 113, nombre: 'Defensa' },
    { id: 114, nombre: 'Portero' }
];

const position = [
    { id: 115, nombre: 'Delantero Centro' },
    { id: 116, nombre: 'Extremo Izquierdo' },
    { id: 117, nombre: 'Extremo Derecho' },
    { id: 118, nombre: 'Mediocampista Ofensivo' },
    { id: 119, nombre: 'Mediocampista Defensivo' },
    { id: 120, nombre: 'Defensa Central' },
    { id: 121, nombre: 'Lateral Izquierdo' },
    { id: 122, nombre: 'Lateral Derecho' },
    { id: 123, nombre: 'Portero' }
];

const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const lineupEditando = ref(null);

const formulario = ref({
    id: null,
    description: '',
    position: null,
    competition: null,
    type_position: null,
    person: null
});

const abrirCrear = () => {
    modoEdicion.value = false;
    lineupEditando.value = null;
    formulario.value = {
        id: null,
        description: '',
        position: null,
        competition: null,
        type_position: null,
        person: null
    };
    modalVisibleC.value = true;
};

const abrirEditar = (tc) => {
    modoEdicion.value = true;
    lineupEditando.value = tc;
    Object.assign(formulario.value, tc);
    modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//   tc.value = tc.value.filter(u => u.id !== usuario.id);
// };
const filtroActivo = ref('');

const teamConRel = computed(() =>
    lineup.value.map((u) => {
        const type_positionData = type_position.find((p) => p.id === u.type_position);
        const playerData = player.find((p) => p.id === u.person);
        const competitionData = competition.find((c) => c.id === u.competition);
        const positionData = position.find((p) => p.id === u.position);

        return {
            ...u,
            type_position: type_positionData ? `${type_positionData.nombre} ` : '—',
            position: positionData ? `${positionData.nombre} ` : '—',
            player: playerData ? `${playerData.nombre} ` : '—',
            competition: competitionData ? `${competitionData.nombre} ` : '—'
        };
    })
);

const lineupVisibles = computed(() => {
    if (!filtroActivo.value) {
        return teamConRel.value; // sin filtro
    }
    return teamConRel.value.filter((u) => u.nombreCompleto.toLowerCase().includes(filtroActivo.value));
});
const modalVisibleF = ref(false);

const abrirFiltro = () => {
    modalVisibleF.value = true;
};
</script>
