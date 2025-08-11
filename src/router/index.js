import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/competency',
                    name: 'competency',
                    component: () => import('@/views/competencyCrud/views/competencyView.vue')
                },
                {
                    path: '/deport',
                    name: 'deport',
                    component: () => import('@/views/deportCrud/views/DepC.vue')
                },
                {
                    path: '/event',
                    name: 'event',
                    component: () => import('@/views/EventCrud/views/EventView.vue')
                },
                {
                    path: '/institution',
                    name: 'institution',
                    component: () => import('@/views/institutionCrud/views/InstiView.vue')
                },
                {
                    path: '/lineup',
                    name: 'lineup',
                    component: () => import('@/views/lineupCrud/views/lineupView.vue')
                },
                {
                    path: '/perfil',
                    name: 'perfil',
                    component: () => import('@/views/PerfilCrud/views/PerfilView.vue')
                },
                {
                    path: '/person',
                    name: 'person',
                    component: () => import('@/views/personCrud/views/personC.vue')
                },

                {
                    path: '/placeevent',
                    name: 'placeevent',
                    component: () => import('@/views/PlaceEvent/views/PEview.vue')
                },
                {
                    path: '/position',
                    name: 'position',
                    component: () => import('@/views/positionsCrud/views/PositionView.vue')
                },
                {
                    path: '/stadistics',
                    name: 'stadistics',
                    component: () => import('@/views/stadisticCrud/views/stadisticView.vue')
                },
                {
                    path: '/team',
                    name: 'team',
                    component: () => import('@/views/teamCrud/views/teamView.vue')
                },
                {
                    path: '/teammember',
                    name: 'teammember',
                    component: () => import('@/views/teamMemberCrud/views/tmView.vue')
                },
                {
                    path: '/typeperson',
                    name: 'typeperson',
                    component: () => import('@/views/TipePersonCrud/views/tpC.vue')
                },
                {
                    path: '/typecompetency',
                    name: 'typecompetency',
                    component: () => import('@/views/tycomCrud/views/tcView.vue')
                },
                {
                    path: '/typelineup',
                    name: 'typelineup',
                    component: () => import('@/views/tylineupCrud/views/typeluView.vue')
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('@/views/UserCrud/views/userC.vue')
                }
            ]
        },
    ]
});

export default router;
