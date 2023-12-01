<template >
    <v-row>
        <v-col class="d-flex align-self-stretch" xl="3" md="3" sm="6" >
            <v-card @click="openFormDialog(null)" class="blur-card mx-auto my-12" > 
                <v-icon size="64" class="grey--text">mdi-plus</v-icon>
                <v-card-subtitle class="mt-4">Add New Recipe</v-card-subtitle>
            </v-card>
        </v-col>
        <v-col v-for="item in datas" :key="item.id" xl="3" md="3" sm="6" class="d-flex align-self-stretch">
            <v-card class="mx-auto my-12 cards">
                <v-btn class="edit-button" icon @click="openFormDialog(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn class="delete-button" icon @click="openDeleteDialog(item)">
                    <v-icon>mdi-trash-can</v-icon>
                </v-btn>
                <v-img cover max-height="250" height="250" :src="item.recipe_image" ></v-img>
                <v-card-item>
                    <v-card-title>{{ item.recipe_name }}</v-card-title>
                    <v-card-subtitle>
                        Local Favorite
                        <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>
                    </v-card-subtitle>
                </v-card-item>

                <v-card-text >
                    {{ item.recipe_desc }}
                </v-card-text>
                
                <v-divider class="mx-4 mb-1"></v-divider>
                <v-card-actions class="justify-center">
                    <v-btn color="deep-purple" variant="text" @click="openDialog(item)">See Recipe</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>

        <!-- Dialog -->
        <DetailModal :data="selectedRecipeData" v-if="isDetailDialogOpen"  @closeDialog="closeDialog" />

        <!-- Form Dialog -->
        <FormComponent :data="selectedRecipeData" v-if="isFormDialogOpen"  @closeFormDialog="closeFormDialog" />

        <!-- Delete Dialog -->
        <DeleteModal :data="selectedRecipeData" v-if="isDeleteDialogOpen" :key="renderKey"  @closeDeleteDialog="closeDeleteDialog" />
    </v-row>
</template>

<script setup>
    import { ref,onMounted, watch,} from 'vue';
    import DetailModal from './DetailModal.vue';
    import FormComponent from './FormComponent.vue';
    import DeleteModal from './DeleteModal.vue';
    import axios from 'axios';
    
    const datas = ref([])
    const selectedRecipeData = ref();
    const isDetailDialogOpen = ref(false);
    const isFormDialogOpen = ref(false);
    const isDeleteDialogOpen = ref(false);
    const renderKey = ref(0)

    const fetchData = async () => {
        try {
            const resData = await axios.get("https://6560435083aba11d99d07de5.mockapi.io/recipes")
            if(resData?.status == 200){
                resData.data.forEach(el => {
                    if(!(el?.recipe_image?.includes(".jpg"))){
                        el.recipe_image = "data:image/png;base64," + el.recipe_image
                    }
                })
                datas.value = resData.data
            }
        } catch (error){
            console.log('error', error)
        }
    }

    onMounted(fetchData)

    const openDialog = (item) => {
        selectedRecipeData.value = item;
        isDetailDialogOpen.value = true;
    };

    const openFormDialog = (item) => {
        selectedRecipeData.value = item;
        isFormDialogOpen.value = true;
    };

    const openDeleteDialog = (item) => {
        selectedRecipeData.value = item;
        isDeleteDialogOpen.value = true;
    };

    const closeDialog = () => {
        isDetailDialogOpen.value = false;
    };

    const closeFormDialog = () => {
        isFormDialogOpen.value = false;
        fetchData();
    };

    const closeDeleteDialog = () => {
        isDeleteDialogOpen.value = false;
        fetchData();
    };

    const updateComponent = () => {
        renderKey.value += 1
    }

    watch(renderKey,() =>{
        fetchData()
    })


</script>

<style scoped>
.blur-card {
    background: rgb(34,193,195);
    background: linear-gradient(45deg, rgb(255, 255, 255) 0%, rgb(255, 174, 0) 100%);
    backdrop-filter: blur(5px); 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    min-height: 60vh;
    min-width: 15vw;
    width: 100%;
    cursor: pointer;
}

.cards {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 60vh;
    min-width: 15vw;
    width: 100%;
}

.edit-button {
    background-color: #ffffff;
  position: absolute;
  top: 0;
  right: 0;
  border-top-right-radius: 0; 
  border-top-left-radius: 0; 
  border-bottom-right-radius: 0; 
  z-index: 99;
}

.edit-button:hover {
    box-shadow: 0px 0px 40px rgba(255, 255, 255, 0.9);
}

.delete-button {
    background-color: #a70000;
    color:#e2e2e2;
    position: absolute;
    top: 0;
    right: left;
    border-top-right-radius: 0; 
    border-top-left-radius: 0; 
    border-bottom-left-radius: 0; 
    z-index: 99;
}

.delete-button:hover {
    box-shadow: 0px 0px 40px rgba(255, 0, 0, 0.9);
}
.fill-container {
  width: 100%;
  height: 100%;
}
</style>