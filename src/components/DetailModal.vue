<template>
    <v-dialog v-model="dialogOpen" width="720" @click:outside="closeDialog">
        <v-card>
            <v-card-title>
                <span class="text-h5">{{ selectedRecipeData.recipe_name }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" >
                            <v-expansion-panels multiple>
                                <v-expansion-panel 
                                    v-for="listRecipe in selectedRecipeData.steps" 
                                    :key="listRecipe.id"
                                >
                                    <v-expansion-panel-title> {{ listRecipe.step_name }}
                                    <template v-slot:actions="{ expanded }">
                                        <v-icon :icon="expanded ? 'mdi-pencil' : ''"></v-icon>
                                    </template></v-expansion-panel-title>
                                    <v-expansion-panel-text>{{ listRecipe.step_desc }}</v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="closeDialog"
                >
                    Close
                </v-btn>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="closeDialog"
                >
                    Save
                </v-btn>
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
    });

    const closeDialog = () => {
        emit('closeDialog');
    };
</script>