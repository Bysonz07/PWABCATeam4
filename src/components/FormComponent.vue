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
                        <RecipeForm  :selectedRecipe="selectedRecipeData" @closeRecipeDialog="closeFormDialog"/>
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
    import { ref, defineProps, onMounted, defineEmits, watchEffect, watch, toRaw } from 'vue';
    import { useDevicesList, useUserMedia, useWebNotification } from '@vueuse/core';
    import RecipeForm from './RecipeForm.vue';
    const broadcast = new BroadcastChannel('todo-recipe-channel');
    const { isSupported, show } = useWebNotification()
    broadcast.onmessage = (event) => {
        if (event.data && event.data.type === 'CRITICAL_SW_UPDATE') {
            const payload = event.data.payload;
            show()
        }
    };
    const props = defineProps(['data']);
    const emit = defineEmits(['closeFormDialog']);
    const dialogOpen = ref(false);
    const selectedRecipeData = ref(null);
    const currentCamera = ref('')

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
        
        broadcast.onmessage = (event) => {
            if (event.data && event.data.type === 'CRITICAL_SW_UPDATE') {
                const payload = event.data.payload;
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
  

</script>