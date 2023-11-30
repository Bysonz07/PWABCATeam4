<template>
    <v-dialog v-model="dialogOpen" width="960" @click:outside="closeFormDialog">
        <v-card class="pa-3 pt-6">
            <div style="position: absolute; right: 10px; top: 10px">
                <v-btn 
                    icon="mdi-close"
                    variant="tonal"
                    size="small"
                    @click="closeFormDialog"
                />
            </div>
            <v-card-title class="text-center">
                <span class="text-h5" v-if="selectedRecipeData != null">
                    EDIT {{ selectedRecipeData.recipe_name?.toUpperCase() }}
                </span>
                <span class="text-h5" v-else>
                    ADD RESEP BARU
                </span>
            </v-card-title>
            <v-container>
                <v-row>
                    <v-col cols="12" >
                        <RecipeForm />
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
    <div>
        <div>
        <p>
            Supported: {{isSupported}}
        </p>
        </div>

        <div v-if="isSupported">
        <button @click="show()">
            Show Notification
        </button>
        </div>
        <div v-else>
            The Notification Web API is not supported in your browser.
        </div>
    </div>
</template>

<script setup>
    import { ref, defineProps, onMounted, defineEmits, watchEffect } from 'vue';
    import { useDevicesList, useUserMedia, useWebNotification } from '@vueuse/core';
    import RecipeForm from './RecipeForm.vue'
    const broadcast = new BroadcastChannel('todo-recipe-channel');
    const options = {
        title: 'Hello, world from VueUse!',
        dir: 'auto',
        lang: 'en',
        renotify: true,
        tag: 'test',
        onclick: function(){
            console.log("masook")
        },
        onclose: () => console.log('onclose masok')
        }
    const { isSupported, show } = useWebNotification()
    broadcast.onmessage = (event) => {
        if (event.data && event.data.type === 'CRITICAL_SW_UPDATE') {
            // Show "update to refresh" banner to the user.
            const payload = event.data.payload;

            // Log the payload to the console
            console.log({payload});
            show()
        }
    };
    const props = defineProps(['data']);
    const emit = defineEmits();
    const dbName = "TODO Receipe";
    const receipeList = ref([]);
    const dialogOpen = ref(false);
    const selectedRecipeData = ref(null);
    const fileImage = ref("")
    const currentCamera = ref('')
    const isPhotoTaken = ref(false);
    const isShotPhoto = ref(false);
    const capturedImage = ref('');
    const openCamera = ref(false);

    const { videoInputs: cameras } = useDevicesList({
    requestPermissions: true,
    onUpdated() {
        if (!cameras.value.find(i => i.deviceId === currentCamera.value))
        currentCamera.value = cameras.value[0]?.deviceId
    },
    })

    const video = ref()
    const { stream, enabled } = useUserMedia({
        constraints: { video: { deviceId: currentCamera } },
    })

    watchEffect(() => {
        if (video.value)
            video.value.srcObject = stream.value
    })
    onMounted(() => {
        dialogOpen.value = true;
        selectedRecipeData.value = props.data;

        if(selectedRecipeData.value != null){
            form.value.id = selectedRecipeData.value.id;
            form.value.recipe_name = selectedRecipeData.value.recipe_name;
            form.value.recipe_desc = selectedRecipeData.value.recipe_desc;
            form.value.recipe_image = selectedRecipeData.value.recipe_image;
            form.value.steps = selectedRecipeData.value.steps;
        }

        const broadcast = new BroadcastChannel('todo-recipe-channel');
        
        // listen from service worker
        broadcast.onmessage = (event) => {
            if (event.data && event.data.type === 'CRITICAL_SW_UPDATE') {
                // Show "update to refresh" banner to the user.
                const payload = event.data.payload;
            
                // Log the payload to the console
                console.log(payload);
                show({
                    title: payload.details
                })
            }
        };
    });

    const closeFormDialog = () => {
        emit('closeFormDialog');
    };

    const form = ref({
        id:'',
        recipe_name: '',
        recipe_desc: '',
        recipe_image: '',
        steps: [{ step_name: '', step_desc: '', step_photo: '' }]
    });

    const addStep = () => {
        form.value.steps.push({ step_name: '', step_desc: '', step_photo: '' });
    };

    const removeStep = (index) => {
        form.value.steps.splice(index, 1);
    };

    const submitForm = () => {
        if(selectedRecipeData.value != null){
            // TODO logic UPDATE
            console.log("update " + selectedRecipeData.value.recipe_name)
        } else {
            // TODO logic ADD
            console.log("add")
        }
        addData(form.value)
    };

    const onChooseFile = () => {
        const element = document.getElementById("fileInput")
        element.click()
    }

    const readFileAsBlob = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
            resolve(new Blob([reader.result], { type: file.type }));
            };
            reader.readAsArrayBuffer(file);
        });
    }

    const onCreateUploadFile = async (event) => {
        const file = event.target.files[0];
        const blobImage = await readFileAsBlob(file);
       
        fileImage.value = file.name;
        const formData = new FormData();
        formData.append('file', file);

        form.value.recipe_image = blobImage;
    }

    const onRemoveFile = () => {
        fileImage.value = "";
        form.value.recipe_image = ''
    }

    //indexdb

    const addData = (receipeData) => {
        
        const request = indexedDB.open(dbName, 2);
        const uuid = crypto.randomUUID();
        receipeData["id"] = uuid;
        
        request.onerror = (event) => {
            console.error("Error opening database:", event.target.error);
        };

        const payload = {
            uuid,
            name: receipeData.recipe_name,
            desc: receipeData.recipe_desc,
            img: receipeData.recipe_image
        }
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            const objectStore = db.createObjectStore("receipes", { keyPath: "uuid" });
            objectStore.createIndex("name", "name", { unique: true });
            objectStore.createIndex("desc", "desc", { unique: false });
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
            // readData()
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

    const readTransaction = db.transaction("customers", "readonly");
    const customerObjectStore = readTransaction.objectStore("customers");

    const customersCursor = customerObjectStore.openCursor();

    customersCursor.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        // customers.value.push(cursor.value);
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
        // customers.value.splice(0, customers.value.length);
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

    const updateTransaction = db.transaction("customers", "readwrite");
    const customerObjectStore = updateTransaction.objectStore("customers");
    const updateData = userList.value.filter((el) => el.uuid === uuid);
    console.log({ updateData })

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

const deleteData = (uuid) => {
  const request = indexedDB.open(dbName, 2);

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const deleteTransaction = db.transaction("customers", "readwrite");
    const deleteObjectStore = deleteTransaction.objectStore("customers");

    const deleteRequest = deleteObjectStore.delete(uuid);

    deleteRequest.onsuccess = (event) => {
      readData()
      deletedData.value = "Yes";
    };

    deleteRequest.onerror = (event) => {
      console.error("Error deleting data", event.target.error);
      deletedData.value = "No";
    };

    deleteTransaction.oncomplete = () => {
      userList.value = userList.value.filter((el) => el.uuid != uuid)
      db.close();
    };
  };
};

const fetchData = async () => {
  fetch("https://dummyjson.com/products/category/smartphones", { method: "GET"})
    .then((resp) => {
      return resp.json();
    })
    .then((res) => {
      console.log({ res })
      if (Array.isArray(res?.products) && res.products.length > 0) data.value = res.products;
    })
    .catch((err ) => {
      console.log({ err })
    })
}


</script>