<template>

  <div class="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">

    <Toast />
    <Card class="w-full max-w-xl bg-white text-gray-800 shadow-lg rounded-2xl px-8 py-6">

      <template #title>
        
        <h2 class="text-2xl font-bold text-center text-teal-800 mb-4">Registro de Usuario</h2>
      </template>

      <template #content>
        <Form @submit="submit" :validation-schema="schema" class="flex flex-col gap-4">
          <!-- Nombre -->
          <div>
            <label for="na_person" class="block mb-1 font-semibold text-gray-700">Nombre</label>
            <Field name="na_person" v-slot="{ field }">
              <InputText v-bind="field" id="na_person" placeholder="Ingrese su nombre" class="w-full" />
            </Field>
            <ErrorMessage name="na_person" class="text-red-500 text-xs mt-1" />
          </div>

          <!-- Apellido -->
          <div>
            <label for="ln_person" class="block mb-1 font-semibold text-gray-700">Apellido</label>
            <Field name="ln_person" v-slot="{ field }">
              <InputText v-bind="field" id="ln_person" placeholder="Ingrese su apellido" class="w-full" />
            </Field>
            <ErrorMessage name="ln_person" class="text-red-500 text-xs mt-1" />
          </div>

          <!-- Tipo de persona -->
          <div>
            <label for="type_person_id" class="block mb-1 font-semibold text-gray-700">Tipo de persona</label>
            <Field name="type_person_id" v-slot="{ field }">
              <Dropdown
                v-bind="field"
                :options="typePersons"
                optionLabel="de_type_person"
                optionValue="type_person_id"
                placeholder="Selecciona un tipo"
                class="w-full"
                id="type_person_id"
              />
            </Field>
            <ErrorMessage name="type_person_id" class="text-red-500 text-xs mt-1" />
          </div>

          <!-- Usuario -->
          <div>
            <label for="username" class="block mb-1 font-semibold text-gray-700">Usuario</label>
            <Field name="username" v-slot="{ field }">
              <InputText v-bind="field" id="username" placeholder="Nombre de usuario" class="w-full" />
            </Field>
            <ErrorMessage name="username" class="text-red-500 text-xs mt-1" />
          </div>

          <!-- Contraseña -->
          <div>
            <label for="password" class="block mb-1 font-semibold text-gray-700">Contraseña</label>
            <Field name="password" v-slot="{ field }">
              <Password v-bind="field" id="password" toggleMask placeholder="Contraseña" class="w-full" />
            </Field>
            <ErrorMessage name="password" class="text-red-500 text-xs mt-1" />
          </div>

          <!-- Email -->
          <div>
            <label for="institutional_email" class="block mb-1 font-semibold text-gray-700">Correo institucional</label>
            <Field name="institutional_email" v-slot="{ field }">
              <InputText v-bind="field" id="institutional_email" placeholder="ejemplo@correo.com" class="w-full" />
            </Field>
            <ErrorMessage name="institutional_email" class="text-red-500 text-xs mt-1" />
          </div>

          <!-- Botón -->
          <Button
            label="Registrarse"
            icon="pi pi-user-plus"
            type="submit"
            class="w-full bg-blue-500 text-white mt-4 hover:bg-blue-600"
            :disabled="loading"
          >
            <template #icon>
              <ProgressSpinner
                v-if="loading"
                style="width: 20px; height: 20px"
                strokeWidth="4"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            </template>
          </Button>

          <!-- Enlace -->
          <span @click="gotoLogin" class="hover:underline cursor-pointer text-teal-700">
 ¿ya te registraste? Inicia sesión
</span>
        </Form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import ProgressSpinner from 'primevue/progressspinner';
import { send } from '@/api/send';
import { useLoaderStore } from '@/store/useLoader';
const loader = useLoaderStore();


const gotoLogin = () => {
  loader.show();
  setTimeout(() => {
    router.push('/login');
    loader.hide();
  }, 600);
};


const toast = useToast();
const router = useRouter();
const loading = ref(false);
const typePersons = ref([]);

onMounted(async () => {
  try {
    const res = await send({ endpoint: 'typeperson', method: 'get' });
    typePersons.value = res.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de persona.' });
  }
});

const schema = yup.object({
  na_person: yup.string().required('Nombre requerido'),
  ln_person: yup.string().required('Apellido requerido'),
  type_person_id: yup
    .object({
      value: yup.number().typeError('Debe seleccionar un tipo válido').required('Tipo requerido')
    })
    .required('Tipo requerido'),
  username: yup.string().required('Usuario requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
  institutional_email: yup.string().email('Correo inválido').required('Correo requerido')
});

const submit = async (values) => {
  loading.value = true;
  const payload = {
    na_person: values.na_person,
    ln_person: values.ln_person,
    type_person_id: values.type_person_id.value,
    username: values.username,
    password: values.password,
    institutional_email: values.institutional_email,
    id_profile: 1 // Asignación automática como usuario común
  };

  try {
    await send({ endpoint: 'user/person', method: 'post', body: payload });
    toast.add({ severity: 'success', summary: 'Registrado', detail: 'Usuario creado correctamente.' });
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el usuario.' });
  } finally {
    loading.value = false;
  }
};
</script>
