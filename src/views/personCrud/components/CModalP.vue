<template>
  <Dialog
    v-model:visible="visible"
    header="Crear Persona"
    :modal="true"
    :closable="true"
    :style="{ width: '600px' }"
  >
    <Form @submit="submit" :validation-schema="schema" class="">
      <div class="grid gap 10">
        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="name" class="text-left">nombre</label>
          <Field name="name" v-slot="{ field }">
            <InputText v-bind="field" id="name" placeholder="Ingrese nombre" class="w-full" />
          </Field>
          <ErrorMessage name="name" class="text-red-500 text-xs" />
        </div>

        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="lastname" class="text-left">Apellido</label>
          <Field name="lastname" v-slot="{ field }">
            <InputText v-bind="field" id="lastname" placeholder="ingrese apellido" class="w-full" />
          </Field>
          <ErrorMessage name="lastname" class="text-red-500 text-xs" />
        </div>

        <div class="flex flex-col w-full max-w-md mx-auto">
          <label for="id_tipopersona" class="text-left">Tipo de Persona</label>
          <Field name="id_tipopersona" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              :options="tiposPersona"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona uno"
              class="w-full"
              id="id_tipopersona"
            />
          </Field>
          <ErrorMessage name="id_tipo_persona" class="text-red-500 text-xs" />
        </div>

        <!-- Botones -->
        <div class="flex justify-end w-full max-w-md mx-auto gap-2 mt-4">
          <Button label="Cancelar" @click="visible = false" severity="secondary" />
          <Button label="Guardar" type="submit" />
        </div>
      </div>
    </Form>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'

import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

// Props para control externo (opcional)
const visible = defineModel('visible')

const form = ref({
  name: '',
  lastname: '',
  id_tipo_persona: null,
})

const tiposPersona = [
  { label: 'Estudiante', value: 101 },
  { label: 'Profesor', value: 102 },
  { label: 'Administrador', value: 103 },
]

const schema = toTypedSchema(
  yup.object({
    name: yup.string().required('El nombre es obligatorio'),
    lastname: yup.string().required('El apellido es obligatorio'),
    id_tipo_persona: yup
      .number()
      .required('Debe seleccionar un tipo de persona')
      .nullable(),
  }),
)

const submit = () => {
  console.log('Formulario válido:', form.value)
  visible.value = false
  // Aquí puedes emitir el evento o hacer la llamada a API
}
</script>
