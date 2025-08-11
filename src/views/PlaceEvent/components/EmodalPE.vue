<template>
<Dialog v-model:visible="visible" header="Editar lugar de evento" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">

     <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="name_place" class="text-left">Deporte</label>
      <Field name="name_place" v-slot="{ field }">
        <InputText v-bind="field" id="name_place" placeholder="Ingrese Nombre de lugar" class="w-full" />
      </Field>
      <ErrorMessage name="name_place" class="text-red-500 text-xs" />
    </div>


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="ubication" class="text-left">descripcion</label>
      <Field name="ubication" v-slot="{ field }">
        <InputText v-bind="field" id="ubication" placeholder="Ingrese ubicacion" class="w-full" />
      </Field>
      <ErrorMessage name="ubication" class="text-red-500 text-xs" />
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




const visible = defineModel('visible');

// 🆕 Nuevas props
const props = defineProps({
  modoEdicion: Boolean,
  usuarioEditando: Object,
});

const form = ref({
  name_place: '',
  ubication: '',

});

// 🧠 Rellenar campos si hay usuario a editar
watch(() => props.deporteEditando, (deporte) => {
  if (props.modoEdicion && deporte) {
    form.value = { ...deporte };
  }
}, { immediate: true });

// Validación del formulario
const schema = toTypedSchema(
  yup.object({
    name_place: yup.string().required('El nombre del lugar es obligatorio').min(3, 'El nombre del lugar debe tener al menos 3 caracteres'),
    ubication: yup.string().required('La ubicación es obligatoria').min(3, 'La ubicación debe tener al menos 3 caracteres'),
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
