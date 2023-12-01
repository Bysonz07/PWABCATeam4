<template>
  <div>
    <v-dialog width="52vw" v-model="props.show" @click:outside="closeCamera">
      <v-card class="pa-3">
          <div class="d-flex justify-center align-center mb-4">
            <video ref="video" muted autoplay controls style="width: 50vw; height: auto"></video>
          </div>
          <div class="d-flex justify-center">
            <v-btn id="startbutton" @click="takePicture" icon="mdi-account" variant="tonal" :disabled="!video"></v-btn>
          </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watchEffect, ref, watch } from 'vue';
import { useDevicesList, useUserMedia } from '@vueuse/core';

const video = ref()
const currentCamera = ref('')
const capturedImage = ref('')
const emit = defineEmits(['setImage', 'setShow'])
const props = defineProps({
  show: Boolean,
  test: undefined,
});

const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId
  },
});

const { stream, enabled } = useUserMedia({
  constraints: { video: { deviceId: currentCamera } },
});

const closeCamera = () => {
  emit('setShow', false);
  enabled.value = false;
}

const takePicture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 145;
  canvas.height = 86;

  const context = canvas.getContext('2d');
  context.drawImage(video.value, 0, 0,canvas.width,canvas.height);

  let b64Data= canvas.toDataURL('image/png');
  capturedImage.value = b64Data.substring(22)

  emit('setImage', capturedImage);
  closeCamera()
}

watch(props, function(oldVal, newVal) {
  const { show } = newVal;
  if (show) {
    enabled.value = true;
  } else {
    enabled.value = false;
  }
})

watchEffect(() => {
  if (video.value)
    video.value.srcObject = stream.value
})


</script>