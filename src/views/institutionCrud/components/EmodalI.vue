<template>
<Dialog v-model:visible="visible" header="Editar institucion" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">


    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="name_institucion" class="text-left">institucion</label>
      <Field name="name_institucion" v-slot="{ field }">
        <InputText v-bind="field" id="name_institucion" placeholder="Ingrese institucion" class="w-full" />
      </Field>
      <ErrorMessage name="name_institucion" class="text-red-500 text-xs" />
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
  name_institucion: '',
});

// 🧠 Rellenar campos si hay usuario a editar
watch(() => props.instituteditando, (institut) => {
  if (props.modoEdicion && institut) {
    form.value = { ...institut };
  }
}, { immediate: true });

// Validación del formulario
const schema = toTypedSchema(
  yup.object({
    name_institucion: yup.string().required('El nombre de la institución es obligatorio'),
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
