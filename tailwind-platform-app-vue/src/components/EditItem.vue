<template>
  <div>
    <div class="bg-white shadow-md p-4 rounded-lg w-96 mx-auto" v-if="item">
      <h2 className="text-2xl font-semibold mb-4">Edit Platform</h2>
      <form @submit.prevent="saveChanges" class="space-y-4">
        <div class="mb-4">
          <label for="platformName" class="block text-gray-700 font-semibold mb-2"
            >Platform Name</label
          >
          <input
            type="text"
            id="platformName"
            v-model="item.platformName"
            class="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div class="mb-4">
          <label for="inventoryDate" class="block text-gray-700 font-semibold mb-2"
            >Inventory Date</label
          >
          <datepicker
            v-model="selectedDate"
            format="dd.MM.yyyy"
            id="inventoryDate"
            name="inventoryDate"
            @change="updateDate"
            class="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            required
          ></datepicker>
        </div>
        <div class="mb-4">
          <label for="length" class="block text-gray-700 font-semibold mb-2">Length</label>
          <input
            type="number"
            id="length"
            v-model="item.length"
            class="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div class="mb-4">
          <label for="width" class="block text-gray-700 font-semibold mb-2">Width</label>
          <input
            type="number"
            id="width"
            v-model="item.width"
            class="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div class="mb-4">
          <label for="height" class="block text-gray-700 font-semibold mb-2">Height</label>
          <input
            type="number"
            id="height"
            v-model="item.height"
            class="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div class="mb-4">
          <label for="maxSpeed" class="block text-gray-700 font-semibold mb-2">Max Speed</label>
          <input
            type="number"
            id="maxSpeed"
            v-model="item.maxSpeed"
            class="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div class="mb-4">
          <label for="minSpeed" class="block text-gray-700 font-semibold mb-2">Min Speed</label>
          <input
            type="number"
            id="minSpeed"
            v-model="item.minSpeed"
            class="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div class="mb-4">
          <label for="platformType" class="block text-gray-700 font-semibold mb-2"
            >Platform Type</label
          >
          <select
            multiple
            id="platformType"
            v-model="item.platformType"
            class="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            required
          >
            <option value="Platform A">Platform A</option>
            <option value="Platform B">Platform B</option>
            <!-- Add more options as needed -->
          </select>
        </div>
        <div class="flex justify-center space-x-2">
          <button
            type="submit"
            class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Save Changes
          </button>
          <router-link :to="'/item/' + item.id" class="text-blue-500 hover:underline ml-2"
            >Cancel</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import DatePicker from 'vue3-datepicker'

export default {
  data() {
    return {
      item: null, // Store item data here
      selectedDate: null // Store selected date here
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

        // Set the selected date for the datepicker
        this.selectedDate = this.item.inventoryDate ? new Date(this.item.inventoryDate) : null
      } catch (error) {
        console.error('Error fetching item data:', error)
      }
    },
    // Method to update the date field
    updateDate(newDate) {
      this.item.inventoryDate = newDate
    },
    // Method to save changes and update the item
    async saveChanges() {
      try {
        const itemId = this.$route.params.id
        await axios.put(`http://localhost:3004/platforms/${itemId}`, this.item)
        this.$router.push(`/item/${itemId}`)
      } catch (error) {
        console.error('Error saving changes:', error)
      }
    }
  },
  components: {
    datepicker: DatePicker
  }
}
</script>

<style scoped>
/* Add Tailwind CSS classes for styling */
</style>
