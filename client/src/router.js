import Vue from 'vue';
import Router from 'vue-router';

import Signin from './views/Signin.vue';

import Signup from './views/Signup.vue';

import Files from './views/Files.vue';

import File from './views/File.vue';

import User from './views/User.vue';

import store from '@/store';

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isUserAuthenticated) {
    return next();
  }

  next({
    name: 'Files'
  });
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isUserAuthenticated) {
    return next();
  }

  next({
    name: 'Signin'
  });
};

export default new Router({
  routes: [
    {
      path: '/signin',
      name: 'Signin',
      component: Signin,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/',
      redirect: '/files',
      beforeEnter: ifAuthenticated
    },
    {
      path: '/files',
      name: 'Files',
      component: Files,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/files/*',
      name: 'File',
      component: File,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/user',
      name: 'User',
      component: User,
      beforeEnter: ifAuthenticated
    }
  ]
});