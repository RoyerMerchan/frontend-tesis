<template>
  <Dialog
    v-model:visible="visible" header="Filtrar por deporte o institución"
    modal
    :style="{ width: '400px' }"
    class="rounded-md"
  >
    <div class="flex flex-col gap-4">
      <label for="filtro" class="text-sm font-semibold">opciones</label>
      <Select
  v-model="deporteSeleccionada"
  :options="deporteOpciones"
  optionLabel="label"
  optionValue="value"
  placeholder="Selecciona deporte"
  class="w-full"
/>
  <Select
  v-model="institucionSeleccionada"
  :options="institucionOpciones"
  optionLabel="label"
  optionValue="value"
  placeholder="Selecciona institucion"
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

const deporteSeleccionada = ref(null);
const deporteOpciones = ref([
  { label: 'Fútbol', value: 1 },
  { label: 'Baloncesto', value: 2 },
  { label: 'Tenis', value: 3 },
  { label: 'Natación', value: 4 },
  { label: 'Atletismo', value: 5 }
]);

const institucionSeleccionada = ref(null);
const institucionOpciones = ref([
  { label: 'Institución A', value: 1 },
  { label: 'Institución B', value: 2 },
  { label: 'Institución C', value: 3 }
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
  deporteSeleccionada.value = null;// Limpiar selección al cerrar
  institucionSeleccionada.value = null; // Limpiar selección al cerrar
  nombreFiltro.value = ''; // Limpiar filtro
  console.log('Filtro cerrado y limpiado');
};



const limpiar = () => {
  deporteSeleccionada.value = null;
  institucionSeleccionada.value = null; // Limpiar selección
  nombreFiltro.value = ''; // Limpiar filtro
  console.log('Filtro limpiado');
  emit('filtrado', null); // también actualiza el filtro en el padre
};

</script>
