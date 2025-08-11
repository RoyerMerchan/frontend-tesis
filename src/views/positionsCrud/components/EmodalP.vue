<template>
<Dialog v-model:visible="visible" header="Editar posicion" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="na_position" class="text-left">posicion</label>
      <Field name="na_position" v-slot="{ field }">
        <InputText v-bind="field" id="na_position" placeholder="Ingrese posicion" class="w-full" />
      </Field>
      <ErrorMessage name="na_position" class="text-red-500 text-xs" />
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
  positionEditando: Object,
});

const form = ref({
  na_position: '',
});

// 🧠 Rellenar campos si hay usuario a editar
watch(() => props.positionEditando, (posit) => {
  if (props.modoEdicion && posit) {
    form.value = { ...posit };
  }
}, { immediate: true });

// Validación del formulario
const schema = toTypedSchema(
  yup.object({
    na_position: yup.string().required('El nombre es obligatorio'),
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
