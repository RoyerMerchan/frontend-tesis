<template>
    <div class="card w-full bg-gray-100 flex items-center justify-center">
        <div class="w-full">
            <h2 class="text-2xl font-bold mb-6">Mantenimiento de Tipo Persona</h2>
            <CModal v-model:visible="modalVisibleC" @create= "selectTypePersons" />
            <EModal v-model:visible="modalVisibleE" :tipo="tpEditando" @update="selectTypePersons"/>

            <div class="flex flex-wrap gap-2 p-5">
                <Button label="Nuevo TipePerson" icon="pi pi-plus" @click="abrirCrear" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="DeleteTypePerson" />
            </div>
            <div class="overflow-x-auto">
                <DataTable :value="tpVisibles" v-model:selection="seleccionados" selectionMode="multiple" dataKey="type_person_id" :rowHover="true" class="w-full">
                    <Column selectionMode="multiple" headerStyle="width: 3rem" />
                    <Column field="de_type_person" header="Descripcion" />
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
import { ref, onMounted } from 'vue';
import { send } from '@/api/send';
import { useToast } from 'primevue/usetoast';

import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import CModal from '../components/CModalTP.vue';
import EModal from '../components/EModalTP.vue';
// import FModal from '../components/FModalCU.vue'; // Si necesitas el filtro, descomentar esta línea

const formulario = ref({
    descripcion: ''
});

const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const tpEditando = ref(null);

const tpVisibles = ref([]);
const toast = useToast();

const selectTypePersons = async () => {
    try {
        const response = await send({
            endpoint: 'typeperson',
            method: 'get'
        });
        console.log('Tipos de persona:', response.data);
        tpVisibles.value = response.data || [];
    } catch (error) {
        console.error('Error al cargar tipos de persona:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de persona.' });
    }
};

onMounted(async() => {
    await selectTypePersons();
});



const abrirCrear = () => {
    modoEdicion.value = false;
    tpEditando.value = null;
    formulario.value = {
        descripcion: ''
    };
    modalVisibleC.value = true;
};

const abrirEditar = (tp) => {
    if (tp) {
        tpEditando.value = tp;
        modalVisibleE.value = true;
    } else {
        toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona un tipo de persona para editar.' });
    }
};

const DeleteTypePerson = async () => {
    console.log('Seleccionados para eliminar:', seleccionados.value);

  if (!seleccionados.value || seleccionados.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Atención',
      detail: 'Selecciona al menos un tipo de persona para eliminar.'
    });
    return;
  }

  try {
    // Eliminar todos los seleccionados en paralelo
    await Promise.all(
      seleccionados.value.map(async (tipo) => {
        await send({
          endpoint: `typeperson/${tipo.type_person_id}`, // usa el ID correcto
          method: 'delete'
        });
      })
    );

    toast.add({
      severity: 'success',
      summary: 'Eliminado',
      detail: 'Tipos de persona eliminados correctamente.'
    });

    await selectTypePersons(); // refrescar tabla
    seleccionados.value = []; // deseleccionar todo
  } catch (error) {
    console.error('Error al eliminar tipo de persona:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron eliminar todos los tipos de persona.'
    });
  }
};



// const confirmarEliminar = (usuario) => {
//   usuarios.value = usuarios.value.filter(u => u.id !== usuario.id);
// };
</script>
