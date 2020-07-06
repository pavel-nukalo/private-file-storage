import axios from 'axios';
import { get, set } from '@/utils/vuex';

const state = {
  isAuthenticated: false,
  token: null,
  refreshToken: null
};

const getters = {
  isUserAuthenticated: get('isAuthenticated'),
  getToken: get('token'),
  getRefreshToken: get('refreshToken')
};

const mutations = {
  setUserAuthenticated: set('isAuthenticated'),
  setToken: set('token'),
  setRefreshToken: set('refreshToken')
};

const actions = {
  async signin({ commit }, { email, password }) {
    commit('setProcessing', true);
    commit('cleanError');

    try {
      const { data } = await axios.post('/signin', { email, password });

      commit('setUserAuthenticated', true);
      commit('setUserEmail', email);
      commit('setToken', data.token);
      commit('setRefreshToken', data.refreshToken);

      return data.status;
    } catch (e) {
      const message = e && e.response && e.response.data && e.response.data.message;
      commit('setError', message || 'Error! The email address or password you entered is incorrect.');
    } finally {
      commit('setProcessing', false);
    }
  },

  async signup({ commit }, { email, password }) {
    commit('setProcessing', true);
    commit('cleanError');

    try {
      const { data } = await axios.post('/signup', { email, password });

      commit('setUserAuthenticated', true);
      commit('setUserEmail', email);
      commit('setToken', data.token);
      commit('setRefreshToken', data.refreshToken);

      return data.status;
    } catch (e) {
      let message = e && e.response && e.response.data && e.response.data.errors && e.response.data.errors[0] && 'Email is incorrect';
      message = message || e && e.response && e.response.data.message;
      commit('setError', message || 'Error! Check the validity of the entered data.');
    } finally {
      commit('setProcessing', false);
    }
  },

  async signout({ commit, getters }) {
    commit('setProcessing', true);
    commit('cleanError');

    try {
      await axios({
        method: 'GET',
        url: '/logout',
        headers: {
          'Authorization': `Bearer ${getters.getToken}`
        }
      });
    } catch (e) {
      commit('setError', 'An error occurred while logging out. Perhaps the session has expired.');
    }

    commit('setUserAuthenticated', false);
    commit('setUserEmail', '');
    commit('setToken', null);
    commit('setRefreshToken', null);
    commit('setProcessing', false);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};