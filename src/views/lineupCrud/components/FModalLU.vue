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
  v-model="competitionSeleccionada"
  :options="competitionopciones"
  optionLabel="label"
  optionValue="value"
  placeholder="Selecciona competición"
  class="w-full"
/>
  <Select
  v-model="posicionSeleccionado"
  :options="posicionopciones"
  optionLabel="label"
  optionValue="value"
  placeholder="Selecciona concepto"
  class="w-full"
/>

<Select
  v-model="jugadorSeleccionado"
  :options="jugadoropciones"
  optionLabel="label"
  optionValue="value"
  placeholder="Selecciona jugador"
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

const competitionSeleccionada = ref(null);
const competitionopciones = ref([
  { label: 'Competición A', value: 1 },
  { label: 'Competición B', value: 2 },
  { label: 'Competición C', value: 3 },
  { label: 'Competición D', value: 4 },
  { label: 'Competición E', value: 5 }
]);
const posicionSeleccionado = ref(null);
const posicionopciones = ref([
  { label: 'Portero', value: 1 },
  { label: 'Defensa', value: 2 },
  { label: 'Centrocampista', value: 3 },
  { label: 'Delantero', value: 4 },
  { label: 'Suplente', value: 5 }
]);
const jugadorSeleccionado = ref(null);
const jugadoropciones = ref([
  { label: 'Jugador A', value: 1 },
  { label: 'Jugador B', value: 2 },
  { label: 'Jugador C', value: 3 },
  { label: 'Jugador D', value: 4 },
  { label: 'Jugador E', value: 5 }
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
  competitionSeleccionada.value = null;// Limpiar selección al cerrar
  posicionSeleccionado.value = null; // Limpiar selección al cerrar
  jugadorSeleccionado.value = null; // Limpiar selección al cerrar
  nombreFiltro.value = ''; // Limpiar filtro
  console.log('Filtro cerrado y limpiado');
};



const limpiar = () => {
  competitionSeleccionada.value = null;
  posicionSeleccionado.value = null; // Limpiar selección
  jugadorSeleccionado.value = null; // Limpiar selección
  nombreFiltro.value = ''; // Limpiar filtro
  console.log('Filtro limpiado');
  emit('filtrado', null); // también actualiza el filtro en el padre
};

</script>
