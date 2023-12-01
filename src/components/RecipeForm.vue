<template>
  <v-container>
    <v-row>
      <v-col cols="12" >
        <v-form @submit.prevent="submitData">
          <v-row>
            <v-col cols="12" class="py-0">
              <v-text-field name="nama" v-model="form.recipe_name" label="Nama" />
              <v-textarea name="desc" v-model="form.recipe_desc" label="Description Resep" />
              <input name="fileInput" type="file" id="fileInput" hidden @change="onCreateUploadFile"/>
              <v-menu>
                <template v-slot:activator="{ props }">
                    <v-text-field v-model="form.recipe_image" placeholder="Foto Masakan" readonly v-bind="props" clearable @click:clear="onRemoveFile"/>
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
              <v-row v-for="(step, index) in form.steps" :key="index" class="mt-2">
                <v-col xl="6" sm="6" md="6" class="py-0">
                  <v-text-field v-model="step.step_name" :label="'Nama Step ' + (index + 1)" />
                </v-col>
                <v-col xl="6" sm="6" md="6" class="py-0" >
                  <v-text-field v-model="step.step_desc" :label="'Deskripsi Step ' + (index + 1)" append-icon="mdi-delete" @click:append="removeStep(index)"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" class="d-flex justify-center align-center p-0">
                  <v-divider ></v-divider>
                </v-col>
                <v-col cols="2" class="d-flex justify-center align-center p-0">
                  <v-btn @click.prevent="addStep" variant="text" size="small" prepend-icon="mdi-plus" append-icon="mdi-plus">
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
              <v-btn type="submit" color="success" variant="tonal" @click="submitForm" block>
                Submit
              </v-btn>
            </v-col>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
  <ModalCamera ref="camera" :show="openCamera" @setImage="onSetForm" @setShow="onSetModalCamera(false)"/>
</template>

<script setup>
import { ref, defineEmits, defineProps,  onMounted } from 'vue';
import ModalCamera from './ModalCamera.vue';
import {  useWebNotification } from '@vueuse/core';
const broadcast = new BroadcastChannel('todo-recipe-channel');
const { isSupported, show } = useWebNotification()
broadcast.onmessage = (event) => {
    if (event.data && event.data.type === 'CRITICAL_SW_UPDATE') {
        const payload = event.data.payload;
        show()
    }
};
const props = defineProps(['selectedRecipe']);
const emit = defineEmits(['closeRecipeDialog']);
const dbName = "TODO Receipe";
const fileImage = ref();
const openCamera = ref(false);
const camera = ref(null)
const stepCount = ref(1)
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
      step_id: `1_${stepCount}`,
      step_name: '', 
      step_desc: '', 
      step_photo: '' 
    }
  );
  stepCount.value += 1
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
  fileImage.value = file.name;
  const formData = new FormData();
  formData.append('file', file);
  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 120;
      canvas.height = 70;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let b64Data= canvas.toDataURL('image/png');
      form.value.recipe_image = b64Data.substring(22);
    };
  };
  reader.readAsDataURL(file); 
};


const submitData = () => {
  emit('refKey',1)
};

const submitForm = async () => {
  try {
    if(form.value.id.length > 0){
      if(form.value.recipe_image.includes(',')){
        const text = form.value.recipe_image.split(",");
        form.value.recipe_image = text[1];
      }
      const response = await fetch(`https://6560435083aba11d99d07de5.mockapi.io/recipes/${form.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.value),
      });
      if (response.ok) {
        updateData(form.value)
        console.log('Data sent successfully');
      } else {
        console.error('Failed to send data');
      }
    } else {
      const response = await fetch('https://6560435083aba11d99d07de5.mockapi.io/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.value),
      });
      if (response.ok) {
        const data = await response.json()
        form.value.id = data.id;
        addData(form.value)
      } else {
        console.error('Failed to send data');
      }
    }
  } catch (error) {
    console.log('error', error)
  }
  emit('closeRecipeDialog')
}

const addData = (receipeData) => {
  const request = indexedDB.open(dbName, 2);
  const uuid = crypto.randomUUID();
  
  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  const payload = {
    uuid: receipeData.id,
    name: receipeData.recipe_name,
    desc: receipeData.recipe_desc,
    desc: receipeData.recipe_image
  }
  
  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    const objectStore = db.createObjectStore("receipes", { keyPath: "uuid" });
    objectStore.createIndex("name", "name", { unique: true });
    objectStore.createIndex("desc", "desc", { unique: false });
    objectStore.createIndex("image", "image", { unique: false });
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const addTransaction = db.transaction("receipes", "readwrite");
    const customerObjectStore = addTransaction.objectStore("receipes");

    const addRequest = customerObjectStore.add(payload);

    addRequest.onsuccess = (event) => {
      console.log("Data added successfully");
    
    };

    addRequest.onerror = (event) => {
      console.error("Error adding data", event.target.error);
    
    };

    addTransaction.oncomplete = () => {
    show({ title: "success add recipe"})
      db.close();
    };
  };
};

const readData = () => {
  const request = indexedDB.open(dbName, 2);

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const readTransaction = db.transaction("recipes", "readonly");
    const customerObjectStore = readTransaction.objectStore("recipes");

    const customersCursor = customerObjectStore.openCursor();

    customersCursor.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        let key = cursor.primaryKey;
        let value = cursor.value;
        let imageURL = URL.createObjectURL(value.image);
        let existdata = false;
        userList.value.forEach((el) => {
          if (el.uuid === key) existdata = true;
        })

        if (!existdata) {
          userList.value.push(value);
        }
        cursor.continue();
      } else {
        console.log("Data read successfully");
        db.close();
      }
    };

    customersCursor.onerror = (event) => {
      console.error("Error reading data", event.target.error);
      db.close();
    };
  };
};

const updateData = (uuid) => {
  const request = indexedDB.open(dbName, 2);

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const updateTransaction = db.transaction("recipes", "readwrite");
    const customerObjectStore = updateTransaction.objectStore("recipes");
    const updateData = userList.value.filter((el) => el.uuid === uuid);

    if (updateData.length > 0) {
      updateData.at(0).name = `${updateData.at(0).name} update`
      const updateRequest = customerObjectStore.put(updateData.at(0));
    }

    updateRequest.onsuccess = (event) => {
      console.log("Data updated successfully");
      updatedData.value = "Yes";
    };

    updateRequest.onerror = (event) => {
      console.error("Error updating data", event.target.error);
      updatedData.value = "No";
    };

    updateTransaction.oncomplete = () => {
      console.log("Update transaction completed");
      db.close();
    };
  };
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

onMounted(() => {
  if(props.selectedRecipe != null){
    form.value = props.selectedRecipe
  } 

  const broadcast = new BroadcastChannel('todo-recipe-channel');
  broadcast.onmessage = (event) => {
      if (event.data && event.data.type === 'CRITICAL_SW_UPDATE') {
          const payload = event.data.payload;
          show({
              title: payload.details
          })
      }
  };
})


</script>