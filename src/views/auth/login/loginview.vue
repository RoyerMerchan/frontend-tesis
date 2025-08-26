<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';
import { useRouter, RouterLink } from 'vue-router';
import { ref } from 'vue';
import { send } from '@/api/send'; // Asegúrate que esta función exista
import { useLoaderStore } from '@/store/useLoader';
import { FloatLabel } from 'primevue';

const toast = useToast();
const router = useRouter();
const loading = ref(false);
const loader = useLoaderStore();

const goToRegister = () => {
  loader.show();
  setTimeout(() => {
    router.push('/register');
    loader.hide();
  }, 1500); // Simula carga, ajustable
};


const schema = toTypedSchema(
  yup.object({
    user: yup.string().required('Usuario requerido'),
    password: yup.string().required('Contraseña requerida')
  })
);

const submit = async (values) => {
  loading.value = true;
  try {
    const res = await send({
      endpoint: 'sesion',
      method: 'post',
      body: values
    });

    localStorage.setItem('auth_token', res.token);

    toast.add({ severity: 'success', summary: 'Bienvenido', detail: 'Inicio de sesión exitoso' });

    setTimeout(() => {
      router.push('/');
    }, 1000);
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Credenciales inválidas' });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-h-8xl max-w-7xl flex rounded-3xl shadow-lg overflow-hidden">
    <!-- Sección izquierda -->
    <div class="w-1/2 bg-teal-500 text-white flex flex-col justify-center items-center p-12">
      <h1 class="text-4xl font-bold text-center mb-4">El estudio es la disciplina que te lleva al éxito, como el deporte te lleva a la victoria.</h1>
      <img src="/./src/assets/images/descarga1.png" alt="Rocket" class="w-2/3 mt-6" />
    </div>

    <!-- Sección derecha -->
    <div class="w-1/2 bg-teal-950 text-white flex flex-col justify-center items-center p-12">
      <Toast />
      <Card class="w-full max-w-md bg-white text-gray-800 shadow-lg rounded-2xl px-8 py-6">
        <template #title>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Iniciar Sesión</h2>
            <!-- colocar logo de app -->
          </div>
        </template>

        <template #content>
          <Form @submit="submit" :validation-schema="schema" class="flex flex-col gap-4">
            <!-- Usuario -->
            <div>
              <label for="user" class="block mb-1 text-sm font-medium">Usuario</label>
              <Field name="user" v-slot="{ field }">
                <InputText v-bind="field" id="user" placeholder="Ingrese su usuario" class="w-full" />
              </Field>
              <ErrorMessage name="user" class="text-red-400 text-xs mt-1" />
            </div>

            <!-- Contraseña -->
            <div>
              <label for="password" class="block mb-1 text-sm font-medium">Contraseña</label>
              <Field name="password" v-slot="{ field }">
                <Password v-bind="field" id="password" toggleMask placeholder="Ingrese su contraseña" class="w-full" />
              </Field>
              <ErrorMessage name="password" class="text-red-400 text-xs mt-1" />
            </div>

            <!-- Botón -->
            <Button
              label="Entrar"
              icon="pi pi-sign-in"
              type="submit"
              class="w-full bg-teal-400 text-white mt-4 hover:bg-teal-500"
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

            <!-- Enlaces -->
            <div class="flex justify-between mt-4 text-sm text-teal-600">
<span @click="goToRegister" class="hover:underline cursor-pointer text-teal-600">
  ¿No tienes cuenta? Regístrate
</span>              <RouterLink to="/recover" class="hover:underline">¿Olvidaste tus datos?</RouterLink>
            </div>
          </Form>
        </template>
      </Card>
    </div>
  </div>
</template>

