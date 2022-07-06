<template>
  <div v-if="specieData" class="px-10">
    <div class="grid grid-cols-3 gap-4 bg-green-100 mb-5">
      <h1 class="text-2xl font-bold">
        <button
          class="px-4 py-2 text-sm bg-gray-400 text-white font-semibold rounded-full border border-gray-200 hover:text-white hover:bg-gray-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
          @click="goBack()"
        >
          <FontAwesomeIcon :icon="['fas', 'list']" />
        </button>

        <span v-if="specieData._id" class="pl-2">Edit</span>
        <span v-else class="pl-2">New</span> Specie
      </h1>
    </div>

    <button class="button" @click="$refs.file.click()">
      <input
        type="file"
        ref="file"
        @change="loadImage($event)"
        accept="image/*"
      />
      Load image
    </button>

    <AgModal :isOpen="isOpenCropperModal">
      <template #default>
        <div class="text-right">
          <a
            href="#"
            class="col-12 text-balck-500 hover:text-gray-500 mx-2"
            @click="isOpenCropperModal = false"
            ><FontAwesomeIcon :icon="['fas', 'times']"
          /></a>
        </div>

        <cropper
          class="cropper"
          :src="image.src"
          :stencil-props="{
            aspectRatio: 10 / 12,
          }"
          :stencil-component="$options.components.CircleStencil"
          style="width: 300px"
          @change="changeCropper"
        />

        <button
          class="px-4 py-1 my-2 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 float-right"
        >
          Crop
        </button>
      </template>
    </AgModal>

    <form id="specieForm">
      <div
        class="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6"
      >
        <div v-if="resultCropper">
          <preview
            class="block h-24 rounded-full sm:mx-0 sm:shrink-0"
            :width="120"
            :height="120"
            :image="resultCropper.image"
            :coordinates="resultCropper.coordinates"
          />
        </div>
        <img
          v-else
          class="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0"
          :src="
            resultCropper
              ? resultCropper.image
              : specieData.image
              ? specieData.image
              : thubmnailImage
          "
          alt="Specie's photo"
        />
        <div class="text-center space-y-2 sm:text-left">
          <div class="space-y-0.5">
            <p class="text-lg text-black font-semibold">
              {{ specieData.name }}
            </p>
            <p class="text-slate-500 font-medium">{{ specieData.family }}</p>
          </div>
          <button
            class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
            @click.prevent="saveSpecie()"
          >
            Save
          </button>
        </div>
      </div>

      <div
        class="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:items-center sm:space-y-0 sm:space-x-6"
      >
        <div class="text-center space-y-2 sm:text-left">
          <label class="block w-96 font-semibold">
            Name
            <input
              type="text"
              name="name"
              class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              placeholder="Name"
              v-model="specieData.name"
            />
          </label>

          <label class="block w-96 font-semibold">
            Common Name
            <input
              type="text"
              name="commonName"
              class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              placeholder="Common Name"
              v-model="specieData.commonName"
            />
          </label>

          <label class="block w-96 font-semibold">
            Family
            <input
              type="text"
              name="family"
              class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              placeholder="Family"
              v-model="specieData.family"
            />
          </label>

          <label class="block w-96 font-semibold">
            Status
            <select
              name="status"
              class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              v-model="specieData.status"
            >
              <option value="inProcess">In Process</option>
              <option value="done">Done</option>
            </select>
          </label>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { CircleStencil, Cropper, Preview } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';
import AgModal from '../UI/Modal/AgModal.vue';

