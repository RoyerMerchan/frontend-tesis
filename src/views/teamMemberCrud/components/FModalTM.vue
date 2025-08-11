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
  v-model="equipoSeleccionada"
  :options="equipoOpciones"
  optionLabel="label"
  optionValue="value"
  placeholder="Selecciona equipo"
  class="w-full"
/>
  <Select
  v-model="personaSeleccionada"
  :options="personaOpciones"
  optionLabel="label"
  optionValue="value"
  placeholder="Selecciona persona"
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

const equipoSeleccionada = ref(null);
const equipoOpciones = ref([
  { label: 'Equipo A', value: 1 },
  { label: 'Equipo B', value: 2 },
  { label: 'Equipo C', value: 3 }
]);

const personaSeleccionada = ref(null);
const personaOpciones = ref([
  { label: 'Persona A', value: 101 },
  { label: 'Persona B', value: 102 },
  { label: 'Persona C', value: 103 },
  { label: 'Persona D', value: 104 },
  { label: 'Persona E', value: 105 }
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
  equipoSeleccionada.value = null;// Limpiar selección al cerrar
  personaSeleccionada.value = null; // Limpiar selección al cerrar
  nombreFiltro.value = ''; // Limpiar filtro
  console.log('Filtro cerrado y limpiado');
};



const limpiar = () => {
  equipoSeleccionada.value = null;
  personaSeleccionada.value = null; // Limpiar selección
  nombreFiltro.value = ''; // Limpiar filtro
  console.log('Filtro limpiado');
  emit('filtrado', null); // también actualiza el filtro en el padre
};

</script>
