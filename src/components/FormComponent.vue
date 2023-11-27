<template>
    <v-dialog v-model="dialogOpen" width="720" @click:outside="closeFormDialog">
        <v-card>
            <v-card-title>
                <span class="text-h5">{{ selectedRecipeData.recipe_name }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" >
                            <form>
                                <v-text-field v-model="state.name"  :counter="10" label="Name" required ></v-text-field>
                                <v-text-field v-model="state.email"  label="E-mail" required ></v-text-field>
                                <v-select v-model="state.select" :items="items"  label="Item" required ></v-select>
                                <v-checkbox v-model="state.checkbox" label="Do you agree?" required ></v-checkbox>
                                <v-btn class="me-4" >
                                    submit
                                </v-btn>
                            </form>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="closeFormDialog"
                >
                    Close
                </v-btn>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="closeFormDialog"
                >
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, defineProps, onMounted, defineEmits  } from 'vue';
    import { reactive } from 'vue'

    const props = defineProps(['data']);
    const emit = defineEmits();

    const dialogOpen = ref(false);
    const selectedRecipeData = ref(null);

    onMounted(() => {
        dialogOpen.value = true;
        selectedRecipeData.value = props.data;
    });

    const closeFormDialog = () => {
        emit('closeFormDialog');
    };

  

  const initialState = {
    name: '',
    email: '',
    select: null,
    checkbox: null,
  }

  const state = reactive({
    ...initialState,
  })

  const items = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
  ]
  
</script>