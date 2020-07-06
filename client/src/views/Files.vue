<template>
  <v-container>    
    <v-layout column>
      <h3 class="headline mt-3">File list</h3>
      <v-data-table
        :headers="headers"
        :items="files"
        class="elevation-1 mt-3"
        hide-default-footer
      >    
        <template v-slot:item.uploaded="{ item }">
          {{new Date(item.uploaded).toLocaleString('en-US')}}
        </template>
        
        <template v-slot:item.actions="{ item }">
          <v-btn
            :to="'/files/' + item.id"
            small
            dark
            class="blue"
          >
            Select
          </v-btn>
        </template>
      </v-data-table>
      
      <v-layout column class="mt-3">
        <v-select
          :items="[5, 10, 15]"
          v-model="itemsPerPage"
          label="Items per page"
          outlined
        ></v-select>
        
        <v-pagination 
          v-model="page" 
          :length="pageCount"
          next-icon="arrow_forward"
          prev-icon="arrow_back"
        ></v-pagination>
      </v-layout>
      
      <v-layout column>
        <v-file-input
          prepend-icon="attach_file"
          class="mb-0"
          show-size
          label="File input"
          v-model="selectedFile"
        ></v-file-input>

        <v-col class="pl-2 pt-0">
          <v-btn color="success" dark @click="uploadFile">
            Upload
            <v-icon right dark>cloud_upload</v-icon>
          </v-btn>
        </v-col>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {      
      files: [],
      
      page: 1,
      itemsPerPage: 10,
      itemsCount: 0,
      
      headers: [
        {
          text: 'ID',
          align: 'left',
          value: 'id',
        },
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Uploaded',
          value: 'uploaded'
        },
        {
          text: 'Actions',
          value: 'actions',
          align: 'right'
        }
      ],
      
      selectedFile: null
    };
  },
  computed: {
    pageCount() {      
      return Math.ceil(this.itemsCount / this.itemsPerPage);
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const response = await this.$store.dispatch('api', {
        method: 'get',
        url: `/file/list?page=${this.page}&list_size=${this.itemsPerPage}`
      });
      
      if (response.count) {
        this.itemsCount = response.count;
      }  
      
      if (response.files) {
        this.files = response.files;
      }    
    },
    
    async uploadFile() {
      if (!this.selectedFile) {
        return;
      }
      
      const formData = new FormData();
      formData.append('sampleFile', this.selectedFile);

      const result = await this.$store.dispatch('api', {
        method: 'post',
        url: '/file/upload',
        data: formData
      });
      
      if (result && result.status) {
        if (this.files.length < this.itemsPerPage) this.files.push(result.data);
        this.itemsCount++;
      }
    }
  },
  
  watch: {
    pageCount() {
      if (this.page > this.pageCount) {
        this.page = this.pageCount;
      }
    },
    
    page() {
      this.fetchData();
    },
    
    itemsPerPage() {
      this.fetchData();
    }
  }
}
</script>