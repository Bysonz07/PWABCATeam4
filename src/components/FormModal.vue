<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="1024" >
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    Add Data
                </v-btn>
                <v-btn color="dark" v-bind="props">
                    Fetch Data
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="text-h5">To do List</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" >
                                <v-text-field label="Todo Name *" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea label="List todo*" required ></v-textarea>
                            </v-col>
                            <!-- <v-col cols="12">
                                <v-file-input label="Image File*" accept="image/png, image/jpeg, image/bmp" placeholder="Pick an avatar" prepend-icon="mdi-camera"></v-file-input>
                            </v-col> -->
                            <v-col cols="12">
                                <v-select :items="['Choose Image', 'Open Camera']" label="Image*" v-on:modelValue="onValueChange(`$`)"></v-select>
                                <!-- <v-menu :location="location">
                                    <template v-slot:activator="{ props }">
                                        <v-file-input label="Image File*" accept="image/png, image/jpeg, image/bmp" placeholder="Pick an avatar" prepend-icon="mdi-camera"></v-file-input>
                                    </template>
                                </v-menu> -->
                                <input id='fileid' type='file' hidden/>
                                <!-- <v-menu :close-on-content-click="false"  :close-on-click="false">
                                    <span slot="activator">Open dropdown</span>
                                    <v-list>
                                        <v-list-tile @click=""><v-list-tile-title>Menu item 1</v-list-tile-title></v-list-tile>
                                        <v-list-tile @click=""><v-list-tile-title>Menu item 2</v-list-tile-title></v-list-tile>
                                        <v-list-tile @click=""><v-list-tile-title>Menu item 3</v-list-tile-title></v-list-tile>
                                        <v-list-tile @click=""><v-text-field label="Search" append-icon="search"></v-text-field></v-list-tile>
                                    </v-list>
                                </v-menu> -->
                            </v-col>
                            
                            
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="dialog = false"
                    >
                        Close
                    </v-btn>
                    <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="dialog = false"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
export default {
    data: () => ({
        dialog: false,
    }),
}
</script>
<script setup>
import { ref } from 'vue'

const onValueChange = (v) => {
  console.log("Value updated ", v)
}
</script>