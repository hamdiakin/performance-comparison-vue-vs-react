<template>
  <div>
    <div class="bg-white shadow-md p-4" v-if="item">
      <h2 class="text-xl font-semibold">{{ item.name }}</h2>
      <p class="text-gray-600">Color: {{ item.color }}</p>
      <!-- Display other item attributes here -->
    </div>
    <div class="mt-4">
      <router-link to="/" class="text-blue-500 hover:underline"> Back to List </router-link>
      <button @click="navigateToEdit" class="text-blue-500 hover:underline ml-2">Edit</button>
      <button @click="deleteItem" class="text-red-500 hover:underline ml-2">Delete</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      item: null // Store item data here
    }
  },
  created() {
    // Fetch item data and initialize the component
    this.fetchItemData()
  },
  methods: {
    // Method to fetch item data
    async fetchItemData() {
      try {
        const itemId = this.$route.params.id
        const response = await axios.get(`http://localhost:3004/platforms/${itemId}`)
        this.item = response.data
      } catch (error) {
        console.error('Error fetching item data:', error)
      }
    },
    // Method to navigate to the edit page
    navigateToEdit() {
      const itemId = this.$route.params.id
      this.$router.push(`/item/${itemId}/edit`)
    },
    // Method to delete the item
    async deleteItem() {
      try {
        const itemId = this.$route.params.id
        await axios.delete(`http://localhost:3004/platforms/${itemId}`)
        this.$router.push('/')
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }
}
</script>

<style scoped>
/* Add Tailwind CSS classes for styling */
</style>
