<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Sport App',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Mantenimiento',
        items: [
            { label: 'Institucion', icon: 'pi pi-fw pi-home', to: '/institution' },
            { label: 'Deporte', icon: 'pi pi-fw pi-bolt', to: '/deport' },
            { label: 'Perfil', icon: 'pi pi-fw pi-briefcase', to: '/perfil' },
            { label: 'Tipo persona', icon: 'pi pi-fw pi-graduation-cap', to: '/typeperson' },
            { label: 'Persona', icon: 'pi pi-fw pi-user', to: '/person' },
            { label: 'Usuario', icon: 'pi pi-fw pi-id-card', to: '/user' },
            { label: 'Equipo', icon: 'pi pi-fw pi-users', to: '/team' },
            { label: 'Miembros de equipo', icon: 'pi pi-fw pi-heart-fill', to: '/teammember' },
            { label: 'Evento', icon: 'pi pi-fw pi-car ', to: '/event', class: 'rotated-icon' },
            { label: 'Lugar de evento', icon: 'pi pi-fw pi-map-marker ', to: '/placeevent' },
            { label: 'Posiciones', icon: 'pi pi-fw pi-flag-fill', to: '/position' },
            { label: 'Tipo alineacon', icon: 'pi pi-fw pi-flag', to: '/typelineup' },
            { label: 'Alineacion', icon: 'pi pi-fw pi-address-book', to: '/lineup' },
            { label: 'Tipo competencia', icon: 'pi pi-fw pi-bullseye', to: '/typecompetency' },
            { label: 'Competencia', icon: 'pi pi-fw pi-trophy', to: '/competency' },
            { label: 'Estadisticas', icon: 'pi pi-fw pi-chart-bar', to: '/stadistics' }
        ]
    }

]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
