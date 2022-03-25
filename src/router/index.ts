import { createWebHistory, createRouter } from 'vue-router';
import SpeciesList from '../components/Species/AgSpeciesList.vue';
import Specie from '../components/Species/AgSpecie.vue';

const routes = [
  {
    path: '/',
    name: 'SpeciesList',
    component: SpeciesList,
  },
  {
    path: '/specie/:?_id',
    name: 'Specie',
    component: Specie,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
