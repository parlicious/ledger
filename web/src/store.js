/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload.user;
    },
  },
  getters: {
    signedIn: state => !!state.user,
  },
  actions: {
    signIn({ commit }, googleUser) {
      const profile = googleUser.getBasicProfile();
      const auth = googleUser.getAuthResponse();
      const user = {
        id: profile.getId(),
        token: auth.id_token,
        name: profile.getName(),
        email: profile.getEmail(),
      };
      commit({
        type: 'setUser',
        user,
      });
    },
    signOut({ commit }) {
      commit({
        type: 'setUser',
        user: null,
      });
    },
  },
});
