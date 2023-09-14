<template>
  <div>
    <div class="bg-white shadow-md p-4" v-if="item">
      <h2 class="text-xl font-semibold">Platform Name: {{ item[0].platformName }}</h2>
      <p class="text-gray-600">Platform ID: {{ item[0].id }}</p>
      <p class="text-gray-600">Inventory Date: {{ item[0].inventoryDate }}</p>
      <p class="text-gray-600">Length: {{ item[0].length }}</p>
      <p class="text-gray-600">Width: {{ item[0].width }}</p>
      <p class="text-gray-600">Height: {{ item[0].height }}</p>
      <p class="text-gray-600">Max Speed: {{ item[0].maxSpeed }}</p>
      <p class="text-gray-600">Min Speed: {{ item[0].minSpeed }}</p>
    </div>
    <div class="mt-4">
      <router-link to="/" class="text-blue-500 hover:underline">Back to List</router-link>
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
      item: null
    };
  },
  created() {
    this.fetchItemData();
  },
  methods: {
    async fetchItemData() {
      try {
        const itemId = this.$route.params.id;
        const response = await axios.get(`http://localhost:3004/platforms?id=${itemId}`);
        const itemData = response.data;

        if (Array.isArray(itemData) && itemData.length > 0) {
          this.item = itemData;
        } else {
          console.warn("No data found for ID:", itemId);
          this.item = [];
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
        this.item = [];
      }
    },
    navigateToEdit() {
      const itemId = this.$route.params.id;
      this.$router.push(`/item/${itemId}/edit`);
    },
    async deleteItem() {
      try {
        const itemId = this.$route.params.id;
        await axios.delete(`http://localhost:3004/platforms/${itemId}`);
        this.$router.push('/');
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Add Tailwind CSS classes for styling */
</style>
