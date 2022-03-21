import { createPinia } from "/node_modules/.vite/pinia.js?v=c8661978";
import { createApp } from "/node_modules/.vite/vue.js?v=c8661978";
import App from "/src/App.vue?t=1647861675150";
import router from "/src/router/index.js?t=1647874214873";
import '/src/index.css?t=1647874214873'

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount("#app");