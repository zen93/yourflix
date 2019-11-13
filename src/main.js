import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Config from './config';
import firebase from 'firebase';

Vue.config.productionTip = false

firebase.initializeApp(Config.firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  store.dispatch('fetchUser', user);
  store.dispatch('list/loadLists', user);
});

Vue.use(BootstrapVue);

new Vue({
  store,
  render: h => h(App),
  router,
}).$mount('#app')
