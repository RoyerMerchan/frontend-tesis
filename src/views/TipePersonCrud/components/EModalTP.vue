<template>
<Dialog v-model:visible="visible" header="Editar tipo persona" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="descripcion" class="text-left">descripcion</label>
      <Field name="descripcion" v-slot="{ field }">
        <InputText v-bind="field" id="descripcion" placeholder="Ingrese descripcion" class="w-full" />
      </Field>
      <ErrorMessage name="descripcion" class="text-red-500 text-xs" />
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
  descripcion: '',
});

// 🧠 Rellenar campos si hay usuario a editar
watch(() => props.tpersonaeditando, (tp) => {
  if (props.modoEdicion && tp) {
    form.value = { ...tp };
  }
}, { immediate: true });

// Validación del formulario
const schema = toTypedSchema(
  yup.object({
    descripcion: yup.string().required('La descripción es obligatoria').min(3, 'La descripción debe tener al menos 3 caracteres'),
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
