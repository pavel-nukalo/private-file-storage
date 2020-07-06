<template>
  <v-container>          
    <v-card
      class="mx-auto mt-5"
    >
      <v-card-text>
        <div>User info</div>    
        <p class="mt-3 mb-0">
          Email: <span class="text--primary">{{user.email}}</span>
        </p>
        
        <p>
          ID: <span class="text--primary">{{user.id}}</span>
        </p> 
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      user: {
        id: '',
        email: ''
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const response = await this.$store.dispatch('api', {
        method: 'get',
        url: '/info'
      });
      
      if (response) {
        this.user = response.data;
      }    
    }
  }
}
</script>