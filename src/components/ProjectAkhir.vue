<template>
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
                <v-img cover max-height="250" height="250" :src="item.recipe_image"></v-img>
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
        <DeleteModal :data="selectedRecipeData" v-if="isDeleteDialogOpen"  @closeDeleteDialog="closeDeleteDialog" />
    </v-row>
</template>

<script setup>
    import { ref } from 'vue';
    import DetailModal from './DetailModal.vue';
    import FormComponent from './FormComponent.vue';
    import DeleteModal from './DeleteModal.vue';
    const datas = ref(
    [
        {
            "id":"1",
            "recipe_name" : "Mie Goreng",
            "recipe_image": "https://cdn0-production-images-kly.akamaized.net/Sor9t0j3HCLpYUYzBy5PYdZ68u0=/469x625/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4101378/original/077840000_1658820480-ikhsan-baihaqi-pbc2wXbQYpI-unsplash.jpg",
            "recipe_desc" : "modi voluptate ipsa corrupti sed quibusdam assumenda ad, molestias iure?",
            "steps":[
                {
                    "step_id": "1_1",
                    "step_name": "Persiapan Bahan",
                    "step_desc": "Siapkan bahan-bahan yang diperlukan, termasuk mie, sayuran, daging, telur, dan bumbu-bumbu.",
                    "step_photo": "./image_persiapan_bahan.png"
                },
                {
                    "step_id": "1_2",
                    "step_name": "Rebus Air untuk Mie",
                    "step_desc": "Masukkan air ke dalam panci dan rebus hingga mendidih. Setelah itu, masukkan mie ke dalam air mendidih dan masak hingga mie matang. Tiriskan mie dan sisihkan.",
                    "step_photo": "./image_rebus_mie.png"
                },
                {
                    "step_id": "1_3",
                    "step_name": "Tumis Bumbu",
                    "step_desc": "Panaskan minyak di wajan, tumis bumbu halus hingga harum. Bumbu dapat terdiri dari bawang putih, bawang merah, cabai, dan bumbu lain sesuai selera.",
                    "step_photo": "./image_tumis_bumbu.png"
                },
                {
                    "step_id": "1_4",
                    "step_name": "Tambahkan Daging dan Sayuran",
                    "step_desc": "Masukkan daging (misalnya ayam, sapi, atau udang) ke dalam wajan dan tumis hingga matang. Tambahkan sayuran seperti wortel, kubis, dan kacang polong. Aduk rata.",
                    "step_photo": "./image_tambah_daging_sayuran.png"
                },
                {
                    "step_id": "1_5",
                    "step_name": "Masukkan Telur dan Mie",
                    "step_desc": "Pecahkan telur ke dalam wajan, aduk rata dengan bahan lain. Selanjutnya, masukkan mie yang telah direbus sebelumnya. Aduk hingga semua bahan tercampur dengan baik.",
                    "step_photo": "./image_masukkan_telur_mie.png"
                },
                {
                    "step_id": "1_6",
                    "step_name": "Tambahkan Saus dan Bumbu Tambahan",
                    "step_desc": "Tambahkan saus kecap, saus tiram, garam, merica, dan bumbu lain sesuai selera. Aduk rata dan cicipi untuk penyesuaian rasa.",
                    "step_photo": "./image_tambah_saus_bumbu.png"
                },
                {
                    "step_id": "1_7",
                    "step_name": "Sajikan Mie Goreng",
                    "step_desc": "Angkat mie goreng dari wajan, sajikan dalam piring, dan berikan hiasan seperti bawang goreng atau daun bawang. Mie goreng siap dinikmati!",
                    "step_photo": "./image_sajikan_mie.png"
                }
            ]
        },
        {
            "id":"2",
            "recipe_name" : "Nasi Goreng",
            "recipe_image": "https://assets.unileversolutions.com/recipes-v2/242794.jpg",
            "recipe_desc" : "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse incidunt laborum aperiam natus autem odio ducimus, provident nihil dolorum eos, modi voluptate ipsa corrupti sed quibusdam assumenda ad, molestias iure?",
            "steps":[
                {
                    "step_id": "2_1",
                    "step_name": "Persiapan Bahan",
                    "step_desc": "Siapkan bahan-bahan seperti nasi, daging (ayam, sapi, atau udang), sayuran (wortel, kacang polong, bawang bombay), telur, dan bumbu-bumbu seperti bawang putih, kecap manis, saus tiram, garam, dan merica.",
                    "step_image": ""
                },
                {
                    "step_id": "2_2",
                    "step_name": "Masak Nasi",
                    "step_desc": "Masak nasi sesuai petunjuk di kemasan atau gunakan nasi yang sudah dingin semalam untuk hasil terbaik.",
                    "step_image": ""
                },
                {
                    "step_id": "2_3",
                    "step_name": "Tumis Bumbu",
                    "step_desc": "Panaskan minyak di wajan, tumis bumbu halus (bawang putih, bawang bombay) hingga harum.",
                    "step_image": ""
                },
                {
                    "step_id": "2_4",
                    "step_name": "Tambahkan Daging dan Sayuran",
                    "step_desc": "Masukkan daging dan sayuran ke dalam wajan. Tumis hingga daging matang dan sayuran menjadi lunak.",
                    "step_image": ""
                },
                {
                    "step_id": "2_5",
                    "step_name": "Masukkan Telur",
                    "step_desc": "Pecahkan telur ke dalam wajan dan aduk cepat hingga telur matang dan tercampur dengan bahan lainnya.",
                    "step_image": ""
                },
                {
                    "step_id": "2_6",
                    "step_name": "Tambahkan Nasi dan Saus",
                    "step_desc": "Masukkan nasi yang sudah dimasak ke dalam wajan. Tambahkan kecap manis, saus tiram, garam, dan merica sesuai selera. Aduk rata.",
                    "step_image": ""
                },
                {
                    "step_id": "2_7",
                    "step_name": "Aduk Rata dan Sajikan",
                    "step_desc": "Aduk semua bahan hingga rata. Sajikan nasi goreng di piring, dan berikan hiasan seperti irisan mentimun atau daun bawang.",
                    "step_image": ""
                }
            ]
        },
        {
            "id":"3",
            "recipe_name" : "Sop Buah",
            "recipe_image": "https://cdn.idntimes.com/content-images/community/2022/04/resep-es-buah-buka-puasa-cara-membuat-es-buah-sederhana-resep-es-buah-simpel-es-buah-segar-kresi-es-buah-untuk-takjil-takjil-es-buah-es-buah-untuk-jualan-9cde86371d7fc78c91ae80a6ffab250e-ed1fc87615e2f8bc3dcfa4cfbac17aca_600x400.jpg",
            "recipe_desc" : "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse incidunt laborum aperiam natus autem odio ducimus, provident nihil dolorum eos, modi voluptate ipsa corrupti sed quibusdam assumenda ad, molestias iure?",
            "steps":[
                {
                    "step_id": "3_1",
                    "step_name": "Persiapan Bahan",
                    "step_desc": "Siapkan buah-buahan segar seperti nanas, melon, anggur, apel, dan buah-buahan lain sesuai selera. Cuci bersih buah-buahan dan potong menjadi potongan kecil.",
                    "step_image": ""
                },
                {
                    "step_id": "3_2",
                    "step_name": "Campurkan Buah",
                    "step_desc": "Campurkan potongan buah dalam mangkuk besar. Pastikan untuk memilih kombinasi buah yang beraneka ragam untuk rasa yang lebih kaya.",
                    "step_image": ""
                },
                {
                    "step_id": "3_3",
                    "step_name": "Buat Sirup",
                    "step_desc": "Buat sirup dengan mencampurkan air, gula, dan sedikit air perasan jeruk lemon. Didihkan hingga gula larut dan biarkan dingin.",
                    "step_image": ""
                },
                {
                    "step_id": "3_4",
                    "step_name": "Tuangkan Sirup ke Buah",
                    "step_desc": "Tuangkan sirup yang telah dingin ke atas buah-buahan. Aduk perlahan agar sirup merata di seluruh buah.",
                    "step_image": ""
                },
                {
                    "step_id": "3_5",
                    "step_name": "Tambahkan Es Batu",
                    "step_desc": "Tambahkan es batu ke dalam sop buah untuk memberikan sensasi kelezatan dan kesegaran.",
                    "step_image": ""
                },
                {
                    "step_id": "3_6",
                    "step_name": "Sajikan",
                    "step_desc": "Sajikan sop buah dalam mangkuk atau gelas. Hidangkan segera dan nikmati kelezatan buah-buahan yang segar.",
                    "step_image": ""
                }
            ]
        },
        {
            "id":"4",
            "recipe_name" : "Mie Cakalang",
            "recipe_image": "https://cdn.idntimes.com/content-images/community/2022/04/resep-es-buah-buka-puasa-cara-membuat-es-buah-sederhana-resep-es-buah-simpel-es-buah-segar-kresi-es-buah-untuk-takjil-takjil-es-buah-es-buah-untuk-jualan-9cde86371d7fc78c91ae80a6ffab250e-ed1fc87615e2f8bc3dcfa4cfbac17aca_600x400.jpg",
            "recipe_desc" : "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse incidunt laborum aperiam natus autem odio ducimus, provident nihil dolorum eos, modi voluptate ipsa corrupti sed quibusdam assumenda ad, molestias iure?",
            "steps":[
                {
                    "step_id"   : "1_1",
                    "step_name" : "Masak Air",
                    "step_desc" : "Masukkan 250ml Air ke dalam panci dan rebus hingga mendidih",
                    "step_photo": "./image_air.png"
                },
                {
                    "step_id"   : "1_2",
                    "step_name" : "Masukkan Mie kedalam Air Mendidih",
                    "step_desc" : "Masukkan 250ml Air ke dalam panci dan rebus hingga mendidih",
                    "step_photo": "./image_air.png"
                },
                {
                    "step_id"   : "1_3",
                    "step_name" : "Tiriskan",
                    "step_desc" : "Masukkan 250ml Air ke dalam panci dan rebus hingga mendidih",
                    "step_photo": "./image_air.png"
                },
                {
                    "step_id"   : "1_4",
                    "step_name" : "Sajikan",
                    "step_desc" : "Masukkan 250ml Air ke dalam panci dan rebus hingga mendidih",
                    "step_photo": "./image_air.png"
                },
            ]
        },
        {
            "id":"5",
            "recipe_name" : "Kwetiau",
            "recipe_image": "https://cdn.idntimes.com/content-images/community/2022/04/resep-es-buah-buka-puasa-cara-membuat-es-buah-sederhana-resep-es-buah-simpel-es-buah-segar-kresi-es-buah-untuk-takjil-takjil-es-buah-es-buah-untuk-jualan-9cde86371d7fc78c91ae80a6ffab250e-ed1fc87615e2f8bc3dcfa4cfbac17aca_600x400.jpg",
            "recipe_desc" : "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse incidunt laborum aperiam natus autem odio ducimus, provident nihil dolorum eos, modi voluptate ipsa corrupti sed quibusdam assumenda ad, molestias iure?",
            "steps":[
                {
                    "step_id"   : "1_1",
                    "step_name" : "Masak Air",
                    "step_desc" : "Masukkan 250ml Air ke dalam panci dan rebus hingga mendidih",
                    "step_photo": "./image_air.png"
                },
                {
                    "step_id"   : "1_2",
                    "step_name" : "Masukkan Mie kedalam Air Mendidih",
                    "step_desc" : "Masukkan 250ml Air ke dalam panci dan rebus hingga mendidih",
                    "step_photo": "./image_air.png"
                },
                {
                    "step_id"   : "1_3",
                    "step_name" : "Tiriskan",
                    "step_desc" : "Masukkan 250ml Air ke dalam panci dan rebus hingga mendidih",
                    "step_photo": "./image_air.png"
                },
                {
                    "step_id"   : "1_4",
                    "step_name" : "Sajikan",
                    "step_desc" : "Masukkan 250ml Air ke dalam panci dan rebus hingga mendidih",
                    "step_photo": "./image_air.png"
                },
            ]
        }
    ])
    const selectedRecipeData = ref();
    const isDetailDialogOpen = ref(false);
    const isFormDialogOpen = ref(false);
    const isDeleteDialogOpen = ref(false);

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
    };

    const closeDeleteDialog = () => {
        isDeleteDialogOpen.value = false;
    };
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
    width: 100%;
    cursor: pointer;
}

.cards {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
</style>