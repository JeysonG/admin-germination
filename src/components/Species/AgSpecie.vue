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

    <form id="specieForm">
      <div
        class="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6"
      >
        <img
          class="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0"
          :src="specieData.image ? specieData.image : thubmnailImage"
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
import { onMounted, ref, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

export default {
  name: 'AgSpecie',
  setup() {
    /* Use router */
    const router = useRouter();
    const route = useRoute();

    /* Ref */
    const specieData = ref({ _id: null });

    /* Inject swal */
    const swal: any = inject('$swal');

    /* Thumbnail image */
    const thubmnailImage =
      'https://img.freepik.com/free-vector/image-photo-jpg-file-mountains-sun-landscape-picture-frame-3d-vector-icon-cartoon-minimal-style_365941-727.jpg';

    /* Methods */

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

    return {
      specieData,
      thubmnailImage,
      goBack,
      saveSpecie,
    };
  },
};
</script>
