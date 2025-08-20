<template>
    <Toast />
    <div class="card w-full bg-gray-100 flex items-center justify-center">
        <div class="w-full">
            <h2 class="text-2xl font-bold mb-6">Mantenimiento de Eventos</h2>

            <CModal v-model:visible="modalVisibleC" @create="selectEvents" />
            <EModal v-model:visible="modalVisibleE" :evento="eventoEditando" @update="selectEvents" />

            <div class="flex flex-wrap gap-2 p-5">
                <Button label="Nuevo Evento" icon="pi pi-plus" @click="abrirCrear" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="DeleteEvent" />
            </div>

            <div class="overflow-x-auto">
                <DataTable :value="eventos" v-model:selection="seleccionados" selectionMode="multiple" dataKey="event_id"
                    :rowHover="true" class="w-full">
                    <Column selectionMode="multiple" headerStyle="width: 3rem" />
                    <Column field="na_event" header="Nombre del Evento" />
                    <Column header="Acciones">
                        <template #body="{ data }">
                            <Button label="Editar" icon="pi pi-pencil" class="p-button-sm mr-2"
                                @click="abrirModalEdicion(data)" severity="success" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import { send } from '@/api/send';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';
import CModal from '../components/CmodalEv.vue';
import EModal from '../components/EmodalEv.vue';

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const eventos = ref([]);

const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const eventoEditando = ref(null);

const abrirCrear = () => {
    eventoEditando.value = null;
    modalVisibleC.value = true;
};

const abrirModalEdicion = (evento) => {
    if (evento) {
        eventoEditando.value = evento;
        modalVisibleE.value = true;
    } else {
        toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona un evento para editar.' });
    }
};

const selectEvents = async () => {
    try {
        const data = await send({
            endpoint: 'event',
            method: 'GET',
            body: null
        });

        eventos.value = data.data || [];
    } catch (err) {
        console.error('Error al cargar eventos:', err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los eventos.' });
    }
};

const DeleteEvent = async () => {
    if (!seleccionados.value || seleccionados.value.length === 0) {
        toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos un evento para eliminar.' });
        return;
    }

    try {
        await Promise.all(
            seleccionados.value.map(async (evento) => {
                await send({
                    endpoint: `event/${evento.event_id}`,
                    method: 'delete'
                });
            })
        );
        toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Eventos eliminados correctamente.' });
        await selectEvents();
        seleccionados.value = [];
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los eventos.' });
    }
};

onMounted(async () => {
    await selectEvents();
});
</script>
