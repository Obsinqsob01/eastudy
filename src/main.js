import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

import "./assets/styles.scss";
import "material-icons/iconfont/material-icons.css";
import "animate.css/animate.min.css";

import Notifications from "vue-notification";

Vue.use(Notifications);

import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
