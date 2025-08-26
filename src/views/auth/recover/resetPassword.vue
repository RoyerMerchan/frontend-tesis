<!-- ResetPassword.vue -->
<template>
  <div class="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-300">
    <Toast />
    <Card class="w-full max-w-md bg-white text-gray-800 shadow-lg rounded-xl px-8 py-6">
      <template #title>
        <h2 class="text-2xl font-bold text-center text-teal-800 mb-4">Actualizar Contraseña</h2>
      </template>

      <template #content>
        <Form @submit="submit" :validation-schema="schema" class="flex flex-col gap-4">
          <div>
            <label for="code" class="block mb-1 font-semibold text-gray-700">Código de verificación</label>
            <Field name="code" v-slot="{ field }">
              <InputText v-bind="field" id="code" placeholder="Ingresa el código" class="w-full" />
            </Field>
            <ErrorMessage name="code" class="text-red-500 text-xs mt-1" />
          </div>

          <div>
            <label for="new_password" class="block mb-1 font-semibold text-gray-700">Nueva contraseña</label>
            <Field name="new_password" v-slot="{ field }">
              <Password v-bind="field" id="new_password" toggleMask placeholder="Nueva contraseña" class="w-full" />
            </Field>
            <ErrorMessage name="new_password" class="text-red-500 text-xs mt-1" />
          </div>

          <Button
            label="Actualizar"
            icon="pi pi-refresh"
            type="submit"
            class="w-full bg-indigo-500 text-white mt-4 hover:bg-indigo-600"
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
        </Form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import { send } from '@/api/send';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const loading = ref(false);

const schema = yup.object({
  code: yup.string().required('Código requerido'),
  new_password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida')
});

const submit = async (values) => {
  loading.value = true;
  const payload = {
    email: route.query.email,
    code: values.code,
    new_password: values.new_password
  };

  try {
    await send({ endpoint: 'auth/reset-password', method: 'post', body: payload });
    toast.add({ severity: 'success', summary: 'Contraseña actualizada', detail: 'Ya puedes iniciar sesión.' });
    router.push('/login');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la contraseña.' });
  } finally {
    loading.value = false;
  }
};
</script>
