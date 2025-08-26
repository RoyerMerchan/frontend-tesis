<!-- RecoverPassword.vue -->
<template>
  <div class="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-300">
    <Toast />
    <Card class="w-full max-w-md bg-white text-gray-800 shadow-lg rounded-xl px-8 py-6">
      <template #title>
        <h2 class="text-2xl font-bold text-center text-teal-800 mb-4">Recuperar Contraseña</h2>
      </template>

      <template #content>
        <Form @submit="submit" :validation-schema="schema" class="flex flex-col gap-4">
          <div>
            <label for="institutional_email" class="block mb-1 font-semibold text-gray-700">Correo institucional</label>
            <Field name="institutional_email" v-slot="{ field }">
              <InputText v-bind="field" id="institutional_email" placeholder="ejemplo@correo.com" class="w-full" />
            </Field>
            <ErrorMessage name="institutional_email" class="text-red-500 text-xs mt-1" />
          </div>

          <Button
            label="Enviar código"
            icon="pi pi-envelope"
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

          <div class="text-center mt-4 text-sm text-indigo-700">
            <RouterLink to="/login" class="hover:underline">Volver al inicio de sesión</RouterLink>
          </div>
        </Form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import { send } from '@/api/send';

const toast = useToast();
const router = useRouter();
const loading = ref(false);

const schema = yup.object({
  institutional_email: yup.string().email('Correo inválido').required('Correo requerido')
});

const submit = async (values) => {
  loading.value = true;
  try {
    await send({
      endpoint: 'auth/recover',
      method: 'post',
      body: values
    });

    toast.add({ severity: 'success', summary: 'Código enviado', detail: 'Revisa tu correo para continuar.' });
    setTimeout(() => {
      router.push({ path: '/reset-password', query: { email: values.institutional_email } });
    }, 1000);
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar el código.' });
  } finally {
    loading.value = false;
  }
};
</script>
