<template>
  <v-container>
    <v-row>
      <v-col cols="12" >
        <v-form @submit.prevent="submitData">
          <v-row>
            <v-col cols="12" class="py-0">
              <v-text-field 
                name="nama"
                v-model="form.recipe_name" 
                label="Nama"
              />
              <v-textarea 
                name="desc"
                v-model="form.recipe_desc" 
                label="Description Resep"
              />
              <input 
                name="fileInput"
                type="file" 
                id="fileInput"
                hidden 
                @change="onCreateUploadFile" 
              />
              <v-menu>
                  <template v-slot:activator="{ props }">
                      <v-text-field 
                        v-model="fileImage" 
                        placeholder="Foto Masakan" 
                        readonly
                        v-bind="props" 
                        clearable
                        @click:clear="onRemoveFile"
                      />
                  </template>
                  <v-list>
                      <v-list-item value="file" @click="onChooseFile">
                          <v-list-item-title>Choose File</v-list-item-title>
                      </v-list-item>
                      <v-list-item value="camera" @click="onSetModalCamera(true)">
                          <v-list-item-title>Take Picture</v-list-item-title>
                      </v-list-item>
                  </v-list>
              </v-menu>

              <!-- STEPS  -->
              <v-row 
                v-for="(step, index) in form.steps" 
                :key="index" 
                class="mt-2"
              >
                  <v-col md="4" class="py-0">
                    <v-text-field 
                      v-model="step.step_name" 
                      :label="'Nama Step ' + (index + 1)" 
                    />
                  </v-col>
                  <v-col md="4" class="py-0" >
                    <v-text-field 
                      v-model="step.step_desc" 
                      :label="'Deskripsi Step ' + (index + 1)"
                    />
                  </v-col>
                  <v-col md="4" class="py-0" >
                    <v-text-field 
                      v-model="step.step_photo" 
                      :label="'Photo Step ' + (index + 1)" 
                      append-icon="mdi-delete" 
                      @click:append="removeStep(index)"
                    />
                  </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" class="d-flex justify-center align-center p-0">
                  <v-divider ></v-divider>
                </v-col>
                
                <v-col cols="2" class="d-flex justify-center align-center p-0">
                  <v-btn
                    @click.prevent="addStep" 
                    variant="text" 
                    size="small" 
                    prepend-icon="mdi-plus"
                  >
                    <small>Tambah Step</small>
                  </v-btn>
                </v-col>
                
                <v-col cols="5" class="d-flex justify-center align-center p-0">
                  <v-divider ></v-divider>
                </v-col>
                
              </v-row>
            </v-col>
          </v-row>
          <div class="mt-8 d-flex justify-end">
            <v-col cols="3" class="pa-0">
              <v-btn 
                type="submit" 
                color="success" 
                variant="tonal"
                @click="submitForm"
                block
              >
                Submit
              </v-btn>
            </v-col>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </v-container>

  <ModalCamera 
    ref="camera"
    :show="openCamera"
    @setImage="onSetForm"
    @setShow="onSetModalCamera(false)"
  />
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import ModalCamera from './ModalCamera.vue';
const emit = defineEmits(['submitForm'])
const fileImage = ref();
const openCamera = ref(false);
const camera = ref(null)
const form = ref({
  id:'',
  recipe_name: '',
  recipe_desc: '',
  recipe_image: '',
  steps: [
    { 
      step_name: '', 
      step_desc: '', 
      step_photo: '' 
    }
  ]
});

const addStep = () => {
  form.value.steps.push(
    { 
      step_name: '', 
      step_desc: '', 
      step_photo: '' 
    }
  );
};

const removeStep = (index) => {
  form.value.steps.splice(index, 1);
};

const onChooseFile = () => {
  const element = document.getElementById("fileInput")
  element.click()
};

const onRemoveFile = () => {
  fileImage.value = "";
  form.value.recipe_image = ''
};

const readFileAsBlob = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
    resolve(new Blob([reader.result], { type: file.type }));
    };
    reader.readAsArrayBuffer(file);
  });
};

const onCreateUploadFile = async (event) => {
  const file = event.target.files[0];
  const blobImage = await readFileAsBlob(file);
  
  fileImage.value = file.name;
  const formData = new FormData();
  formData.append('file', file);

  form.value.recipe_image = blobImage;
};

const submitData = () => {
  emit('submitForm', form);
};

const onSetModalCamera = (val) => {
  openCamera.value = val;
};

const onSetForm = (dataImage) => {
  form.value = {
    ...form.value,
    recipe_image: dataImage.value
  }
};


</script>