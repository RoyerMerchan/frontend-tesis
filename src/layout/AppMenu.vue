<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'UI Components',
        items: [
            { label: 'Competencia', icon: 'pi pi-fw pi-id-card', to: '/competency' },
            { label: 'Deporte', icon: 'pi pi-fw pi-check-square', to: '/deport' },
            { label: 'Evento', icon: 'pi pi-fw pi-mobile', to: '/event', class: 'rotated-icon' },
            { label: 'Institucion', icon: 'pi pi-fw pi-table', to: '/institution' },
            { label: 'Alineacion', icon: 'pi pi-fw pi-list', to: '/lineup' },
            { label: 'Perfil', icon: 'pi pi-fw pi-share-alt', to: '/perfil' },
            { label: 'Persona', icon: 'pi pi-fw pi-tablet', to: '/person' },
            { label: 'Lugar de evento', icon: 'pi pi-fw pi-clone', to: '/placeevent' },
            { label: 'Posiciones', icon: 'pi pi-fw pi-image', to: '/position' },
            { label: 'Estadisticas', icon: 'pi pi-fw pi-bars', to: '/stadistics' },
            { label: 'Equipo', icon: 'pi pi-fw pi-comment', to: '/team' },
            { label: 'Miembros de equipo', icon: 'pi pi-fw pi-file', to: '/teammember' },
            { label: 'Tipo persona', icon: 'pi pi-fw pi-chart-bar', to: '/typeperson' },
            { label: 'Tipo competencia', icon: 'pi pi-fw pi-calendar', to: '/typecompetency' },
            { label: 'Tipo alineacon', icon: 'pi pi-fw pi-circle', to: '/typelineup' },
            { label: 'Usuario', icon: 'pi pi-fw pi-circle', to: '/user' }
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
