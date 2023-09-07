<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Edit Item</h1>
    <div class="bg-white shadow-md p-4" v-if="item">
      <!-- Render edit form here -->
      <form @submit.prevent="saveChanges">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 font-bold mb-2">Name:</label>
          <input
            type="text"
            id="name"
            v-model="item.name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div class="mb-4">
          <label for="color" class="block text-gray-700 font-bold mb-2">Color:</label>
          <input
            type="text"
            id="color"
            v-model="item.color"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <!-- Add more form fields for other item attributes here -->
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
          <router-link :to="'/item/' + item.id" class="text-blue-500 hover:underline ml-2">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      item: null, // Store item data here
    };
  },
  created() {
    // Fetch item data and initialize the component
    this.fetchItemData();
  },
  methods: {
    // Method to fetch item data
    async fetchItemData() {
      try {
        const itemId = this.$route.params.id;
        const response = await axios.get(`http://localhost:3004/platforms/${itemId}`);
        this.item = response.data;
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    },
    // Method to save changes and update the item
    async saveChanges() {
      try {
        const itemId = this.$route.params.id;
        await axios.put(`http://localhost:3004/platforms/${itemId}`, this.item);
        this.$router.push(`/item/${itemId}`);
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Add Tailwind CSS classes for styling */
</style>
