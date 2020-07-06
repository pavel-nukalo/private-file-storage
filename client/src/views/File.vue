<template>
  <v-container>
    <v-btn
      @click="$router.go(-1)"
      color="blue"
      dark
      class="mb-3 mt-3"
    >
      <v-icon left>arrow_back</v-icon>
      Back to file list
    </v-btn>
          
    <v-card
      class="mx-auto mt-5"
    >
      <v-card-text>
        <div>File info</div>
        <p class="display-1 text--primary">
          {{file.name}}
        </p>
        
        <p>
          ID: <span class="text--primary">{{file.id}}</span>
        </p>
        
        <p>
          MD5: <span class="text--primary">{{file.md5}}</span>
        </p>
        
        <p>
          Extension: <span class="text--primary">{{file.extname}}</span>
        </p>
        
        <p>
          MIME type: <span class="text--primary">{{file.mimetype}}</span>
        </p>
        
        <p>
          Size: <span class="text--primary">{{file.size / 1000}} kB</span>
        </p>   
        
        <p>
          Uploaded: <span class="text--primary">{{new Date(file.uploaded).toLocaleString('en-US')}} kB</span>
        </p>      
      </v-card-text>
      <v-card-actions>
        <v-btn
          dark
          color="blue"
          @click="downloadFile"
        >
          Download
        </v-btn>
        
        <v-btn color="blue" dark @click="updateFile">
          Update
          <v-icon right dark>cloud_upload</v-icon>
        </v-btn>
        
        <v-btn
          dark
          color="red"
          @click="deleteFile"
        >
          Delete
        </v-btn>
      </v-card-actions>
      
      <v-card-actions>
        <v-file-input
          prepend-icon="attach_file"
          class="mb-0"
          show-size
          label="File input"
          v-model="selectedFile"
        ></v-file-input>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import FileDownload from 'js-file-download';

export default {
  data() {
    return {
      file: {
        id: '',
        md5: '',
        name: '',
        extname: '',
        mimetype: '',
        size: 0,
        uploaded: null
      },
      
      selectedFile: null
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const file = await this.$store.dispatch('api', {
        method: 'get',
        url: '/file/' + this.$route.path.replace('/files/', '')
      });
      
      if (file) {
        this.file = file;
      }    
    },
    
    async deleteFile() {
      const result = await this.$store.dispatch('api', {
        method: 'delete',
        url: '/file/delete/' + this.$route.path.replace('/files/', '')
      });
      
      if (result && result.status) {
        this.$router.push('/files');
      }
    },
    
    async updateFile() {
      if (!this.selectedFile) {
        return;
      }
      
      const formData = new FormData();
      formData.append('sampleFile', this.selectedFile);

      const result = await this.$store.dispatch('api', {
        method: 'put',
        url: '/file/update/' + this.file.id,
        data: formData
      });
      
      if (result && result.status) {
        this.file = result.data;
      }
    },
    
    async downloadFile() {
      const data = await this.$store.dispatch('api', {
        method: 'get',
        url: '/file/download/' + this.file.id,
        responseType: 'arraybuffer'
      });
      
      if (data) {
        FileDownload(data, this.file.name);
      }
    }
  }
}
</script>