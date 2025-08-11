<template>
  <Dialog
    v-model:visible="visible" header="Filtrar por Persona"
    modal
    :style="{ width: '400px' }"
    class="rounded-md"
  >
    <div class="flex flex-col gap-4">
      <label for="filtro" class="text-sm font-semibold">Nombre o Apellido</label>
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

const personaSeleccionada = ref(null);
const personaOpciones = ref([
  { label: 'Juan Pérez', value: 101 },
  { label: 'Ana Gómez', value: 102 },
  // Agrega más opciones según tus datos
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
  personaSeleccionada.value = null; // Limpiar selección al cerrar
  nombreFiltro.value = ''; // Limpiar filtro
  console.log('Filtro cerrado y limpiado');
};



const limpiar = () => {
  personaSeleccionada.value = null;
  emit('filtrado', null); // también actualiza el filtro en el padre
};

</script>
