<template>
  <div id="ag_species_list" class="px-10">
    <div class="grid grid-cols-3 gap-4 bg-green-100 mb-5">
      <div class="px-4">
        <h1 class="font-bold text-4xl float-left">Germination List</h1>
      </div>
      <div class="invisible"></div>
      <div class="py-3 pr-4">
        <button
          class="float-right rounded-full px-2 p-1 text-white bg-gray-500 hover:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300"
          @click="addSpecie()"
        >
          Add Specie
        </button>
      </div>
    </div>

    <AgTable>
      <template #headers>
        <tr>
          <th
            v-for="(column, columnIndex) in columns"
            :key="columnIndex"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ column.label }}
          </th>
          <th scope="col" class="relative px-6 py-3">
            <span class="sr-only">Edit</span>
          </th>
        </tr>
      </template>

      <template #default>
        <tr v-for="(row, rowIndex) in species" :key="rowIndex">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <img class="h-10 w-10 rounded-full" :src="row.image" alt="" />
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ row.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ row.commonName }}
                </div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">
              {{ row.family }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              class="inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-green-800"
            >
              {{ getStatusLabel(row.status) }}
            </span>
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          >
            <a
              href="#"
              @click="editSpecie(row)"
              class="text-indigo-600 hover:text-indigo-900 mr-2"
              ><FontAwesomeIcon :icon="['fas', 'pen']"
            /></a>
            <a
              href="#"
              @click="swalDeleteSpecie(row._id)"
              class="text-red-500 hover:text-red-700"
              ><FontAwesomeIcon :icon="['fas', 'trash']"
            /></a>
          </td>
        </tr>
      </template>
    </AgTable>

    <AgModal :isOpen="isOpenModal">
      <template #default>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl">
            <span v-if="specieData._id">Edit</span
            ><span v-else>Add</span>&nbsp;Specie
          </h3>
          <svg
            @click="isOpenModal = false"
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 text-red-900 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="mt-4">
          <form id="specieForm" @submit.prevent="saveSpecie()">
            <label class="block w-96 mb-5">
              <input
                v-if="!specieData._id"
                type="text"
                name="image"
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Image URL"
                v-model="specieData.image"
              />
              <img v-else :src="specieData.image" width="100" />
            </label>

            <label class="block w-96 mb-5">
              <input
                type="text"
                name="name"
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Name"
                v-model="specieData.name"
              />
            </label>

            <label class="block w-96 mb-5">
              <input
                type="text"
                name="commonName"
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Common Name"
                v-model="specieData.commonName"
              />
            </label>

            <label class="block w-96 mb-5">
              <input
                type="text"
                name="family"
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Family"
                v-model="specieData.family"
              />
            </label>

            <label class="block w-96 mb-5">
              <select
                name="status"
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                v-model="specieData.status"
              >
                <option value="inProcess">In Process</option>
                <option value="done">Done</option>
              </select>
            </label>

            <button
              class="px-6 py-2 text-blue-800 border border-blue-600 rounded float-right"
              @click="isOpenModal = false"
            >
              Cancel
            </button>
            <button
              class="px-6 py-2 mr-2 text-blue-100 border border-blue-100 bg-blue-600 rounded float-right"
              @click="createSpecie()"
            >
              Save
            </button>
          </form>
        </div>
      </template>
    </AgModal>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, inject } from 'vue';
import AgTable from '../UI/Table/AgTable.vue';
import AgModal from '../UI/Modal/AgModal.vue';
import axios from 'axios';

export default {
  components: {
    AgTable,
    AgModal,
  },
  setup() {
    /* Ref */
    const isOpenModal = ref(false);
    const specieData = ref({});

    /* Inject swal */
    const swal: any = inject('$swal');

    /* Static info */
    const columns = ref([
      {
        prefix: 'name',
        label: 'Name',
      },
      {
        prefix: 'family',
        label: 'Family',
      },
      {
        prefix: 'status',
        label: 'Status',
      },
    ]);

    const species: any = ref([]);

    /* Methods */

    const addSpecie = () => {
      specieData.value = {};

      isOpenModal.value = true;
    };

    const editSpecie = (specie: any) => {
      specieData.value = specie;

      isOpenModal.value = true;
    };

    const saveSpecie = () => {
      console.log({ specieData });
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

        if (result.data.data.createSpecie) {
          species.value.push(result.data.data.createSpecie);

          isOpenModal.value = false;
        }
      } catch (error) {
        console.error(error);
      }
    };

    /* Get graphql species */
    const getSpecies = async () => {
      try {
        const result = await axios({
          method: 'POST',
          url: 'http://localhost:3000/graphql',
          data: {
            query: `
              {
                species {
                  _id
                  name
                  commonName
                  image
                  family
                  status
                }
              }
            `,
          },
        });

        species.value = result.data.data.species;
      } catch (error) {
        console.error(error);
      }
    };

    getSpecies();

    const deleteSpecie = async (_id: string) => {
      try {
        const result: any = await axios({
          method: 'POST',
          url: 'http://localhost:3000/graphql',
          data: {
            query: `
              mutation deleteSpecie($_id: String!) {
                deleteSpecie(_id: $_id) {
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
              _id,
            },
          },
        });

        if (result.data.data.deleteSpecie)
          species.value.splice(
            species.value.findIndex((specie: any) => specie._id === _id),
            1
          );
      } catch (error) {
        console.error(error);
      }
    };

    const swalDeleteSpecie = (_id: string) => {
      swal({
        title: 'Delete Specie',
        text: 'Are you sure to delete this specie?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#d33',
      }).then((result: any) => {
        if (result.isConfirmed) deleteSpecie(_id);
      });
    };

    const getStatusLabel = (status: string) => {
      return status === 'inProcess' ? 'In Process' : 'Done';
    };

    onMounted(() => {
      getSpecies();
    });

    return {
      isOpenModal,
      columns,
      species,
      specieData,
      addSpecie,
      editSpecie,
      saveSpecie,
      getStatusLabel,
      createSpecie,
      swalDeleteSpecie,
      deleteSpecie,
    };
  },
};
</script>
