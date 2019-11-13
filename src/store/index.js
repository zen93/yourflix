import Vue from 'vue';
import Vuex from 'vuex';
import movie from './modules/movie';
import list from './modules/list';

Vue.use(Vuex)
let storeInstance = new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: null
    },
    status: 'Please type one or more characters.',
    unsubscribe: () => {},
  },
  mutations: {
    setLoggedIn(state, loggedIn) {
      state.user.loggedIn = loggedIn;
    },
    setUser(state, data) {
      state.user.data = data;
    },
    setStatus(state, status) {
      state.status = status;
    },
    setUnsubscribe(state, unsubscribe) {
      state.unsubscribe = unsubscribe;
    }
  },
  getters: {
    user: state => state.user,
    status: state => state.status,
    unsubscribe: state => state.unsubscribe,
  },
  actions: {
    fetchUser({ commit }, user) {
      commit("setLoggedIn", user !== null);
      if (user) {
        commit("setUser", {
          displayName: user.displayName,
          email: user.email,
          userId: user.uid,
        });
      } else {
        commit("setUser", null);
      }
    }
  },
  modules: {
    movie,
    list,
  }
});

export default storeInstance;
