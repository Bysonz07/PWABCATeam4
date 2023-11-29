<template>
    <v-dialog v-model="dialogOpen" width="960" @click:outside="closeFormDialog">
        <v-card>
            <v-card-title>
                <span class="text-h5" v-if="selectedRecipeData != null">Edit {{ selectedRecipeData.recipe_name }}</span>
                <span class="text-h5" v-else="selectedRecipeData != null">Add Resep Baru</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" >
                            <v-form @submit.prevent="submitForm">
                                <v-row>
                                    <v-col cols="12" class="py-0">
                                        <v-text-field v-model="form.recipe_name" label="Nama"></v-text-field>
                                        <v-textarea v-model="form.recipe_desc" label="Description Resep"></v-textarea>
                                        <v-row v-for="(step, index) in form.steps" :key="index" >
                                            <v-col md="4" class="py-0">
                                                <v-text-field v-model="step.step_name" :label="'Nama Step ' + (index + 1)" ></v-text-field>
                                            </v-col>
                                            <v-col md="4" class="py-0" >
                                                <v-text-field v-model="step.step_desc" :label="'Deskripsi Step ' + (index + 1)"></v-text-field>
                                            </v-col>
                                            <v-col md="4" class="py-0" >
                                                <v-text-field v-model="step.step_photo" :label="'Photo Step ' + (index + 1)" append-icon="mdi-delete" @click:append="removeStep(index)"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-btn block @click="addStep" color="primary" class="mt-2 py-5">Tambah Step</v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeFormDialog">Close</v-btn>
                <v-btn type="submit" color="success" @click="submitForm">Submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, defineProps, onMounted, defineEmits  } from 'vue';

    const props = defineProps(['data']);
    const emit = defineEmits();

    const dialogOpen = ref(false);
    const selectedRecipeData = ref(null);

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
    };

</script>