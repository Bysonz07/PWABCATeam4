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
    import { ref, defineProps, onMounted, defineEmits  } from 'vue';

    const props = defineProps(['data']);
    const selectedRecipeData = ref(null);
    const emit = defineEmits();
    const deleteDialog = ref(false);

    onMounted(() => {
        deleteDialog.value = true;
        selectedRecipeData.value = props.data;
    });

    const closeDeleteDialog = () => {
        emit('closeDeleteDialog');
    };

    const deleteBtn = () => {
        //TODO logic delete
        console.log("delete " + selectedRecipeData.value.recipe_name)
    };

</script>