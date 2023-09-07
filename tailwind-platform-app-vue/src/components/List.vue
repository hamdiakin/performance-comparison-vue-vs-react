<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">List of Items</h1>
    <!-- Sorting options -->
    <div class="mb-4">
      <label for="sortBy" class="mr-2">Sort by:</label>
      <select v-model="sortBy" @change="updateSortCriteria">
        <option value="name">Name</option>
        <option value="date_created">Date Created</option>
        <option value="id">ID</option>
      </select>
    </div>

    <!-- Render paginated and sorted list here -->
    <div>
      <div
        v-for="item in sortedAndPaginatedData"
        :key="item.id"
        class="bg-white shadow-md p-4 mb-4"
      >
        <h2 class="text-xl font-semibold">{{ item.name }}</h2>
        <p class="text-gray-600">Color: {{ item.color }}</p>
        <!-- Add more item attributes here -->
        <router-link :to="'/item/' + item.id" class="text-blue-500 hover:underline"
          >View Details</router-link
        >
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
    pagination: Pagination // Use pagination component from vue3-pagination
  },

  setup() {
    const data = ref([]) // Store fetched data here
    const currentPage = ref(1) // Current page for pagination
    const pageSize = 7 // Number of items per page
    const sortBy = ref('') // Sort by criteria (e.g., 'name', 'date_created', 'id')

    // Fetch data and initialize the component
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3004/platforms')
        data.value = response.data
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    const sortedAndPaginatedData = computed(() => {
      // Implement sorting and pagination logic here
      let sortedData = [...data.value]

      if (sortBy.value === 'name') {
        sortedData.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortBy.value === 'date_created') {
        sortedData.sort((a, b) => new Date(a.date_created) - new Date(b.date_created))
      } else if (sortBy.value === 'id') {
        sortedData.sort((a, b) => a.id - b.id)
      }

      const startIndex = (currentPage.value - 1) * pageSize
      return sortedData.slice(startIndex, startIndex + pageSize)
    })

    const totalPages = computed(() => {
      return Math.ceil(data.value.length / pageSize)
    })

    // Update sorting criteria without fetching data
    const updateSortCriteria = () => {
      // Update sorting criteria here
    }

    // Handle page change
    const handlePageChange = (newPage) => {
      currentPage.value = newPage
    }

    // Fetch data on component creation
    fetchData()

    // Watch for changes in sorting criteria and reset to the first page
    watch(sortBy, () => {
      currentPage.value = 1
    })

    return {
      data,
      currentPage,
      pageSize,
      sortBy,
      sortedAndPaginatedData,
      totalPages,
      updateSortCriteria,
      handlePageChange
    }
  }
}
</script>

<style scoped>
@import '@/assets/tailwind.css';
</style>
