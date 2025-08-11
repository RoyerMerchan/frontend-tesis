<template>
  <Dialog
    v-model:visible="visible" header="Filtrar por competición, posicion o jugador"
    modal
    :style="{ width: '400px' }"
    class="rounded-md"
  >
    <div class="flex flex-col gap-4">
      <label for="filtro" class="text-sm font-semibold">opciones</label>

      <Select
  v-model="eventoSeleccionado"
  :options="evento"
  optionLabel="label"
  optionValue="value"
  placeholder="Selecciona evento"
  class="w-full"
/>
  <Select
  v-model="lugareventoSeleccionado"
  :options="lugar_evento"
  optionLabel="label"
  optionValue="value"
  placeholder="Selecciona lugar evento"
  class="w-full"
/>

<Select
  v-model="tipocompetenciaSeleccionada"
  :options="tipo_competencia"
  optionLabel="label"
  optionValue="value"
  placeholder="Selecciona tipo competencia"
  class="w-full"
/>


      <div class="flex justify-end gap-2 mt-4">
        <Button
          label="Cancelar"
          severity="warn"
          @click="cerrar"
        />
        <Button
          label="Filtrar"
          icon="pi pi-search"
          severity="primary"
          @click="filtrar"
        />
        <Button label="Limpiar filtro" severity="danger" icon="pi pi-times" @click="limpiar" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
// import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';
import { defineModel, defineEmits } from 'vue';

// const props = defineProps({
//   personaSeleccionada: {
//     type: Number, // o String si usas nombres directamente
//     required: false
//   }
// });

const eventoSeleccionado = ref(null);
const evento = ref([
  { label: 'Evento A', value: 1 },
  { label: 'Evento B', value: 2 },
  { label: 'Evento C', value: 3 },
  { label: 'Evento D', value: 4 },
  { label: 'Evento E', value: 5 }
]);
const lugareventoSeleccionado = ref(null);
const lugar_evento = ref([
  { label: 'Lugar A', value: 1 },
  { label: 'Lugar B', value: 2 },
  { label: 'Lugar C', value: 3 },
  { label: 'Lugar D', value: 4 },
  { label: 'Lugar E', value: 5 }
]);
const tipocompetenciaSeleccionada = ref(null);
const tipo_competencia = ref([
  { label: 'Competencia A', value: 1 },
  { label: 'Competencia B', value: 2 },
  { label: 'Competencia C', value: 3 },
  { label: 'Competencia D', value: 4 },
  { label: 'Competencia E', value: 5 }
]);


const visible = defineModel('visible');
const emit = defineEmits(['filtrado', 'cerrar']);

const nombreFiltro = ref('');

const filtrar = () => {
  emit('filtrado', nombreFiltro.value.trim().toLowerCase());
  console.log('Filtrando por:', nombreFiltro.value);
};

const cerrar = () => {
  emit('cerrar');
  eventoSeleccionado.value = null; // Limpiar selección al cerrar
  lugareventoSeleccionado.value = null; // Limpiar selección al cerrar
  tipocompetenciaSeleccionada.value = null; // Limpiar selección al cerrar
  nombreFiltro.value = ''; // Limpiar filtro
  console.log('Filtro cerrado y limpiado');
};



const limpiar = () => {
  eventoSeleccionado.value = null;
  lugareventoSeleccionado.value = null; // Limpiar selección
  tipocompetenciaSeleccionada.value = null; // Limpiar selección
  nombreFiltro.value = ''; // Limpiar filtro
  console.log('Filtro limpiado');
  emit('filtrado', null); // también actualiza el filtro en el padre
};

</script>
