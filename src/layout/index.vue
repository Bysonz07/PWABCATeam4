<template>
    <v-layout class="rounded rounded-md">
        <v-app-bar>
            <div class="ms-3 d-flex">
                <img src="/TODO.png" style="width: 3em; height: auto;"/>
                <div class="d-flex flex-column justify-center">
                    <div>TODO <b>RECIPE</b></div>
                </div>
            </div>
        </v-app-bar>

        <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            <ProjectAkhir />
        </v-main>
    </v-layout>
</template>

<script setup>
import ProjectAkhir from '../components/ProjectAkhir.vue';
</script>