export default {
  name: 'AgSpecie',
  components: { CircleStencil, Cropper, Preview, AgModal },
  setup() {
    /* Use router */
    const router = useRouter();
    const route = useRoute();

    /* Ref */
    const specieData = ref({ _id: null });
    const resultCropper = ref(null);
    const isOpenCropperModal = ref(false);

    /* Inject swal */
    const swal: any = inject('$swal');

    /* Thumbnail image */
    const thubmnailImage =
      'https://img.freepik.com/free-vector/image-photo-jpg-file-mountains-sun-landscape-picture-frame-3d-vector-icon-cartoon-minimal-style_365941-727.jpg';

    const imgCropper =
      'https://images.unsplash.com/photo-1600984575359-310ae7b6bdf2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80';

    const image = ref({
      src: '',
      type: '',
    });

    /* Methods */

    const getMimeType = (file: any, fallback = '') => {
      const byteArray = new Uint8Array(file).subarray(0, 4);
      let header = '';
      for (let i = 0; i < byteArray.length; i++) {
        header += byteArray[i].toString(16);
      }
      switch (header) {
        case '89504e47':
          return 'image/png';
        case '47494638':
          return 'image/gif';
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          return 'image/jpeg';
        default:
          return fallback;
      }
    };

    const loadImage = (event: any) => {
      // Reference to the DOM input element
      const { files } = event.target;
      // Ensure that you have a file before attempting to read it
      if (files && files[0]) {
        // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
        if (image.value.src) {
          URL.revokeObjectURL(image.value.src);
        }
        // 2. Create the blob link to the file to optimize performance:
        const blob = URL.createObjectURL(files[0]);

        // 3. The steps below are designated to determine a file mime type to use it during the
        // getting of a cropped image from the canvas. You can replace it them by the following string,
        // but the type will be derived from the extension and it can lead to an incorrect result:
        //
        // image.value = {
        //    src: blob;
        //    type: files[0].type
        // }

        // Create a new FileReader to read this image binary data
        const reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "image.value" refers to the image of Vue component
          image.value = {
            // Set the image source (it will look like blob:http://example.com/2c5270a5-18b5-406e-a4fb-07427f5e7b94)
            src: blob,
            // Determine the image type to preserve it during the extracting the image from canvas:
            type: e.target ? getMimeType(e.target.result, files[0].type) : '',
          };
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsArrayBuffer(files[0]);

        /* Open cropper modal */
        isOpenCropperModal.value = true;
      }
    };

    const changeCropper = (payload: any) => {
      console.log({ coordinate: payload.coordinates, canvas: payload.canvas });

      resultCropper.value = payload;
    };

    const goBack = () => {
      router.push({
        name: 'SpeciesList',
      });
    };

    const getSpecie = async () => {
      try {
        const result = await axios({
          method: 'POST',
          url: 'http://localhost:3000/graphql',
          data: {
            query: `
              query getSpecie($_id: String!) {
                specie(_id: $_id) {
                  _id
                  name
                  commonName
                  image
                  family
                  status
                }
              }
            `,
            variables: {
              _id: route.params._id,
            },
          },
        });

        specieData.value = result.data.data.specie;
      } catch (error) {
        console.error(error);
      }
    };

    const createSpecie = async () => {
      try {
        const result: any = await axios({
          method: 'POST',
          url: 'http://localhost:3000/graphql',
          data: {
            query: `
              mutation createSpecie($input: CreateSpecieInput!) {
                createSpecie(input: $input) {
                  _id
                  name
                  commonName
                  image
                  family
                  status
                }
              }
            `,
            variables: {
              input: { ...specieData.value },
            },
          },
        });

        if (result.data.data.createSpecie) return true;
        else return false;
      } catch (error) {
        console.error(error);
      }
    };

    const updateSpecie = async () => {
      try {
        const result: any = await axios({
          method: 'POST',
          url: 'http://localhost:3000/graphql',
          data: {
            query: `
              mutation updateSpecie($payload: UpdateSpecieInput!) {
                updateSpecie(payload: $payload) {
                  _id
                  name
                  commonName
                  image
                  family
                  status
                }
              }
            `,
            variables: {
              payload: { ...specieData.value },
            },
          },
        });

        if (result.data.data.updateSpecie) return true;
        else return false;
      } catch (error) {
        console.error(error);
      }
    };

    const saveSpecie = async () => {
      if (specieData.value._id) {
        const updated = await updateSpecie();

        if (updated)
          swal({
            title: 'Specied updated!',
            text: 'Specie info saved successfully.',
            icon: 'success',
          });
        else
          swal({
            title: 'Save error',
            text: 'An error ocurred.',
            icon: 'error',
          });
      } else {
        const created = await createSpecie();

        if (created)
          router.push({
            name: 'SpecieList',
          });
        else
          swal({
            title: 'Save error',
            text: 'An error ocurred.',
            icon: 'error',
          });
      }
    };

    onMounted(() => {
      if (route.params._id) getSpecie();
    });

    onUnmounted(() => {
      // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
      if (image.value.src) {
        URL.revokeObjectURL(image.value.src);
      }
    });

    return {
      specieData,
      thubmnailImage,
      imgCropper,
      image,
      resultCropper,
      isOpenCropperModal,
      goBack,
      saveSpecie,
      loadImage,
      changeCropper,
    };
  },
};
</script>
