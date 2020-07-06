<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-list-item
            :key="item.text"
            :to="item.path"
            @click="item.click ? item.click() : null"
            link
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      dark
      app
      color="blue"
    >
      <v-btn
        icon
        class="ml-0"
        @click.stop="toggleDrawer"
      >
        <v-icon>fa-bars</v-icon>
      </v-btn>
      <v-toolbar-title
        class="ml-3"
      >
        <span class="hidden-sm-and-down ml-2">Private File Storage</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-btn
        icon
        class="mr-3"
      >
        <v-avatar
          size="30"
          tile
        >
          <v-img :src="require('@/assets/img/logo_white.png')" />
        </v-avatar>
      </v-btn>

      <v-progress-linear
        :indeterminate="true"
        class="mt-0"
        color="blue"
        absolute
        style="bottom: -4px;"
        v-if="processing"
      >
      </v-progress-linear>
    </v-app-bar>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    data() {
      return {

      };
    },
    computed: {
      isUserAuthenticated() {
        return this.$store.getters.isUserAuthenticated;
      },
      processing() {
        return this.$store.getters.getProcessing;
      },
      email() {
        return this.$store.getters.getUserEmail;
      },
      drawer: {
        get() {
          return this.$store.getters.getDrawer;
        },
        set(val) {
          this.setDrawer(val);
        }
      },      
      items() {
        return this.isUserAuthenticated
        ? [
          {
            icon: 'file_copy',
            text: 'Files',
            path: {
              path: '/files'
            }
          },
          {
            icon: 'account_circle',
            text: 'User info',
            path: {
              path: '/user'
            }
          },
          {
            icon: 'clear',
            text: 'Logout',
            click: this.signout
          }
        ] : [
          {
            icon: 'input',
            text: 'Signin',
            path: {
              path: '/signin'
            }
          },
          {
            icon: 'how_to_reg',
            text: 'Signup',
            path: {
              path: '/signup'
            }
          }
        ];
      }
    },
    methods: {
      ...mapMutations(['setDrawer', 'toggleDrawer']),
      
      async signout() {
        await this.$store.dispatch('signout');
        this.$router.push('/signin');
      }
    }    
  }
</script>

<style scoped>
  .v-icon {
    font-size: 1.4em !important;
  }
</style>
