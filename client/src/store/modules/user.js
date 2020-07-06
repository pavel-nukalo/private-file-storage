import { get, set } from '@/utils/vuex';

const state = {
  email: '',
};

const getters = {
  getUserEmail: get('email')
};

const mutations = {
  setUserEmail: set('email')
};

export default {
  state,
  getters,
  mutations
};