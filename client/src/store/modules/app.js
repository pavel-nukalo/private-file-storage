import axios from 'axios';
import { get, set, toggle } from '@/utils/vuex';

const state = {
  processing: false,
  error: null,
  drawer: null
};

const getters = {
  getProcessing: get('processing'),
  getError: get('error'),
  getDrawer: get('drawer')
};

const mutations = {
  setProcessing: set('processing'),
  setError: set('error'),
  cleanError: state => (state.error = null),
  setDrawer: set('drawer'),
  toggleDrawer: toggle('drawer')
};

const actions = {
  async api({ commit, getters }, payload) {
    commit('setProcessing', true);
    commit('cleanError');
    let data = null;

    try {
      const response = await axios(Object.assign({
        headers: {
          'Authorization': `Bearer ${getters.getToken}`
        }
      }, payload));
      data = response.data;
    } catch (e) {
      const message = e && e.response && e.response.data && e.response.data.message;
      commit('setError', message || 'An error occurred while accessing API');
    } finally {
      commit('setProcessing', false);
    }

    return data;
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};