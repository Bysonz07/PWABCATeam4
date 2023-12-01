<template>
    <v-dialog v-model="deleteDialog" width="auto" @click:outside="closeDeleteDialog">
        <v-card>
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
    import { ref, defineProps, onMounted, defineEmits} from 'vue';
    import axios from 'axios';

    const props = defineProps(['data']);
    const selectedRecipeData = ref(null);
    const emit = defineEmits(['updateComponent','closeDeleteDialog']);
    const deleteDialog = ref(false);
    const dbName = "TODO Receipe";


    onMounted(() => {
        deleteDialog.value = true;
        selectedRecipeData.value = props.data;
    });

    const closeDeleteDialog = () => {
        emit('updateComponent');
        emit('closeDeleteDialog');

    };

    const deleteBtn = async () => {
        try {
            const resData = await axios.delete(`https://6560435083aba11d99d07de5.mockapi.io/recipes/${selectedRecipeData.value.id}`);
            deleteData(selectedRecipeData.value.id)
            closeDeleteDialog()
        } catch (error){
            console.log('error', error)
        }
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

</script>