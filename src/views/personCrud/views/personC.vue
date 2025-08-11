<template>
  <div class="min-h-screen w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full max-w-6xl bg-white rounded shadow-md py-10 px-4 mx-auto">
      <h2 class="text-2xl font-bold mb-6">Mantenimiento de Personas</h2>
      <CModal v-model:visible="modalVisibleC"/>
      <EModal v-model:visible="modalVisibleE"/>
      <FModal v-model:visible="modalVisibleF" @cerrar="modalVisibleF = false"/>


      <div class="flex flex-wrap gap-2 p-5">
        <Button label="Nueva Persona" icon="pi pi-plus" @click="abrirCrear" />
        <Button label="Eliminar" icon="pi pi-trash" severity="danger"/>
        <Button label="Filtrar" icon="pi pi-filter-fill" @click="abrirFiltro"></Button>
      </div>
      <div class="overflow-x-auto">
        <DataTable
          :value="personasVisibles"
          v-model:selection="seleccionados"
          selectionMode="single"
          dataKey="id"
          :rowHover="true"
          class="w-full"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="name" header="Usuario" />
          <Column field="lastname" header="Email" />
          <Column field="descriptiontp" header="tipo persona" />
          <Column header="Acciones">
            <template #body="{ data }">
              <Button label="editar" icon="pi pi-pencil" class="p-button-sm mr-2" @click="abrirEditar(data)" severity="success"/>
              <!-- <Button label="borrar" icon="pi pi-trash" class="p-button-sm p-button-danger" @click="confirmarEliminar(data)" /> -->
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';


import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import CModal from '../components/CModalP.vue';
import EModal from '../components/EModalP.vue';
import FModal from '../components/FModalP.vue'; // Si necesitas el filtro, descomentar esta línea


// Datos simulados
const person = ref([
  { id: 1, name: 'Juan', lastname: 'Pérez', id_type_person: 101 },
  { id: 2, name: 'Ana', lastname: 'Gómez', id_type_person: 102 },
  { id: 3, name: 'Luis', lastname: 'Martínez', id_type_person: 101 },
]);

const tipo_personas = [
  { id: 101, nombre: 'Estudiante'},
  { id: 102, nombre: 'Profesor',  },
  { id: 103, nombre: 'Administrador'},
];



const modalVisibleC = ref(false);
const modalVisibleE = ref(false);
const seleccionados = ref([]);
const modoEdicion = ref(false);
const personEditando = ref(null);

const formulario = ref({
  name: '',
  lastname: '',
  id_type_person: null,
});

const abrirCrear = () => {
  modoEdicion.value = false;
  personEditando.value = null;
  formulario.value = {
    name: '',
    lastname: '',
    id_type_person: null,
  };
  modalVisibleC.value = true;
};



const abrirEditar = (person) => {
  modoEdicion.value = true;
  personEditando.value = person;
  Object.assign(formulario.value, person);
  modalVisibleE.value = true;
};

// const confirmarEliminar = (usuario) => {
//   usuarios.value = usuarios.value.filter(u => u.id !== usuario.id);
// };
const filtroActivo = ref('');

const usuariosConTipopersona = computed(() =>
  person.value.map((u) => {
    const tipo_persona = tipo_personas.find((p) => p.id === u.id_type_person);
    return {
      ...u,
      descriptiontp: tipo_persona ? `${tipo_persona.nombre}` : '—',
    };
  })
);


const personasVisibles = computed(() => {
  if (!filtroActivo.value) {
    return usuariosConTipopersona.value; // sin filtro
  }
  return usuariosConTipopersona.value.filter(u =>
    u.tipoPersona.toLowerCase().includes(filtroActivo.value)
  );
});
const modalVisibleF = ref(false);

const abrirFiltro = () => {
  modalVisibleF.value = true;
};

</script>
