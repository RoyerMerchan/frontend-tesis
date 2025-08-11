<template>
<Dialog v-model:visible="visible" header="Editar Persona" :modal="true" :closable="true" :style="{ width: '600px'}" >
    <Form @submit="submit" :validation-schema="schema" class="">
  <div class=" grid gap 10">

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="name" class="text-left">nombre</label>
      <Field name="name" v-slot="{ field }">
        <InputText v-bind="field" id="name" placeholder="Ingrese nombre" class="w-full" />
      </Field>
      <ErrorMessage name="name" class="text-red-500 text-xs" />
    </div>



    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="lastname" class="text-left">lastname</label>
      <Field name="lastname" v-slot="{ field }">
        <InputText v-bind="field" id="lastname" placeholder="Ingrese Apellido" class="w-full" />
      </Field>
      <ErrorMessage name="lastname" class="text-red-500 text-xs" />
    </div>

    <div class="flex flex-col w-full max-w-md mx-auto">
      <label for="id_tipo_persona" class="text-left">Tipo de Persona</label>
      <Field name="id_tipo_persona" v-slot="{ field }">
        <Select
          v-bind="field"
          :options="tiposPersona"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona uno"
          class="w-full"
          id="id_tipopersona"
        />
      </Field>
      <ErrorMessage name="id_tipopersona" class="text-red-500 text-xs" />
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
  name: '',
  lastname: '',
  id_tipo_persona: null,
});

// 🧠 Rellenar campos si hay usuario a editar
watch(() => props.personEditando, (person) => {
  if (props.modoEdicion && person) {
    form.value = { ...person };
  }
}, { immediate: true });

const tiposPersona = [
  { label: 'Estudiante', value: 1 },
  { label: 'Docente', value: 2 },
  { label: 'Administrativo', value: 3 },
];

const schema = toTypedSchema(
  yup.object({
    name: yup.string().required('El nombre es obligatorio'),
    lastname: yup.string().required('El apellido es obligatorio'),
    id_tipo_persona: yup.number().required('Debe seleccionar un tipo de persona'),
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
