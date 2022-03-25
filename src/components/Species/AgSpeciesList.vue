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
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="
                row.status === 'inProcess' ? 'bg-red-100' : 'bg-green-100'
              "
            >
              {{ getStatusLabel(row.status) }}
            </span>
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          >
            <a
              href="#"
              @click="showSpecie(row._id)"
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
  </div>
</template>

<script lang="ts">
import { onMounted, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import AgTable from '../UI/Table/AgTable.vue';
import axios from 'axios';

export default {
  components: {
    AgTable,
  },
  setup() {
    /* Ref */
    const specieData = ref({});

    /* Use router */
    const router = useRouter();

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
      router.push({
        name: 'Specie',
        params: {
          _id: '',
        },
      });
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

    const showSpecie = (_id: string) => {
      router.push({
        name: 'Specie',
        params: {
          _id,
        },
      });
    };

    onMounted(() => {
      getSpecies();
    });

    return {
      columns,
      species,
      specieData,
      addSpecie,
      getStatusLabel,
      swalDeleteSpecie,
      deleteSpecie,
      showSpecie,
    };
  },
};
</script>
