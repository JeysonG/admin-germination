import { createApp } from 'vue';
import App from './App.vue';
import FontAwesomeIcon from './utilities/fontawesome';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './styles/app.css';

const app = createApp(App as any).component('FontAwesomeIcon', FontAwesomeIcon);
app.use(VueSweetalert2);

app.mount('#app');
