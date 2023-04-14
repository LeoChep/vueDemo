import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import * as Ammo from "@plugin/ammo/Ammo";

const app = createApp(App);
const ammo = await Ammo.getInstanse();
app.provide("ammo", ammo);
app.use(createPinia());
app.use(router);
app.mount("#app");
export { ammo };
