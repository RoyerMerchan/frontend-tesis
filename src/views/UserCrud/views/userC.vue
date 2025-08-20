<script setup>
import { onMounted, ref } from 'vue';

import { send } from '@/api/send';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';
import CModal from '../components/CModalCU.vue';
import EModal from '../components/EModalCU.vue';
import FModal from '../components/FModalCU.vue'; // Si necesitas el filtro, descomentar esta línea

import { useToast } from 'primevue/usetoast';

const toast = useToast();


const usuarios = ref([]);

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

const abrirModalEdicion = (usuario) => {
  if (usuario) {
    usuarioEditando.value = usuario;
    modalVisibleE.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona un usuario para editar.' });
  }
};


// const confirmarEliminar = (usuario) => {
//   usuarios.value = usuarios.value.filter(u => u.id !== usuario.id);
// };

const modalVisibleF = ref(false);

const abrirFiltro = () => {
    modalVisibleF.value = true;
};
const selectUsers = async () => {
    try {
        const data = await send({
            endpoint: 'user/all',
            method: 'GET',
            body: null
        });

        usuarios.value = data.data || [];
    } catch (err) {
        console.error('Error al cargar usuarios:', err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios.' });
    }
};

onMounted(async () => {
    await selectUsers();
});

const filtrarPorPerfil = async (idPerfil) => {
  try {
    const response = await send({
      endpoint: `user/perfilP/${idPerfil}`, // ajustá el endpoint si es distinto
      method: 'get'
    });
    usuarios.value = response.data || []; // reemplazás la lista actual
  } catch (error) {
    console.error('Error al filtrar usuarios:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo filtrar por perfil.' });
  }
};

const DeleteUser = async () => {
  if (!seleccionados.value || seleccionados.value.length === 0) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona al menos un usuario para eliminar.' });
    return;
  }

  try {
    // Eliminar todos los seleccionados en paralelo
    await Promise.all(
      seleccionados.value.map(async (usuario) => {
        await send({
          endpoint: `user/${usuario.user_id}`,
          method: 'delete'
        });
      })
    );
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Usuarios eliminados correctamente.' });
    await selectUsers(); // refrescar tabla
    seleccionados.value = []; // deseleccionar todo
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los usuarios.' });
  }
};
</script>

<template>
    <Toast />
    <div class="card w-full bg-gray-100 flex items-center justify-center">
        <div class="w-full">
            <h2 class="text-2xl font-bold mb-6">Mantenimiento de Usuarios</h2>
            <CModal v-model:visible="modalVisibleC" @create="selectUsers" />
            <EModal v-model:visible="modalVisibleE" :usuario="usuarioEditando" @update="selectUsers" />
            <FModal v-model:visible="modalVisibleF" @filtrar="filtrarPorPerfil"  @limpiar="selectUsers" @cerrar="modalVisibleF = false" />

            <div class="flex flex-wrap gap-2 p-5">
                <Button label="Nuevo Usuario" icon="pi pi-plus" @click="abrirCrear" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="DeleteUser" />
                <Button label="Filtrar" icon="pi pi-filter" @click="abrirFiltro"></Button>
            </div>
            <div class="overflow-x-auto">
                <DataTable :value="usuarios" v-model:selection="seleccionados" selectionMode="multiple" dataKey="user_id"
                    :rowHover="true" class="w-full">
                    <Column selectionMode="multiple" headerStyle="width: 3rem" />
                    <Column field="na_user" header="Usuario" />
                    <Column field="em_user" header="Email" />
                    <Column header="Acciones">
                        <template #body="{ data }">
                            <Button label="editar" icon="pi pi-pencil" class="p-button-sm mr-2"
                                @click="abrirModalEdicion(data)" severity="success" />
                            <!-- <Button label="borrar" icon="pi pi-trash" class="p-button-sm p-button-danger" @click="confirmarEliminar(data)" /> -->
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
