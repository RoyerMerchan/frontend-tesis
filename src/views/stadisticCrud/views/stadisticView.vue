<template>
    <div class="card w-full bg-gray-100 flex items-center justify-center">
        <div class="w-full">
            <h2 class="text-2xl font-bold mb-6">Mantenimiento de estadisticas</h2>
            <CModal v-model:visible="modalVisibleC" />
            <EModal v-model:visible="modalVisibleE" />
            <FModal v-model:visible="modalVisibleF" @cerrar="modalVisibleF = false" />

            <div class="flex flex-wrap gap-2 p-5">
                <Button label="Nueva estadistica" icon="pi pi-plus" @click="abrirCrear" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" />
                <Button label="Filtrar" icon="pi pi-filter-fill" @click="abrirFiltro"></Button>
            </div>
            <div class="overflow-x-auto">
                <DataTable :value="stadisticVisibles" v-model:selection="seleccionados" selectionMode="single" dataKey="id" :rowHover="true" class="w-full">
                    <Column selectionMode="multiple" headerStyle="width: 3rem" />
                    <Column field="stadistic_concept" header="concepto estadistico" />
                    <Column field="player" header="jugador" />
                    <Column field="competition" header="competicion" />
                    <Column field="stadistic" header="estadistica" />
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
import CModal from '../components/CModalS.vue';
import EModal from '../components/EModalS.vue';
import FModal from '../components/FModalS.vue'; // Si necesitas el filtro, descomentar esta línea

// Datos simulados
const stadistic = ref([
    { id: 1, id_stadistic_concept: 111, id_player: 106, id_competition: 101, stadistic: '10 goles' },
    { id: 2, id_stadistic_concept: 112, id_player: 107, id_competition: 102, stadistic: '5 asistencias' },
    { id: 3, id_stadistic_concept: 113, id_player: 108, id_competition: 103, stadistic: '3 tarjetas amarillas' }
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

const stadistic_concept = [
    { id: 111, concepto: 'Goles' },
    { id: 112, concepto: 'Asistencias' },
    { id: 113, concepto: 'Tarjetas Amarillas' },
    { id: 114, concepto: 'Tarjetas Rojas' },
    { id: 115, concepto: 'Faltas Cometidas' },
    { id: 116, concepto: 'Faltas Recibidas' },
    { id: 117, concepto: 'Pases Completados' },
    { id: 118, concepto: 'Pases Fallidos' },
    { id: 119, concepto: 'Tiros a Puerta' }
];

const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const stadisticEditando = ref(null);

const formulario = ref({
    name: '',
    id_sport: null,
    id_institucion: null
});

const abrirCrear = () => {
    modoEdicion.value = false;
    stadisticEditando.value = null;
    formulario.value = {
        id_stadistic_concept: null,
        id_player: null,
        id_competition: null,
        stadistic: ''
    };
    modalVisibleC.value = true;
};

const abrirEditar = (tc) => {
    modoEdicion.value = true;
    stadisticEditando.value = tc;
    Object.assign(formulario.value, tc);
    modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//   tc.value = tc.value.filter(u => u.id !== usuario.id);
// };
const filtroActivo = ref('');

const teamConRel = computed(() =>
    stadistic.value.map((u) => {
        const stadistic_conceptData = stadistic_concept.find((p) => p.id === u.id_stadistic_concept);
        const playerData = player.find((i) => i.id === u.id_player);
        const competitionData = competition.find((c) => c.id === u.id_competition);

        return {
            ...u,
            stadistic_concept: stadistic_conceptData ? `${stadistic_conceptData.concepto} ` : '—',
            player: playerData ? `${playerData.nombre} ` : '—',
            competition: competitionData ? `${competitionData.nombre} ` : '—'
        };
    })
);

const stadisticVisibles = computed(() => {
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
