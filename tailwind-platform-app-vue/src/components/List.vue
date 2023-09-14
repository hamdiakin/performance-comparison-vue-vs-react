<template>
  <div class="bg-white p-4 shadow-md rounded-lg">
    <h1 class="text-2xl font-bold mb-4">List of Platforms</h1>
    <!-- Sorting options -->
    <div class="mb-4">
      <label for="sortBy" class="mr-2">Sort by:</label>
      <select v-model="sortBy" @change="updateSortCriteria">
        <option value="platformName">Platform Name</option>
        <option value="inventoryDate">Date Created</option>
        <option value="platformId">ID</option>
      </select>
    </div>

    <!-- Render paginated and sorted list here -->
    <div>
      <div
        v-for="item in sortedAndPaginatedData"
        :key="item.id"
        class="bg-white shadow-md p-4 mb-4 rounded-lg"
      >
        <h2 class="text-xl font-semibold mb-2">Platform Name: {{ item.platformName }}</h2>
        <p class="text-gray-600 mb-2">Platform ID: {{ item.id }}</p>
        <p class="text-gray-600 mb-2">Inventory Date: {{ item.inventoryDate }}</p>
        <div class="mb-4 relative">
          <label class="text-gray-600">Platform Type:</label>
          <div class="custom-dropdown">
            <span @click="toggleDropdown" class="custom-dropdown-toggle cursor-pointer">
              {{ item.platformType[0].name }}
            </span>
            <div v-if="isOpen" class="custom-dropdown-content">
              <div v-for="type in item.platformType" :key="type.id" class="custom-dropdown-option">
                {{ type.name }}
              </div>
            </div>
          </div>
        </div>
        <router-link :to="'/item/' + item.id" class="text-blue-500 hover:underline">
          View Details
        </router-link>
      </div>
    </div>  

    <!-- Pagination -->
    <pagination
      v-model="currentPage"
      :pages="totalPages"
      :range-size="2"
      active-color="#DCEDFF"
      @update:modelValue="handlePageChange"
      class="mt-4"
    ></pagination>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, computed, watch } from 'vue'
import Pagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'

export default {
  components: {
    pagination: Pagination
  },

  setup() {
    const data = ref([])
    const currentPage = ref(1)
    const pageSize = 7
    const sortBy = ref('platformName') // Set the initial sorting criteria

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3004/platforms')
        data.value = response.data
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    const sortedAndPaginatedData = computed(() => {
      let sortedData = [...data.value]

      if (sortBy.value === 'platformName') {
        sortedData.sort((a, b) => a.platformName.localeCompare(b.platformName))
      } else if (sortBy.value === 'inventoryDate') {
        sortedData.sort((a, b) => new Date(a.inventoryDate) - new Date(b.inventoryDate))
      } else if (sortBy.value === 'platformId') {
        sortedData.sort((a, b) => a.id - b.id)
      }

      const startIndex = (currentPage.value - 1) * pageSize
      return sortedData.slice(startIndex, startIndex + pageSize)
    })

    const totalPages = computed(() => {
      return Math.ceil(data.value.length / pageSize)
    })

    const updateSortCriteria = () => {
      // Update sorting criteria when changed
      fetchData() // Fetch data again after changing the sorting criteria
    }

    const handlePageChange = (newPage) => {
      currentPage.value = newPage
    }

    fetchData() // Fetch data on component creation

    watch(sortBy, () => {
      currentPage.value = 1 // Reset to the first page when changing sorting criteria
    })

    return {
      data,
      currentPage,
      pageSize,
      sortBy,
      sortedAndPaginatedData,
      totalPages,
      updateSortCriteria,
      handlePageChange,
      toggleDropdown() {
        // Define toggleDropdown method
        isOpen.value = !isOpen.value
      },
      isOpen: ref(false) // Initialize isOpen as a ref
    }
  }
}
</script>

<style scoped>
@import '@/assets/tailwind.css';
</style>
