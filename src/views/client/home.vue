<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Encabezado -->
    <div class="text-center py-8">
      <h1 class="text-4xl font-bold text-teal-900 animate__animated animate__fadeInDown">Bienvenido a Sport App U</h1>
      <p class="text-gray-700 mt-2 animate__animated animate__fadeInUp">Tu portal deportivo escolar</p>
    </div>

    <!-- Carrusel de noticias -->
    <div class="max-w-5xl mx-auto mb-10 px-4">
      <h2 class="text-2xl font-semibold text-black-800 mb-4">📰 Últimas noticias</h2>
      <Carousel :value="news" :numVisible="1" :numScroll="1" circular :autoplayInterval="4000">
        <template #item="slotProps">
          <div class="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-4 items-center">
            <img :src="slotProps.data.image" alt="Noticia" class="w-32 h-32 object-cover rounded-md" />
            <div>
              <h3 class="text-xl font-bold text-teal-700">{{ slotProps.data.title }}</h3>
              <p class="text-gray-600 mt-2">{{ slotProps.data.description }}</p>
            </div>
          </div>
        </template>
      </Carousel>
    </div>

    <!-- Opciones principales -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 pb-16">
      <Card class="hover:scale-105 transition-transform duration-300 cursor-pointer" @click="goTo('team')">
        <template #header>
          <div class="flex justify-center py-4">
            <i class=" text-4xl text-blue-600 animate__animated animate__bounceIn"></i>
            <img src="/src/assets/images/Trabajo en equipo.jpg" alt="team" class="w-full h-40 object-cover rounded-t-lg">
          </div>
        </template>
        <template #title>
          <h3 class="text-center text-xl font-semibold text-blue-800">Equipos</h3>
        </template>
        <template #content>
          <p class="text-center text-gray-600">Consulta y gestiona los equipos registrados.</p>
        </template>
      </Card>

      <Card class="hover:scale-105 transition-transform duration-300 cursor-pointer" @click="goTo('competency')">
        <template #header>
          <div class="flex justify-center py-4">
 <i class=" text-4xl text-green-600 animate__animated animate__bounceIn"></i>
            <img src="/src/assets/images/tournament.jpg" alt="tournament" class="w-full h-40 object-cover rounded-t-lg" >
          </div>
        </template>
        <template #title>
          <h3 class="text-center text-xl font-semibold text-green-800">Torneos</h3>
        </template>
        <template #content>
          <p class="text-center text-gray-600">Explora los torneos activos y su programación.</p>
        </template>
      </Card>

      <Card class="hover:scale-105 transition-transform duration-300 cursor-pointer" @click="goTo('stadistics')">
        <template #header>
          <div class="flex justify-center py-4">

          <i class=" text-4xl text-purple-600 animate__animated animate__bounceIn"></i>
 <img src="/src/assets/images/estadistics.jpg" alt="estadistics" class="w-full h-40 object-cover rounded-t-lg object-top">
            </div>
        </template>
        <template #title>
          <h3 class="text-center text-xl font-semibold text-purple-800">Estadísticas</h3>
        </template>
        <template #content>
          <p class="text-center text-gray-600">Visualiza el rendimiento y datos clave.</p>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Carousel from 'primevue/carousel';

const router = useRouter();
const goTo = (routeName) => {
  router.push({ name: routeName });
};

// Noticias simuladas
const news = ref([
  {
    title: 'Acuerdo con el Estudiantes',
    description: 'El colegio firma convenio deportivo con el club Estudiantes.',
    image: 'https://via.placeholder.com/150x150?text=Estudiantes'
  },
  {
    title: 'Campeones de Invierno',
    description: 'El equipo sub-12 gana el torneo regional de invierno.',
    image: 'https://via.placeholder.com/150x150?text=Campeones'
  },
  {
    title: 'Nueva cancha techada',
    description: 'Se inaugura la nueva cancha techada para entrenamientos.',
    image: 'https://via.placeholder.com/150x150?text=Cancha'
  }
]);
</script>


