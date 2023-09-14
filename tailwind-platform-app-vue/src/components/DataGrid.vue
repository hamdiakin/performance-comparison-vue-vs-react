<template>
  <div class="bg-white p-4 shadow-md rounded-lg">
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row class="mb-4 justify-evenly">
      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filter"
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Type to Search"
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="clearFilter">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Per page"
          label-for="per-page-select"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="sm"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      :items="sortedAndFilteredData"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filter-included-fields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      stacked="md"
      show-empty
      small
      @filtered="onFiltered"
    >
      <!-- Customize the columns as needed -->
      <template #cell(platformName)="row">
        {{ row.item.platformName }}
      </template>
      <template #cell(id)="row">
        {{ row.item.id }}
      </template>
      <template #cell(inventoryDate)="row">
        {{ row.item.inventoryDate }}
      </template>
      <template #cell(length)="row">
        {{ row.item.length }}
      </template>
      <template #cell(width)="row">
        {{ row.item.width }}
      </template>
      <template #cell(height)="row">
        {{ row.item.height }}
      </template>
      <template #cell(maxSpeed)="row">
        {{ row.item.maxSpeed }}
      </template>
      <template #cell(minSpeed)="row">
        {{ row.item.minSpeed }}
      </template>
      <template #cell(actions)="row">
        <!-- Add your action buttons here -->
        <b-button size="sm" @click="viewItem(row.item)" variant="success">View</b-button>
        <b-button size="sm" @click="editItem(row.item)" variant="primary">Edit</b-button>
        <b-button size="sm" @click="confirmDelete(row.item)" variant="danger">Delete</b-button>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      align="fill "
      size="sm"
      class="my-0"
    ></b-pagination>
  </b-container>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      data: [], // Store your data here
      fields: [
        { key: 'platformName', label: 'Platform Name', sortable: true },
        { key: 'id', label: 'ID', sortable: true },
        { key: 'inventoryDate', label: 'Inventory Date', sortable: true },
        { key: 'length', label: 'Length', sortable: true },
        { key: 'width', label: 'Width', sortable: true },
        { key: 'height', label: 'Height', sortable: true },
        { key: 'maxSpeed', label: 'Max Speed', sortable: true },
        { key: 'minSpeed', label: 'Min Speed', sortable: true },
        { key: 'actions', label: 'Actions' } // Added actions column
      ],
      sortBy: '',
      sortDesc: false,
      filter: null,
      pageOptions: [5, 10, 15, { value: 100, text: 'Show a lot' }],
      filterOn: [],
      currentPage: 1,
      perPage: 10,
      totalRows: 0
    }
  },
  computed: {
    // Computed property to filter and sort data based on user selections
    sortedAndFilteredData() {
      let data = [...this.data]

      if (this.filter) {
        const filter = this.filter.toLowerCase()
        data = data.filter((item) => {
          return Object.values(item).some((value) => {
            if (typeof value === 'string') {
              return value.toLowerCase().includes(filter)
            }
            return false
          })
        })
      }

      if (this.sortBy) {
        data = data.sort((a, b) => {
          const fieldA = a[this.sortBy]
          const fieldB = b[this.sortBy]
          if (this.sortDesc) {
            return fieldA > fieldB ? -1 : 1
          } else {
            return fieldA > fieldB ? 1 : -1
          }
        })
      }

      return data
    }
  },
  methods: {
    // Add your edit and delete item methods here
    editItem(item) {
      // Handle edit item action
      console.log('Edit item:', item)
      this.$router.push(`/item/${item.id}`)
    },
    confirmDelete(item) {
      // You can display a confirmation dialog here
      if (confirm(`Are you sure you want to delete ${item.platformName}?`)) {
        // Perform the delete action, for example, making an API request
        this.deleteItem(item)
      }
    },
    deleteItem(item) {
      // Implement the delete logic here, for example, making an API request
      // After successful deletion, you can update the view or take any other action
      console.log(`Deleted item with ID ${item.id}`)

      // If you want to refresh the data after deletion, you can call fetchData() again
      this.fetchData()
    },
    viewItem(item) {
      // Handle view item action
      console.log('View item:', item)
      this.$router.push(`/item/${item.id}`)
    },
    clearFilter() {
      this.filter = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    updateSort(sortBy) {
      if (this.sortBy === sortBy) {
        this.sortDesc = !this.sortDesc
      } else {
        this.sortBy = sortBy
        this.sortDesc = false
      }
    }
  },
  mounted() {
    // Fetch data from your API using Axios
    axios
      .get('http://localhost:3004/platforms')
      .then((response) => {
        this.data = response.data
        this.totalRows = this.data.length
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }
}
</script>

<style scoped>
/* Add Tailwind CSS classes for styling */
</style>
