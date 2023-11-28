<template>
    <v-card :loading="loading" class="mx-auto my-12">
        <template v-slot:loader="{isActive}">
            <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate>
                
            </v-progress-linear>
        </template>
        <v-img cover height="250" :src="item.recipe_image"></v-img>
        <v-card-item>
            <v-card-title>{{ item.recipe_name }}</v-card-title>
            <v-card-subtitle>
                Local Favorite
                <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>
            </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            {{ item.recipe_desc }}
        </v-card-text>
        <v-divider class="mx-4 mb-1"></v-divider>
        <v-card-actions class="mt-auto">
            <v-btn color="deep-purple" variant="text" @click="openDialog(item)">See Recipe</v-btn>
            <v-btn color="dark" variant="text" @click="openFormDialog(item)">Open Form</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
    const props = defineProps({
        loading: Boolean,
        item,
    })
</script>