<template>
            <v-dialog v-model="deleteDialog" width="auto" @click:outside="closeDeleteDialog">
                <v-card>
                    <v-card-title>
                        
                    </v-card-title>
                    <v-card-text>
                        Anda yakin ingin menghapus <b>{{ selectedRecipeData.recipe_name }}</b>?
                    </v-card-text>
                    <v-card-actions class="justify-space-between">
                        <v-btn color="error" variant="text" @click="deleteBtn"> Hapus </v-btn>
                        <v-btn color="primary" variant="text" @click="closeDeleteDialog"> Batal </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
</template>

<script setup>
    import { ref, defineProps, onMounted, defineEmits, getCurrentInstance, watch  } from 'vue';
    import axios from 'axios';

    const props = defineProps(['data']);
    const selectedRecipeData = ref(null);
    const emit = defineEmits();
    const deleteDialog = ref(false);

    onMounted(() => {
        deleteDialog.value = true;
        selectedRecipeData.value = props.data;
        console.log(99,selectedRecipeData.value)
    });

    const closeDeleteDialog = () => {
        emit('updateComponent');
        emit('closeDeleteDialog');

    };

    const deleteBtn = async () => {
        //TODO logic delete
        console.log("delete " + selectedRecipeData.value.recipe_name)
        try {
            console.log("Hello Axios")
            const resData = await axios.delete(`https://6560435083aba11d99d07de5.mockapi.io/recipes/${selectedRecipeData.value.id}`)
            console.log(resData)
            closeDeleteDialog()
        } catch (error){
            console.log('error', error)
        }
    };

    // watch(selectedRecipeData, async(newVal, oldVal) =>{
    //     console.log('newVal , oldVal', newVal , oldVal)
    //     if(oldVal != newVal){
    //         closeDeleteDialog()
    //     }
    // })

</script>