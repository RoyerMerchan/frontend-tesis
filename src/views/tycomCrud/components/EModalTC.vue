<template>
<Dialog v-model:visible="visible" header="Editar tipo competencia" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="na_type_competency" class="text-left">nombre tipo competencia</label>
      <Field name="na_type_competency" v-slot="{ field }">
        <InputText v-bind="field" id="na_type_competency" placeholder="Ingrese nombre" class="w-full" />
      </Field>
      <ErrorMessage name="na_type_competency" class="text-red-500 text-xs" />
    </div>



    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="id_sport" class="text-left">deporte</label>
      <Field name="id_sport" v-slot="{ field }">
        <Select
          v-bind="field"
          :options="tiposDeporte"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="id_sport"
        />
      </Field>
      <ErrorMessage name="id_sport" class="text-red-500 text-xs" />
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-2 mt-4">
      <Button label="Cancelar" severity="secondary" @click="visible = false" />
      <Button :label="modoEdicion ? 'Actualizar' : 'Guardar'" type="submit" />
    </div>


  </div>

    </Form>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { Select } from 'primevue';



const visible = defineModel('visible');

// 🆕 Nuevas props
const props = defineProps({
  modoEdicion: Boolean,
  usuarioEditando: Object,
});

const form = ref({
  na_type_competency: '',
  id_sport: null,
});

// 🧠 Rellenar campos si hay usuario a editar
watch(() => props.tcEditando, (usuario) => {
  if (props.modoEdicion && usuario) {
    form.value = { ...usuario };
  }
}, { immediate: true });

const tiposDeporte = [
  { label: 'Fútbol', value: 1 },
  { label: 'Baloncesto', value: 2 },
  { label: 'Tenis', value: 3 },
  { label: 'Natación', value: 4 },
  { label: 'Atletismo', value: 5 },
];

const schema = toTypedSchema(
  yup.object({
    na_type_competency: yup.string().required('El nombre es obligatorio'),
    id_sport: yup.number().required('El deporte es obligatorio').nullable(),
  })
);

// ✨ Emitir evento diferente según modo
const emit = defineEmits(['guardar', 'actualizar']);
const submit = () => {
  if (props.modoEdicion) {
    emit('actualizar', form.value);
  } else {
    emit('guardar', form.value);
  }
  visible.value = false;
};
</script>
